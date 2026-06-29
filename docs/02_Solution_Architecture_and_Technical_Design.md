# Solution Architecture and Technical Design

## Sage — RAG-Powered AI Destination Advisor

---

# 1. Architecture Overview

Sage is a full-stack Retrieval-Augmented Generation (RAG) system. It consists of a Python backend that combines vector search, keyword search, and LLM inference, connected to a React frontend that streams responses token by token.

The architecture is designed around three core principles:

1. **Groundedness** — the LLM can only answer from retrieved documents, never from hallucinated knowledge
2. **Hybrid retrieval** — combining semantic and keyword signals for more robust document retrieval
3. **Streaming first** — every response is streamed token by token for a low-latency user experience

---

# 2. High-Level Architecture

```
┌──────────────────────────────────────────────────────┐
│             React SPA (localhost:5174)                │
│  HeroSection · ChatSection · HowItWorks · Footer      │
│  ChatInput → MessageBubble → SourcesPanel             │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP / SSE
                       ▼
┌──────────────────────────────────────────────────────┐
│           FastAPI Server (localhost:8504)              │
│  POST /ask/stream · POST /ask · GET /status           │
│  POST /feedback   · POST /rebuild                     │
└──────────────────────┬───────────────────────────────┘
                       │
           ┌───────────┴────────────┐
           ▼                        ▼
┌──────────────────┐     ┌──────────────────────────┐
│  RAG Pipeline    │     │  LLM Integration          │
│  (Python)        │     │  (OpenAI-compatible API)  │
│                  │     │                            │
│  BM25 Index      │     │  gpt-4o-mini streaming    │
│  ChromaDB        │     │  Conversation history      │
│  RRF Fusion      │     │  Bilingual system prompt  │
│  Relevance filter│     │  Query rewriting           │
└────────┬─────────┘     └──────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│              Data Layer (CSV + ChromaDB)              │
│  destinations.csv · sustainability_scores.csv         │
│  congestion_scores.csv · bookings_history.csv         │
│  data/chroma/ (persistent ChromaDB store)             │
└──────────────────────────────────────────────────────┘
```

---

# 3. System Layers

## Layer 1 — Data Ingestion

CSV files from the shared TUI Care Foundation dataset are read at knowledge base build time by `src/data/data_loader.py`. The four CSV files contain:

- 20 Spanish destinations with type, region, and price level
- Monthly congestion scores (12 months × 20 destinations = 240 records) from INE EOH data
- Sustainability scores including carbon, local business, and transport sub-scores from FRONTUR data
- Booking history with ratings

Data is not cached at runtime — it is only read during knowledge base construction.

## Layer 2 — Knowledge Base Construction

`src/rag/document_builder.py` converts raw CSV data into 21 rich-text documents:

- 20 destination documents (one per destination, bilingual)
- 1 suite context document explaining the 85% concentration problem and Horizon's scoring formula

Each document is a dense paragraph combining sustainability, congestion, booking, and Horizon rule information. Spanish is the primary `text` field in ChromaDB; the English version is stored in `metadata.text_en` (truncated to 800 characters).

Documents are stored in ChromaDB (`data/chroma/`) with embeddings computed using `sentence-transformers/all-MiniLM-L6-v2`.

## Layer 3 — Hybrid Retrieval

`src/rag/knowledge_base.py` runs two independent retrieval signals and fuses them:

- **Semantic**: ChromaDB cosine similarity search, returning n_candidates = min(count, max(n_results×3, 15))
- **Keyword**: BM25Okapi from rank-bm25, built lazily on first query, tokenised on lowercased text stripped of punctuation
- **Fusion**: Reciprocal Rank Fusion (k=60) — score = 1/(k + rank + 1) — combined from both rankers
- **Threshold**: Documents with cosine distance > 0.6 are filtered out; falls back to top-N if all are filtered

## Layer 4 — LLM Integration

`src/llm/claude_client.py` wraps the OpenAI-compatible API with three responsibilities:

