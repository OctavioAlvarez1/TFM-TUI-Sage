# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sage** is a RAG-powered AI destination advisor for the TUI Care Foundation Future Shapers Spain suite (UCM TFM, 2026). It uses ChromaDB + BM25 hybrid retrieval and an OpenAI-compatible LLM to answer natural-language questions about Spain's 20 tourism destinations, grounded in real CSV data.

- **Stack**: Python · FastAPI · React 19 · MUI v6 · OpenAI SDK · ChromaDB · rank-bm25 · pandas
- **Model**: `gpt-4o-mini` via OpenAI-compatible API
- **Embeddings**: ChromaDB default (`sentence-transformers/all-MiniLM-L6-v2`, downloaded on first run)
- **Requires**: `OPENAI_API_KEY` environment variable

## Commands

```bash
# Set API key (required before running)
export OPENAI_API_KEY="sk-..."        # Linux/Mac
$env:OPENAI_API_KEY="sk-..."          # PowerShell

# Install Python dependencies
pip install -r requirements.txt
# Note: first install downloads ~80MB embedding model (sentence-transformers)

# Terminal 1 — FastAPI backend (port 8504)
python -m uvicorn src.api.app:app --reload --port 8504

# Terminal 2 — React frontend (port 5174)
cd frontend && npm install && npm run dev

# Rebuild knowledge base after CSV changes
curl -X POST http://localhost:8504/rebuild

# Docker (alternative to local dev)
cp .env.example .env  # then add OPENAI_API_KEY
docker compose up --build
```

## Architecture

```
src/
├── api/
│   ├── app.py              # FastAPI: /health, /status, /ask, /ask/stream, /feedback, /rebuild
│   └── models.py           # Pydantic: AskRequest, AskResponse, StatusResponse, FeedbackRequest
├── config/settings.py      # Paths, CHROMA_DIR, RELEVANCE_THRESHOLD, get_api_key(), sustainability_tier()
├── data/data_loader.py     # Loads CSVs (used at build time only, not cached at runtime)
├── rag/
│   ├── document_builder.py # CSV → bilingual rich-text documents (Spanish text + English in metadata)
│   └── knowledge_base.py   # ChromaDB + BM25 hybrid retrieval with RRF fusion
└── llm/
    └── claude_client.py    # rewrite_query() | ask() → str | stream_ask() → Iterator[str]

frontend/
├── src/
│   ├── api/sageApi.ts          # fetch wrapper + SSE stream reader
│   ├── context/AppContext.tsx  # Global lang (es|en) + mode (dark|light) state
│   ├── i18n/translations.ts    # All UI strings in Spanish + English
│   ├── theme/darkTheme.ts      # createLightTheme() / createDarkTheme() (MUI v6)
│   ├── hooks/
│   │   ├── useSageStream.ts    # Core chat hook: messages, sendMessage, rateFeedback
│   │   └── useKbStatus.ts      # Polls GET /status on mount
│   ├── components/
│   │   ├── layout/Header.tsx   # Nav + flag language toggle + dark mode toggle
│   │   ├── common/{LoadingDots,StatusChip}.tsx
│   │   └── chat/{ChatWindow,MessageBubble,SourcesPanel,ChatInput,StatusSidebar}.tsx
│   ├── pages/Chat.tsx          # Single-page layout
│   └── types/chat.ts           # ChatMessage, SseEvent, FeedbackType, ConversationTurn
└── vite.config.ts              # Port 5174, proxy /api → localhost:8504
```

### RAG + Streaming Flow

```
User question (React ChatInput)
    → rewrite_query() — rewrites follow-ups into standalone queries (skips if first message)
    → query() in knowledge_base.py — hybrid BM25 + semantic + RRF + relevance filter
    → POST /ask/stream (FastAPI SSE)
    → SSE: source events (up to 5 docs, with relevance score)
    → stream_ask() in claude_client.py — OpenAI streaming with conversation history
    → SSE: token events (streamed to browser token by token)
    → SSE: done event
    → React: ChatWindow renders progressively, SourcesPanel expander with sources
```

## Data Setup

Sage auto-detects data when both repos are on the same Desktop:

