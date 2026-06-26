# Sage — System Architecture

## Overview

Sage is a full-stack RAG system. The backend runs a hybrid retrieval pipeline (ChromaDB + BM25) fused with Reciprocal Rank Fusion, and streams LLM responses via Server-Sent Events. The frontend is a React SPA with bilingual support and dark/light mode.

```
┌──────────────────────────────────────────────────────────────┐
│                React SPA (localhost:5174)                     │
│                                                              │
│  HeroSection  →  ChatSection  →  HowItWorksSection           │
│                     │                                        │
│               ChatWindow + ChatInput                         │
│               MessageBubble + SourcesPanel                   │
│               StatusSidebar (example questions)              │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP POST + SSE (Server-Sent Events)
                       ▼
┌──────────────────────────────────────────────────────────────┐
│              FastAPI Server (localhost:8504)                  │
│                                                              │
│  GET  /health       GET  /status                             │
│  POST /ask          POST /ask/stream                         │
│  POST /feedback     POST /rebuild                            │
│                                                              │
│  ThreadPoolExecutor (2 workers) for blocking I/O             │
└──────────┬───────────────────────────┬───────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────────┐   ┌──────────────────────────────────┐
│    RAG Pipeline      │   │       LLM Integration            │
│                      │   │                                  │
│  rewrite_query()     │   │  gpt-4o-mini (streaming)         │
│  ─────────────       │   │  Conversation history (6 msgs)   │
│  ChromaDB query      │   │  Bilingual system prompts        │
│  BM25 scoring        │   │  asyncio.Queue bridge            │
│  RRF fusion (k=60)   │   │  (sync gen → async SSE)          │
│  Distance filter     │   │                                  │
│  (threshold 0.6)     │   └──────────────────────────────────┘
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Data Layer                                 │
│                                                              │
│  data/raw/                                                   │
│  ├── destinations.csv        (20 destinations)               │
│  ├── sustainability_scores.csv (20 rows — INE/FRONTUR)       │
│  ├── congestion_scores.csv  (240 rows — 12 months × 20)      │
│  └── bookings_history.csv   (~1,000 synthetic records)       │
│                                                              │
│  data/chroma/               (ChromaDB persistent store)      │
│  └── tui_destinations       (21 bilingual documents)         │
│                                                              │
│  data/feedback.jsonl        (user feedback log)              │
└──────────────────────────────────────────────────────────────┘
```

---

## 5-Layer Framework

| Layer | Name | Sage Implementation |
|---|---|---|
| L1 | Unified Ingestion | `data_loader.py` reads 4 CSVs; auto-detects Horizon's data folder |
| L2 | Prediction Engine | `knowledge_base.py` — ChromaDB + BM25 + RRF + relevance filter |
| L3 | Intervention Triggers | System prompts embed Horizon bonus/penalty rules; documents encode thresholds |
| L4 | Personalization | Bilingual chat; query rewriting for multi-turn coherence; streaming UI |
| L5 | Governance | `/status` endpoint; `feedback.jsonl` auditable satisfaction log |

---

## Backend Modules

### `src/api/app.py` — FastAPI Application

- Six endpoints: `/health`, `/status`, `/ask`, `/ask/stream`, `/feedback`, `/rebuild`
- CORS restricted to `localhost:5174`
- `ThreadPoolExecutor(max_workers=2)` for all blocking operations
- Lifespan event builds KB on startup if not present
- `_doc_to_source()` selects Spanish or English text from documents based on `request.lang`

### `src/api/models.py` — Pydantic Schemas

```python
class ConversationMessage:
    role: str           # "user" | "assistant"
    content: str

class AskRequest:
    question: str       # 1–2000 chars
    n_results: int      # 1–10, default 5
    history: list[ConversationMessage]  # default []
    lang: str           # "es" | "en", default "es"

class SourceDocument:
    destination_name: str
    text: str
    relevance: float    # 0–1 (1 = perfect match)

class AskResponse:
    answer: str
    sources: list[SourceDocument]
    question: str

class StatusResponse:
    kb_built: bool
    api_key_set: bool
    collection_name: str
    document_count: int
    status: str         # "ready" | "kb_missing" | "api_key_missing" | "error"

class FeedbackRequest:
    message_id: str
    answer: str
    feedback: str       # "up" | "down"
```

### `src/config/settings.py` — Configuration

```python
BASE_DIR               = project root (src/../../)
CHROMA_DIR             = BASE_DIR / "data" / "chroma"
COLLECTION_NAME        = "tui_destinations"
RELEVANCE_THRESHOLD    = 0.6
MONTH_NAMES            = ["Enero", ..., "Diciembre"]   # Spanish
SUSTAINABILITY_TIERS   = {(85,101): "Excelente", (70,85): "Bueno",
                          (55,70): "Moderado",   (0,55): "Deficiente"}

def get_api_key() -> str          # reads OPENAI_API_KEY, raises ValueError if missing
def sustainability_tier(score)    # returns tier label string
```

### `src/rag/knowledge_base.py` — Hybrid Retrieval

```
Module-level singletons (lazily initialised):
  _client: chromadb.PersistentClient
  _bm25: BM25Okapi | None         ← reset to None on rebuild
  _bm25_corpus: list[dict] | None ← reset to None on rebuild

query(text, n_results=5) → list[dict]:
  1. Ensure BM25 index built (_build_bm25_index)
  2. Semantic: collection.query(query_texts=[text], n_results=n_candidates)
  3. BM25: score all docs, sort descending
  4. RRF: score = 1/(60 + rank + 1), sum across both rankers
  5. Filter: distance <= 0.6 (fallback to top semantic if none pass)
  6. Return top n_results sorted by RRF score
```

### `src/rag/document_builder.py` — Document Construction