- **Query rewriting**: Converts follow-up questions into standalone retrieval queries using the LLM (skips if history < 2 messages)
- **Response generation**: Calls `gpt-4o-mini` with the retrieved documents as context and the last 6 messages as conversation history
- **Streaming**: Returns a Python generator yielding text tokens, bridged to async FastAPI via `asyncio.Queue` + `ThreadPoolExecutor`

## Layer 5 — API and Streaming

`src/api/app.py` exposes the RAG pipeline via FastAPI. The primary endpoint (`POST /ask/stream`) uses `sse-starlette` to emit:
1. Source events (up to 5 retrieved documents with relevance scores)
2. Token events (LLM output streamed token by token)
3. A done event on completion

The React frontend reads the SSE stream via a custom `streamAsk()` async generator in `sageApi.ts`.

---

# 4. 5-Layer Framework Mapping

The architecture follows the TUI Care Foundation's 5-layer framework:

| Layer | Name | Responsibility | Sage Implementation |
|---|---|---|---|
| **L1** | Unified Ingestion (Foundation) | Consolidate data sources | `data_loader.py` reads CSVs from Horizon's shared `data/raw/` folder |
| **L2** | Prediction Engine (Intelligence) | Demand modelling and knowledge synthesis | `knowledge_base.py` — hybrid BM25 + ChromaDB retrieval + RRF fusion |
| **L3** | Intervention Triggers (Action) | Surface redistribution guidance through natural language | System prompts embed Horizon's bonus/penalty rules; documents include them verbatim |
| **L4** | Personalization (Interface) | Natural language interface for any user | Bilingual chat interface; query rewriting for multi-turn coherence |
| **L5** | Governance (Control Panel) | Monitoring and feedback | `feedback.jsonl` captures user satisfaction; `/status` endpoint monitors KB health |

---

# 5. Technology Stack

## Backend

| Component | Technology | Version |
|---|---|---|
| API server | FastAPI | ≥ 0.115.0 |
| Runtime | Python | 3.11+ |
| ASGI server | uvicorn | ≥ 0.30.0 |
| SSE streaming | sse-starlette | ≥ 2.1.0 |
| Vector store | ChromaDB | ≥ 0.5.0 |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 | via ChromaDB default |
| Keyword search | rank-bm25 (BM25Okapi) | ≥ 0.2.2 |
| LLM API | OpenAI SDK | ≥ 1.30.0 |
| Data processing | pandas | ≥ 2.2.0 |
| Schema validation | pydantic | via FastAPI |

## Frontend

| Component | Technology | Version |
|---|---|---|
| Framework | React | 19.2.7 |
| Language | TypeScript | 6.0.2 |
| Build tool | Vite | 8.1.0 |
| UI library | MUI v6 | 6.4.8 |
| Icons | @mui/icons-material | 6.4.8 |
| Animations | framer-motion | 12.12.1 |
| Font | Inter (@fontsource/inter) | 5.1.1 |
| Linter | oxlint | 1.69.0 |

---

# 6. Scalability and Evolution

## Phase 1 — MVP (Complete as of June 2026)

- Hybrid BM25 + semantic retrieval with RRF and relevance threshold
- Token-by-token streaming via SSE
- Multi-turn conversation history (last 6 messages)
- Bilingual knowledge base and interface (ES/EN)
- Dark/light mode
- Thumbs up/down feedback logging
- Docker containerization (backend + nginx-served frontend via `docker compose up --build`)

## Phase 2 — Production Enhancement

- Re-ranking with a cross-encoder model (e.g., `ms-marco-MiniLM`)
- Semantic chunking of longer documents (currently each destination is a single document)
- Integration with a live database rather than static CSVs
- User session management and personalised query history

## Phase 3 — Enterprise Integration

- Integration with TUI's booking API for real-time destination availability
- Multi-modal queries (images, maps)
- Voice interface
- Federated retrieval across multiple knowledge bases (one per country or market)
