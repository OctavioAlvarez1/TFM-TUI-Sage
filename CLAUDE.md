# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sage** is a RAG-powered AI destination advisor for the TUI Care Foundation Future Shapers Spain suite (UCM TFM, 2026). It uses ChromaDB as a vector store and the Claude API to answer natural-language questions about Spain's 20 tourism destinations, grounded in real CSV data.

- **Stack**: Python · FastAPI · React 19 · MUI v6 · Anthropic SDK · ChromaDB · pandas
- **Model**: `claude-haiku-4-5-20251001` (fast + cost-efficient for demo)
- **Embeddings**: ChromaDB default (`sentence-transformers/all-MiniLM-L6-v2`, downloaded on first run)
- **Requires**: `ANTHROPIC_API_KEY` environment variable

## Commands

```bash
# Set API key (required before running)
export ANTHROPIC_API_KEY=sk-ant-...   # Linux/Mac
$env:ANTHROPIC_API_KEY="sk-ant-..."   # PowerShell

# Install Python dependencies
pip install -r requirements.txt
# Note: first install downloads ~80MB embedding model (sentence-transformers)

# Terminal 1 — FastAPI backend (port 8504)
python -m uvicorn src.api.app:app --reload --port 8504

# Terminal 2 — React frontend (port 5174)
cd frontend && npm install && npm run dev

# Legacy Streamlit fallback (still works, kept for reference)
streamlit run app.py --server.port 8504
```

## Architecture

```
src/
├── api/
│   ├── app.py              # FastAPI app: /health, /status, /ask, /ask/stream, /rebuild
│   └── models.py           # Pydantic schemas: AskRequest, AskResponse, StatusResponse
├── config/settings.py      # Paths + CHROMA_DIR + get_api_key() + sustainability_tier()
├── data/data_loader.py     # Loads CSVs (no cache — used at build time, not runtime)
├── rag/
│   ├── document_builder.py # CSV → rich-text documents (one per destination + suite context)
│   └── knowledge_base.py   # ChromaDB: build_knowledge_base(), query(), is_built()
└── llm/
    └── claude_client.py    # ask() → str  |  stream_ask() → Iterator[str]

frontend/
├── src/
│   ├── api/sageApi.ts      # fetch wrapper + SSE stream reader
│   ├── hooks/
│   │   ├── useSageStream.ts  # Core streaming hook — manages all chat state
│   │   └── useKbStatus.ts    # Polls GET /status on mount
│   ├── components/
│   │   ├── layout/Header.tsx
│   │   ├── common/{LoadingDots,StatusChip}.tsx
│   │   └── chat/{ChatWindow,MessageBubble,SourcesPanel,ChatInput,StatusSidebar}.tsx
│   ├── pages/Chat.tsx      # Single-page layout
│   └── theme/darkTheme.ts  # MUI dark theme, primary #10B981
└── vite.config.ts          # Port 5174, proxy /api → localhost:8504
```

### RAG + Streaming Flow

```
User question (React ChatInput)
    → POST /ask/stream (FastAPI, SSE)
    → query() in knowledge_base.py (ChromaDB cosine similarity)
    → SSE: source events (5 destination docs + relevance scores)
    → stream_ask() in claude_client.py (Anthropic SDK streaming)
    → SSE: token events (streamed to browser in real time)
    → SSE: done event
    → ChatWindow renders answer progressively + SourcesPanel expander
```

## Data Setup

Sage auto-detects data when both folders are on the same Desktop:

```
Desktop/
├── TUI-Smart-Destination-Recommender/   ← has data/raw/*.csv
└── TUI-Sage/                             ← auto-detects it
```

ChromaDB is persisted to `data/chroma/` (gitignored). On first run (~30s):
1. All CSVs are loaded
2. 21 documents are built (20 destinations + 1 suite context doc)
3. Embeddings are computed and stored in ChromaDB

## Key Patterns

### API Key Security
`get_api_key()` in `settings.py` reads `ANTHROPIC_API_KEY` from environment ONLY.
Never hardcode the key. Never commit it to git.

### Streaming Architecture
`/ask/stream` uses `sse-starlette` for SSE. The synchronous `stream_ask()` generator
is bridged to async FastAPI via `asyncio.Queue` + `ThreadPoolExecutor`. All ChromaDB
calls are blocking — always wrap in `run_in_executor`.

### System Prompt
`claude_client.py` sends a system prompt that instructs Claude to:
- Answer ONLY from the provided context documents
- Cite destination names precisely
- Reference Horizon's business rules when relevant

### Knowledge Base Rebuild
Call `POST /rebuild` or `build_knowledge_base(force_rebuild=True)` to regenerate after CSV data changes.
The `data/chroma/` directory is gitignored — each user builds it locally on first run.

## Suite Context

Sage is the crown jewel of the 5-project TUI Care Foundation Suite — it brings together data from all other projects and makes it queryable via natural language. See SUITE.md for the full picture.

The model is set to `claude-haiku-4-5-20251001` for speed and cost. For production, upgrade to `claude-sonnet-4-6`.
