# 🔮 Sage — RAG-Powered AI Destination Advisor

> Reto 5 · TUI Care Foundation Future Shapers Spain · UCM TFM 2026

Sage is the AI brain of the TUI Care Foundation Suite. It answers natural-language questions about Spain's 20 tourism destinations using Retrieval-Augmented Generation (RAG) — grounding every answer in real CSV data from Horizon, Atlas, Sentinel, and Pathfinder.

## Stack

| Layer | Technology |
|---|---|
| Dashboard | Streamlit 1.35+ |
| AI Generation | Anthropic Claude API (`claude-haiku-4-5`) |
| Vector Store | ChromaDB (persistent, local) |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 (via ChromaDB default) |
| Data | pandas 2.2+ |

## How It Works

```
User question
    ↓
ChromaDB semantic search (cosine similarity over 20 destination documents)
    ↓
Top 5 relevant documents retrieved
    ↓
Claude AI generates answer using ONLY those documents
    ↓
Response + sources shown in Streamlit chat
```

## Quick Start

```bash
# 1. Set API key (required)
export ANTHROPIC_API_KEY=sk-ant-...        # Linux/Mac
$env:ANTHROPIC_API_KEY="sk-ant-..."        # PowerShell

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start Sage
streamlit run app.py --server.port 8504
```

On first run, Sage builds the ChromaDB knowledge base (~30 seconds, downloads embedding model once).

## Data Setup

Place Sage next to Horizon on the Desktop — data is auto-detected:

```
Desktop/
├── TUI-Smart-Destination-Recommender/   ← primary data source
└── TUI-Sage/                             ← auto-detects Horizon's data/raw/
```

## Example Questions

- *"Which beach destination has the lowest congestion in August?"*
- *"What are the most sustainable destinations in Spain?"*
- *"Which destinations get a Horizon recommendation bonus and why?"*
- *"Should I avoid Barcelona in summer? What's the alternative?"*
- *"Which destinations have good public transport and low carbon footprint?"*

## Security

`ANTHROPIC_API_KEY` must **only** be set as an environment variable. Never hardcode it in any file, never commit it to git.

## Suite

| Project | Reto | Role | Port |
|---|---|---|---|
| TUI-Smart-Destination-Recommender | 2 | Horizon — AI recommender | 8000/5173 |
| TUI-Atlas | 3 | Atlas — Congestion dashboard | 8501 |
| TUI-Sentinel | 1 | Sentinel — Sentiment monitor | 8502 |
| TUI-Pathfinder | 4 | Pathfinder — Mobility dashboard | 8503 |
| **TUI-Sage** | **5** | **Sage — RAG AI advisor** | **8504** |
