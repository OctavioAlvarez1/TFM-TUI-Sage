# Sage — RAG-Powered AI Destination Advisor

> Reto 5 · TUI Care Foundation Future Shapers Spain · UCM TFM 2026

Sage is the AI brain of the TUI Care Foundation Suite. It answers natural-language questions about Spain's 20 tourism destinations using Retrieval-Augmented Generation (RAG) — grounding every answer in real sustainability, congestion, and booking data from the Horizon dataset.

---

## Features

- **Streaming chat** — token-by-token responses via Server-Sent Events
- **Hybrid retrieval** — BM25 keyword search + ChromaDB semantic search fused with Reciprocal Rank Fusion (RRF)
- **Query rewriting** — follow-up questions are rewritten into standalone retrieval queries using the LLM
- **Conversation history** — last 3 conversation turns sent as context (6 messages)
- **Relevance threshold** — documents with distance > 0.6 are filtered out before answering
- **Bilingual** — full ES/EN UI and bilingual knowledge base (Spanish primary, English in metadata)
- **Dark / light mode** — persisted in localStorage, toggles via header
- **Source attribution** — every answer shows which destination documents were retrieved
- **Feedback** — thumbs up/down per message, logged to `data/feedback.jsonl`
- **Auto KB build** — ChromaDB knowledge base built automatically on first run (~30s)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python · FastAPI · uvicorn |
| AI Generation | OpenAI-compatible API (`gpt-4o-mini`) |
| Vector Store | ChromaDB (persistent, local) |
| Keyword Search | rank-bm25 (BM25Okapi) |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` (ChromaDB default) |
| Streaming | sse-starlette (SSE) · asyncio.Queue bridge |
| Frontend | React 19 · MUI v6 · Vite · TypeScript |
| Data | pandas 2.2+ |

---

## Quick Start

### 1. Prerequisites

```bash
# Python 3.11+ and Node.js 20+ required

# Set API key (required)
$env:OPENAI_API_KEY="sk-..."         # PowerShell
export OPENAI_API_KEY="sk-..."       # Linux/Mac
```

### 2. Backend

```bash
# Install Python dependencies
pip install -r requirements.txt
# Note: first install downloads ~80MB embedding model (sentence-transformers)

# Start FastAPI backend (port 8504)
python -m uvicorn src.api.app:app --reload --port 8504
```

On first start, Sage builds the ChromaDB knowledge base automatically (~30 seconds).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5174
```

### Legacy Streamlit (optional)

```bash
streamlit run app.py --server.port 8504
```

---

## Data Setup

Sage auto-detects data when both repos are on the same Desktop:

```
Desktop/
├── TUI-Smart-Destination-Recommender/   ← has data/raw/*.csv
└── TUI-Sage/                             ← auto-detects it
```

ChromaDB is persisted to `data/chroma/` (gitignored). On first run:
1. All CSVs are loaded (destinations, sustainability, congestion, bookings)
2. 21 documents are built — 20 destination docs + 1 suite context doc
3. Embeddings are computed and stored; BM25 index is built lazily on first query

To rebuild after CSV data changes:

```bash
curl -X POST http://localhost:8504/rebuild
```

---

## RAG Pipeline

```
User question (React ChatInput)
    ↓
Query rewriting (LLM rewrites follow-ups into standalone queries)
    ↓
Hybrid retrieval
  ├── Semantic search: ChromaDB cosine similarity (n_candidates = max(n_results×3, 15))
  ├── Keyword search:  BM25Okapi ranking
  └── RRF fusion:      score = 1/(60 + rank + 1) — combines both rankers
    ↓
Relevance filter (distance ≤ 0.6; fallback to top-N if all filtered)
    ↓
POST /ask/stream — FastAPI SSE
    ↓
SSE: source events (5 destination docs + relevance scores)
    ↓
LLM streaming (gpt-4o-mini) with conversation history + bilingual system prompt
    ↓
SSE: token events (streamed token-by-token)
    ↓
SSE: done event
    ↓
React: ChatWindow renders progressively + SourcesPanel shows sources
```

### Document Structure

Each ChromaDB document contains:
- **text** — Spanish rich-text description (sustainability scores, congestion stats, peak months, Horizon business rules)
- **metadata.text_en** — English version (first 800 chars, selected at API response time based on `lang`)
- **metadata** — destination_id, destination_name, destination_type, region, sustainability_score, avg_congestion

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness check — `{"status": "ok"}` |
| `GET` | `/status` | KB status, doc count, API key check |
| `POST` | `/ask` | Non-streaming answer |
| `POST` | `/ask/stream` | Streaming answer via SSE |
| `POST` | `/feedback` | Log thumbs up/down to `data/feedback.jsonl` |
| `POST` | `/rebuild` | Force-rebuild ChromaDB knowledge base |