```
Desktop/
├── TUI-Smart-Destination-Recommender/   ← has data/raw/*.csv
└── TUI-Sage/                             ← auto-detects it
```

ChromaDB persists to `data/chroma/` (gitignored). On first run (~30s):
1. All CSVs are loaded
2. 21 documents are built — 20 destinations + 1 suite context doc
3. Embeddings computed and stored in ChromaDB
4. BM25 index built lazily on first `query()` call

## Key Patterns

### API Key Security
`get_api_key()` in `settings.py` reads `OPENAI_API_KEY` from environment ONLY.
Never hardcode the key. Never commit it to git.

### Hybrid Retrieval (BM25 + Semantic + RRF)
`knowledge_base.py` runs both retrievers in parallel and fuses with Reciprocal Rank Fusion:
- **Semantic**: ChromaDB cosine similarity, `n_candidates = min(count, max(n_results×3, 15))`
- **Keyword**: BM25Okapi from `rank-bm25`, lazily built on first query, reset on rebuild
- **RRF**: `score = 1 / (k + rank + 1)` where `k = 60`
- **Threshold**: docs with distance > `RELEVANCE_THRESHOLD` (0.6) are filtered out; falls back to top-N if nothing passes

### Query Rewriting
`rewrite_query(question, history)` in `claude_client.py`:
- Skips if `history` is empty or has fewer than 2 messages (first question is always standalone)
- Calls the LLM with a system prompt that extracts the standalone retrieval intent from a follow-up
- The rewritten query goes to `query()`, but the original question is what the LLM answers

### Conversation History
Last `MAX_HISTORY_TURNS = 6` messages (3 user + 3 assistant) passed to `_build_messages()`.
Sent in `useSageStream.ts` as `history` in the request body; filtered to exclude streaming messages.

### Streaming Architecture
`/ask/stream` uses `sse-starlette`. The synchronous `stream_ask()` generator is bridged to async FastAPI via `asyncio.Queue` + `ThreadPoolExecutor`. All ChromaDB calls are blocking — always wrap in `run_in_executor`.

### Bilingual Documents
Documents are built in `document_builder.py` with both languages at build time:
- `text` field (ChromaDB primary): Spanish
- `metadata.text_en` (truncated to 800 chars): English

`_doc_to_source()` in `app.py` selects the right field based on `request.lang`.

### i18n + Dark Mode
Global `AppContext` provides `lang`, `toggleLang`, `mode`, `toggleMode`. All UI strings come from `translations.ts`. Theme is swapped via `useMemo` in `ThemedApp`. Both preferences persist to localStorage (`sage_lang`, `sage_mode`). Chat messages are **not** persisted — fresh on every reload.

### System Prompt
`claude_client.py` sends two system prompts — `_SYSTEM_PROMPT_ES` and `_SYSTEM_PROMPT_EN` — selected via `_get_system_prompt(lang)`. Both instruct the model to:
- Answer ONLY from the provided context documents
- Cite destination names precisely
- Reference Horizon's business rules when relevant
- Respond in the correct language for the `lang` parameter
- Always close with "Muchas gracias por confiar en TUI Care Foundation. Sigo aquí para cualquier otra pregunta." (ES) / "Thank you for trusting TUI Care Foundation. I'm here for any other questions." (EN)

### Knowledge Base Rebuild
Call `POST /rebuild` or `build_knowledge_base(force_rebuild=True)` to regenerate.
`data/chroma/` is gitignored — each user builds it locally.
The in-memory BM25 index (`_bm25`, `_bm25_corpus`) is reset to `None` on rebuild to force re-indexing on next query.

### Feedback Logging
`POST /feedback` appends JSON Lines to `data/feedback.jsonl`:
```json
{"ts": "2026-01-01T12:00:00Z", "message_id": "...", "answer": "...", "feedback": "up"}
```
The frontend sends `rateFeedback(messageId, 'up'|'down')` from `useSageStream`; toggles off on second click.

## Suite Context

Sage is the crown jewel of the 5-project TUI Care Foundation Suite — it makes all suite data queryable via natural language. See SUITE.md for the full picture.
