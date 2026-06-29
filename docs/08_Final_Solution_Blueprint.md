# Final Solution Blueprint

## Sage — Complete Technical and Business Summary

> Reto 5 · TUI Care Foundation Future Shapers Spain · UCM TFM 2026

---

# 1. What Sage Is

**Sage** is the fifth and final project of the TUI Care Foundation Suite. It is a RAG-powered conversational AI system that makes the entire suite's dataset queryable through natural language.

Where Horizon scores destinations algorithmically and Atlas visualises them on a map, Sage answers the question behind the question: "Why is this destination recommended? What does its sustainability score mean? Which destinations should I avoid in August and why?"

Sage is fully operational as of June 2026.

---

# 2. System Summary

| Dimension | Value |
|---|---|
| Architecture | RAG (Retrieval-Augmented Generation) with hybrid search |
| Backend | Python · FastAPI · uvicorn · port 8504 |
| Frontend | React 19 · TypeScript · MUI v6 · Vite · port 5174 |
| LLM | gpt-4o-mini via OpenAI-compatible API |
| Vector store | ChromaDB (local, persistent) |
| Keyword search | BM25Okapi (rank-bm25) |
| Embedding model | sentence-transformers/all-MiniLM-L6-v2 |
| Documents | 21 (20 destinations + 1 suite context) |
| Languages | Spanish (primary) + English (full bilingual) |
| Streaming | Server-Sent Events (token-by-token) |
| Auth required | OPENAI_API_KEY environment variable |

---

# 3. RAG Pipeline Summary

```
User question
    │
    ├─► Query rewriting (LLM, skips for first message)
    │       Converts "and that one?" into "What is {destination}'s congestion profile?"
    │
    ├─► Hybrid retrieval
    │   ├── Semantic: ChromaDB cosine similarity (n_candidates = max(n_results×3, 15))
    │   ├── Keyword:  BM25Okapi over 21 documents
    │   └── Fusion:   RRF score = 1/(60 + rank + 1), sorted descending
    │
    ├─► Relevance filter
    │       Remove documents where distance > 0.6
    │       Fallback to top-N semantic results if all filtered
    │
    ├─► LLM generation (gpt-4o-mini, streaming)
    │       System prompt: answer ONLY from context, in active language
    │       Context: up to 5 retrieved documents
    │       History: last 6 messages (3 user + 3 assistant turns)
    │
    └─► SSE stream
            source events → token events → done event
```

---

# 4. Key Technical Decisions

## Why Hybrid Retrieval?

Semantic search alone fails on specific keyword queries ("BM25", destination IDs like "D001", exact Spanish month names). BM25 alone fails on paraphrased or conceptual queries ("sustainable places", "less crowded in summer"). Combining both with RRF gives robust coverage across query types.

## Why Query Rewriting?

Without rewriting, follow-up questions like "what about its sustainability?" send only those words to ChromaDB — the "its" has no referent. The LLM-based rewriting step is the simplest approach that correctly handles multi-turn retrieval without complex session management.

## Why Bilingual at Build Time?

Embedding both languages at query time (translating the query first) would add latency and introduce error. Translating at response time (translating the Spanish document) would add latency and lose numerical precision. Embedding both texts at knowledge base build time costs nothing at query time and produces accurate bilingual sources.

## Why SSE Instead of WebSockets?

SSE is unidirectional (server → client), which is sufficient for streaming LLM responses. It is simpler to implement with `sse-starlette`, works over standard HTTP without upgrade overhead, and is natively supported by browser `ReadableStream`.

## Why MUI v6?

MUI v6 introduces stable `sx` prop cascading, improved dark mode tokens, and removed the legacy `withStyles` API. The project uses v6-specific features including `createTheme` token structure changes.

---

# 5. Component Status

| Component | Status | Notes |
|---|---|---|
| FastAPI backend | ✅ Complete | 6 endpoints: health, status, ask, ask/stream, feedback, rebuild |
| ChromaDB knowledge base | ✅ Complete | 21 bilingual documents, auto-built on startup |
| BM25 index | ✅ Complete | Lazy build on first query, reset on rebuild |
| RRF fusion | ✅ Complete | k=60, both semantic and keyword rankings |
| Relevance threshold | ✅ Complete | 0.6 distance cutoff with fallback |
| Query rewriting | ✅ Complete | LLM-based, skips first message |
| Conversation history | ✅ Complete | Last 6 messages passed to LLM |
| Token streaming (SSE) | ✅ Complete | Sync→async bridge via asyncio.Queue |
| React frontend | ✅ Complete | 5 page sections, responsive layout |
| Dark/light mode | ✅ Complete | MUI v6 themes, localStorage persistence |
| ES/EN i18n | ✅ Complete | All UI strings, flag image toggle |
| Bilingual sources | ✅ Complete | Spanish primary, English in metadata |
| Feedback logging | ✅ Complete | feedback.jsonl, thumbs up/down per message |
| Docker deployment | ✅ Complete | Dockerfile + frontend/Dockerfile + docker-compose.yml |

---

# 6. Data Summary

| Dataset | Records | Source |
|---|---|---|
| Destinations | 20 | Synthetic (GDPR-compliant) |
| Monthly congestion | 240 (12 × 20) | INE EOH Table 49371 |
| Sustainability scores | 20 | FRONTUR Table 23988 |
| Bookings | ~1,000 | Synthetic (GDPR-compliant) |
| ChromaDB documents | 21 | Built from above |
| Feedback records | Accumulating | feedback.jsonl (local) |

---

# 7. API Surface

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /health | Liveness check |
| GET | /status | KB health, doc count, API key status |
| POST | /ask | Non-streaming answer |
| POST | /ask/stream | Streaming SSE answer |
| POST | /feedback | Log thumbs up/down |
| POST | /rebuild | Force-rebuild ChromaDB KB |

---

# 8. Files Outside Initial Scope

| File | Status |
|---|---|
| `data/feedback.jsonl` | Accumulates locally, gitignored |
| `data/chroma/` | ChromaDB storage, gitignored, rebuilt per user |
| `.env.example` | API key template — copy to `.env` before Docker or local run |

---

# 9. Suite Position

```
                    ┌─────────────────┐
                    │  TUI Care Fdn   │
                    │  Suite (Reto 5) │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
  │  Sentinel   │    │   Horizon    │    │    Atlas     │
  │  Reto 1     │    │   Reto 2     │    │   Reto 3     │
  │  Sentiment  │    │  Recommender │    │  Geo Viz     │
  └─────────────┘    └──────────────┘    └──────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
  ┌─────────────┐    ┌──────────────────────────────────┐
  │ Pathfinder  │    │              Sage                │
  │  Reto 4     │───►│             Reto 5               │
  │  Mobility   │    │  RAG: Natural Language Interface │
  └─────────────┘    │  to ALL suite data               │
                     └──────────────────────────────────┘
```

Sage is the convergence layer — the only project in the suite that makes all other projects' data queryable through natural language.

---

# 10. Academic Contribution

For the UCM TFM 2026, Sage demonstrates:

1. **RAG pipeline engineering** — combining ChromaDB, BM25, and RRF in a production-quality Python backend
2. **Streaming system design** — sync-to-async bridge enabling real-time token streaming in an async FastAPI context
3. **Bilingual NLP** — build-time bilingual knowledge base design that eliminates per-query translation overhead
4. **LLM-based query rewriting** — multi-turn retrieval coherence through lightweight LLM pre-processing
5. **Full-stack AI product** — end-to-end system from CSV data to real-time streaming React UI with dark mode, i18n, and user feedback