### Request Body — `/ask` and `/ask/stream`

```json
{
  "question": "¿Qué destinos tienen mejor sostenibilidad?",
  "n_results": 5,
  "history": [
    { "role": "user", "content": "Háblame de Tenerife" },
    { "role": "assistant", "content": "Tenerife es un destino..." }
  ],
  "lang": "es"
}
```

### SSE Event Types

| Type | Payload | Timing |
|---|---|---|
| `source` | `destination_name`, `text`, `relevance` | Before LLM call |
| `token` | `content` (text chunk) | During LLM streaming |
| `done` | — | After last token |
| `error` | `message` | On failure |

---

## Frontend Architecture

```
frontend/src/
├── api/sageApi.ts          — fetch wrapper + SSE stream reader
├── context/AppContext.tsx  — global lang (es|en) + mode (dark|light) state
├── i18n/translations.ts    — all UI strings in Spanish + English
├── theme/darkTheme.ts      — MUI createLightTheme() / createDarkTheme()
├── hooks/
│   ├── useSageStream.ts    — core chat state: messages, sendMessage, rateFeedback
│   └── useKbStatus.ts      — polls GET /status on mount
├── components/
│   ├── layout/Header.tsx   — nav + language toggle (flag images) + dark mode toggle
│   ├── chat/
│   │   ├── ChatWindow.tsx  — message list + auto-scroll (containerRef)
│   │   ├── MessageBubble.tsx  — user/assistant bubbles + feedback buttons
│   │   ├── ChatInput.tsx   — text input + send button
│   │   ├── SourcesPanel.tsx   — expandable source documents
│   │   └── StatusSidebar.tsx  — example questions + how-it-works
│   └── sections/
│       ├── HeroSection.tsx    — landing hero with parallax + query examples
│       ├── StatsBar.tsx       — 4 KPI cards
│       └── HowItWorksSection.tsx — 4-step process
└── pages/Chat.tsx          — single-page layout
```

### State Persistence

| Key | Storage | Value |
|---|---|---|
| `sage_mode` | localStorage | `"dark"` \| `"light"` |
| `sage_lang` | localStorage | `"es"` \| `"en"` |
| Chat messages | Memory only | Cleared on every page reload |

---

## Example Questions

**In Spanish (default):**
- *"¿Qué destinos de playa tienen la menor congestión en agosto?"*
- *"¿Cuáles son los destinos más sostenibles de España?"*
- *"¿Qué destinos reciben un bonus de Horizon y por qué?"*
- *"¿Debería evitar Barcelona en verano? ¿Qué alternativas hay?"*
- *"¿Qué destinos tienen buen transporte público y baja huella de carbono?"*

**In English (toggle flag in header):**
- *"Which beach destination has the lowest congestion in August?"*
- *"What are the most sustainable destinations in Spain?"*
- *"Which destinations get a Horizon recommendation bonus and why?"*

---

## Horizon Business Rules (embedded in all documents)

Every destination document encodes the Horizon scoring rules:

- Sustainability > 85 → **+5% bonus**
- Sustainability < 50 → **−10% penalty**
- Average congestion < 40 → **+5% bonus**
- Any month with congestion > 80 → **−10% redistribution penalty** that month

Horizon score = `0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion`

---

## Security

`OPENAI_API_KEY` must **only** be set as an environment variable. Never hardcode it. Never commit it to git. `get_api_key()` in `settings.py` reads from the environment and raises `ValueError` if missing — this surfaces as `api_key_missing` in `GET /status`.

---

## Suite

| Project | Reto | Name | Role | Port |
|---|---|---|---|---|
| TUI-Sentinel | 1 | Sentinel | Sentiment monitor | 8502 |
| TUI-Smart-Destination-Recommender | 2 | Horizon | AI recommender | 8000 / 5173 |
| TUI-Atlas | 3 | Atlas | Geospatial dashboard | 8501 |
| TUI-Pathfinder | 4 | Pathfinder | Mobility dashboard | 8503 |
| **TUI-Sage** | **5** | **Sage** | **RAG AI advisor** | **8504 / 5174** |

See [SUITE.md](SUITE.md) for the full suite architecture and shared data documentation.