```
build_destination_documents() → list[dict]:
  For each of 20 destinations:
    1. Compute avg congestion, peak month, overloaded months (congestion > 80)
    2. Compute avg rating from bookings
    3. Determine sustainability tier
    4. Build Spanish text paragraph with embedded Horizon rules
    5. Build English text paragraph (same structure)
    6. Return {id, text: spanish, metadata: {... text_en: english[:800]}}

  Append suite_context document (id="suite_context")
  On any CSV load failure: return _fallback_documents() (1 generic document)
```

### `src/llm/claude_client.py` — LLM Wrapper

```
Constants:
  MODEL = "gpt-4o-mini"
  MAX_HISTORY_TURNS = 6

rewrite_query(question, history) → str:
  Skip if len(history) < 2
  Call LLM with rewriting system prompt + last 4 history messages
  max_tokens=100; fallback to original question if empty

ask(question, context_docs, history, lang) → str:
  _build_messages() → LLM → return full response string

stream_ask(question, context_docs, history, lang) → Iterator[str]:
  _build_messages() → LLM (stream=True) → yield each delta.content
```

---

## Frontend Modules

### Data Flow

```
User types question
    │
    ▼
useSageStream.sendMessage(question)
    │
    ├─► capture history from messagesRef.current (exclude streaming msgs)
    ├─► add userMsg + empty assistantMsg to messages state
    │
    ▼
streamAsk(question, history, lang, 5) [sageApi.ts]
    │
    ├─► POST /api/ask/stream
    ├─► read SSE line by line
    │
    ▼
for await event of streamAsk:
    │
    ├─► event.type === 'source'
    │       setMessages: add source to assistantMsg.sources
    │
    ├─► event.type === 'token'
    │       setMessages: append content to assistantMsg.content
    │
    ├─► event.type === 'done'
    │       setMessages: set assistantMsg.isStreaming = false
    │
    └─► event.type === 'error'
            setError, setMessages: set error fallback text
```

### Component Tree

```
App.tsx
└── AppProvider [context: lang, mode]
    └── ThemedApp
        └── ThemeProvider [MUI theme based on mode]
            └── CssBaseline
                └── Chat.tsx
                    ├── Header.tsx
                    │   ├── Logo
                    │   ├── Nav (Destinos · Cómo · Suite)
                    │   ├── LangToggle [flagcdn.com flag image]
                    │   ├── ModeToggle [DarkModeIcon | LightModeIcon]
                    │   └── CTA Button → scroll to #chat-widget
                    │
                    ├── HeroSection.tsx
                    │   ├── Badge + h1 + subtitle
                    │   ├── StatsBar (4 KPI chips)
                    │   └── Example chips → sendMessage()
                    │
                    ├── ChatSection.tsx [id="chat"]
                    │   └── Chat widget [id="chat-widget"]
                    │       ├── ChatWindow.tsx [containerRef scroll]
                    │       │   ├── Empty state
                    │       │   └── MessageBubble.tsx × N
                    │       │       ├── LoadingDots (while streaming)
                    │       │       ├── SourcesPanel.tsx (expandable)
                    │       │       └── ThumbUp/Down buttons
                    │       ├── StatusSidebar.tsx
                    │       │   ├── StatusChip (KB status)
                    │       │   ├── Example Qs
                    │       │   └── Steps
                    │       └── ChatInput.tsx
                    │
                    ├── HowItWorksSection.tsx [id="how"]
                    │   └── 4 step cards
                    │
                    └── Footer.tsx [id="footer"]
                        ├── Suite project cards (5)
                        └── Tech stack tags
```

---

## Streaming Sequence Diagram

```
Browser               FastAPI              ChromaDB             OpenAI API
   │                     │                    │                     │
   │ POST /ask/stream     │                    │                     │
   │────────────────────►│                    │                     │
   │                     │ rewrite_query()     │                     │
   │                     │────────────────────────────────────────►│
   │                     │◄────────────────────────────────────────│
   │                     │                    │                     │
   │                     │ collection.query()  │                     │
   │                     │───────────────────►│                     │
   │                     │◄───────────────────│                     │
   │                     │                    │                     │
   │◄── SSE: source ─────│                    │                     │
   │◄── SSE: source ─────│                    │                     │
   │                     │                    │                     │
   │                     │ stream_ask() [thread]                    │
   │                     │────────────────────────────────────────►│
   │◄── SSE: token ───── │◄── chunk ───────────────────────────────│
   │◄── SSE: token ───── │◄── chunk ───────────────────────────────│
   │◄── SSE: token ───── │◄── chunk ───────────────────────────────│
   │◄── SSE: done ───────│◄── [stream end] ────────────────────────│
```

---

## Data Sources

| Source | Dataset | Access | Used For |
|---|---|---|---|
| INE EOH | Table 49371 — hotel occupancy by province | Free JSON API | Congestion scores (12 months × 20 destinations) |
| FRONTUR | Table 23988 — international arrivals by CCAA | Free JSON API | Sustainability score enrichment |
| Synthetic | destinations.csv, bookings_history.csv | CSV files | Destination attributes, popularity scoring |
| sentence-transformers | all-MiniLM-L6-v2 | Downloaded on first run (~80MB) | ChromaDB document embeddings |
| flagcdn.com | Flag images CDN | External URL | Language toggle button (ES/EN flags) |

---

## Deployment Notes

- Designed for local development and academic demonstration
- No database — ChromaDB is file-based (`data/chroma/`)
- CORS restricted to `localhost:5174` — update `allow_origins` in `app.py` for production
- `OPENAI_API_KEY` must be set as an environment variable — never hardcoded
- The embedding model is downloaded once by ChromaDB on first run — requires internet access
- `feedback.jsonl` and `data/chroma/` are gitignored — rebuilt and accumulated per-user
