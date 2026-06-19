# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sage** is a RAG-powered AI destination advisor for the TUI Care Foundation Future Shapers Spain suite (UCM TFM, 2026). It uses ChromaDB as a vector store and the Claude API to answer natural-language questions about Spain's 20 tourism destinations, grounded in real CSV data.

- **Stack**: Python · Streamlit · Anthropic SDK · ChromaDB · pandas
- **Model**: `claude-haiku-4-5-20251001` (fast + cost-efficient for demo)
- **Embeddings**: ChromaDB default (`sentence-transformers/all-MiniLM-L6-v2`, downloaded on first run)
- **Requires**: `ANTHROPIC_API_KEY` environment variable

## Commands

```bash
# Set API key (required before running)
export ANTHROPIC_API_KEY=sk-ant-...   # Linux/Mac
$env:ANTHROPIC_API_KEY="sk-ant-..."   # PowerShell

# Start Sage (from project root)
streamlit run app.py

# Start on suite port
streamlit run app.py --server.port 8504

# Install dependencies
pip install -r requirements.txt
# Note: first install downloads ~80MB embedding model (sentence-transformers)
```

## Architecture

```
src/
├── config/settings.py          # Paths + CHROMA_DIR + get_api_key() + sustainability_tier()
├── data/data_loader.py         # Loads CSVs (no cache — used at build time, not runtime)
├── rag/
│   ├── document_builder.py     # CSV → rich-text documents (one per destination + suite context)
│   └── knowledge_base.py       # ChromaDB: build_knowledge_base(), query(), is_built()
└── llm/
    └── claude_client.py        # Anthropic SDK wrapper — ask(question, context_docs) → str
```

### RAG Flow

```
User question
    → query() in knowledge_base.py (ChromaDB cosine similarity)
    → top-5 destination documents retrieved
    → ask() in claude_client.py (Claude API with context + system prompt)
    → response shown in Streamlit chat + sources in expander
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

### System Prompt
`claude_client.py` sends a system prompt that instructs Claude to:
- Answer ONLY from the provided context documents
- Cite destination names precisely
- Reference Horizon's business rules when relevant

### Knowledge Base Rebuild
Call `build_knowledge_base(force_rebuild=True)` to regenerate after CSV data changes.
The `data/chroma/` directory is gitignored — each user builds it locally on first run.

## Suite Context

Sage is the crown jewel of the 5-project TUI Care Foundation Suite — it brings together data from all other projects and makes it queryable via natural language. See SUITE.md for the full picture.

The model is set to `claude-haiku-4-5-20251001` for speed and cost. For production, upgrade to `claude-sonnet-4-6`.
