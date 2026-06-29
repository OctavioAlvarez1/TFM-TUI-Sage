# Sage — User Manual

> Complete guide to installing, running, and using the Sage AI Destination Advisor.

---

## 1. Getting Started

### Prerequisites

- Python 3.11 or newer
- Node.js 20 or newer
- An OpenAI-compatible API key (`OPENAI_API_KEY`)
- The TUI-Smart-Destination-Recommender repository on the same Desktop (for automatic data detection)

### Step 1 — Set the API Key

**PowerShell (Windows):**
```powershell
$env:OPENAI_API_KEY = "sk-..."
```

**Bash (Linux/Mac):**
```bash
export OPENAI_API_KEY="sk-..."
```

The API key must be set in the terminal session before starting the backend. Sage will not start without it.

### Step 2 — Start the Backend

```bash
# From the TUI-Sage project root
pip install -r requirements.txt       # first time only (~80MB embedding model download)
python -m uvicorn src.api.app:app --reload --port 8504
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8504 (Press CTRL+C to quit)
INFO:     Building knowledge base...    ← first run only, ~30 seconds
INFO:     Knowledge base ready: 21 documents
```

On the first run, ChromaDB downloads the embedding model and builds all 21 destination documents. This takes approximately 30 seconds. Subsequent starts are instant (the knowledge base is cached to `data/chroma/`).

### Step 3 — Start the Frontend

Open a second terminal window:

```bash
cd frontend
npm install    # first time only
npm run dev
```

You should see:
```
  VITE v8.1.0  ready in 312 ms
  ➜  Local:   http://localhost:5174/
```

Open `http://localhost:5174` in your browser.

---

## 2. The Interface

### Header

```
┌─────────────────────────────────────────────────────────────────┐
│ [S]AGE  SPAIN TOURISM INTELLIGENCE    Destinos  Cómo  Suite    │
│                                              [🇺🇸] [☀] [Preguntar]│
└─────────────────────────────────────────────────────────────────┘
```

- **Logo** — Sage branding (non-clickable)
- **Nav links** — Destinos, Cómo funciona, Suite — smooth-scroll to sections
- **Flag button** — switches between Spanish and English (shows the flag of the opposite language)
- **Sun/moon button** — toggles dark/light mode
- **Preguntar / Ask button** — scrolls directly to the chat widget

### Hero Section

The landing area with a headline, four KPI stats (20 destinations, 85% concentration, data points, knowledge base documents), and example question chips. Clicking a chip sends the question directly to the chat.

### Chat Section

The main interface. Split into two panels:

**Left panel — Chat area**
- Shows the conversation history
- Streams responses token by token
- Shows source documents below each assistant response (expandable)
- Thumbs up/down buttons below each completed response

**Right panel — Sidebar**
- Knowledge base status chip (green = ready, yellow = building, red = error)
- Five example questions to click
- Four how-it-works steps

**Bottom — Chat input**
- Type your question and press Enter or click the send button
- The send button is disabled while a response is streaming

---

## 3. Asking Questions

### First Question

Type any question about Spain's 20 tourism destinations. The system will:

1. Retrieve the most relevant destination documents from the knowledge base
2. Show the retrieved source documents in the Sources panel (click to expand below each answer)
3. Stream the LLM response token by token

### Follow-Up Questions

You can ask follow-up questions without repeating context:

```
You: ¿Cuáles son los destinos más sostenibles?
Sage: Los destinos con mayor sostenibilidad son Picos de Europa (91.0/100) y Sierra Nevada...

You: ¿Y cuál tiene menos congestión en agosto?
Sage: Entre los más sostenibles, Picos de Europa tiene una congestión de solo 15.3 en agosto...
```

Sage rewrites follow-up questions into standalone retrieval queries automatically, so "¿Y cuál?" still retrieves the right documents.

### Language Switching

Click the flag button in the header to switch between Spanish and English at any time. The next question you send will use the selected language — both the system prompt and the retrieved source documents switch.

**In Spanish (default):**
- The AI responds in Spanish
- Source documents show the Spanish text
- All UI labels are in Spanish

**In English:**
- The AI responds in English
- Source documents show the English version of the same documents
- All UI labels are in English

---

## 4. Reading Responses

### Answer Text

The response is streamed token by token. You will see text appearing word by word — this is normal and shows that the system is working.

### Source Panel

Below each completed assistant response, a **Sources** expander shows which destination documents were used to generate the answer:

```
┌─ Sources (3) ─────────────────────────────────────────────────┐
│ ▸ Picos de Europa                                    0.87 ────│
│   Picos de Europa es un destino de tipo Nature...             │
│                                                               │
│ ▸ Sierra Nevada                                      0.82 ────│
│   Sierra Nevada es un destino de tipo Nature...               │
│                                                               │
│ ▸ Lanzarote                                          0.71 ────│
│   Lanzarote es un destino de tipo Nature...                   │
└───────────────────────────────────────────────────────────────┘
```

The number on the right (e.g., `0.87`) is the **relevance score** — how closely the document matched your query. Higher is better.

### Relevance Score Guide

| Score | Meaning |
|---|---|
| 0.85–1.00 | Very strong match — document is highly specific to your question |
| 0.70–0.84 | Good match — document is clearly relevant |
| 0.55–0.69 | Moderate match — document is related |
| < 0.55 | Weak match — on the edge of relevance |

---

## 5. Feedback

After each completed response, two buttons appear:

- **👍** (thumbs up) — the response was helpful and accurate
- **👎** (thumbs down) — the response was unhelpful or inaccurate

Clicking a button sends feedback to the backend, where it is logged to `data/feedback.jsonl`. Clicking the same button again removes the vote. This feedback is used for TFM evaluation and system improvement.

---

## 6. Dark and Light Mode

Click the sun/moon icon in the header to toggle between light and dark mode.

| Mode | Background | Primary color |
|---|---|---|
| Light | White / very light grey | Green #16A34A |
| Dark | Deep dark blue-grey (#0D1117) | Bright green #22C55E |

The preference is saved to localStorage (`sage_mode`) and remembered on the next visit.

---

## 7. Example Questions

### In Spanish

| Category | Question |
|---|---|
| Sustainability | ¿Qué destinos tienen la mejor puntuación de sostenibilidad? |
| Congestion | ¿Cuáles son los destinos menos saturados en agosto? |
| Horizon rules | ¿Qué destinos reciben un bonus en Horizon y por qué? |
| Alternatives | ¿Debería evitar Barcelona en verano? ¿Qué me recomiendas? |
| Transport | ¿Qué destinos tienen buen transporte público y baja huella de carbono? |
| Comparison | ¿Cuál es la diferencia entre Menorca y Mallorca en términos de congestión? |
| Follow-up | (after asking about Tenerife) ¿Y cuándo está menos saturada? |

### In English

| Category | Question |
|---|---|
| Sustainability | Which Spanish destinations have the best sustainability ratings? |
| Congestion | Which destinations have the lowest congestion in August? |
| Horizon rules | Which destinations get a Horizon bonus, and why? |
| Alternatives | Should I avoid Barcelona in summer? What alternatives are there? |
| Comparison | What's the difference between Ibiza and Menorca in terms of crowding? |

---

## 8. Status Indicator

The **Status** chip in the sidebar shows the current knowledge base state:

| Status | Colour | Meaning |
|---|---|---|
| Ready | Green | KB built, API key set — fully operational |
| Building | Yellow | Knowledge base is being built (first run) |
| KB Missing | Orange | ChromaDB not built — restart the backend |
| API Key Missing | Red | `OPENAI_API_KEY` not set |

---

## 9. Rebuilding the Knowledge Base

If the underlying CSV data changes (e.g., after refreshing INE/FRONTUR data via Horizon's `fetch_open_data.py`), rebuild the knowledge base:

```bash
# Via API (backend must be running)
curl -X POST http://localhost:8504/rebuild

# Or restart the backend — it rebuilds automatically if the collection is missing
```

Rebuild takes approximately 30 seconds.

---

## 10. Troubleshooting

| Problem | Solution |
|---|---|
| "Knowledge base not ready" error | The ChromaDB collection is missing. Wait for the backend startup build to complete, or call `POST /rebuild`. |
| Chat shows an error message | Check the backend terminal for Python exceptions. Most common: `OPENAI_API_KEY` not set. |
| Flag images not loading | Check internet connection. Flag images load from `flagcdn.com`. |
| Sources show 0 documents | Your query may not match any document above the 0.6 relevance threshold. Try rephrasing with more specific terms. |
| Response takes > 5 seconds | First response after startup is slow (model warm-up). Subsequent responses are faster. |
| Chat messages disappeared | Chat history is not persisted to localStorage — it resets on every page reload. This is by design. |
| Backend shows "Address already in use" | Port 8504 is occupied. Stop any other process on that port or change the port with `--port 8505`. |

---

## 11. Docker Deployment

Sage can run entirely inside Docker containers — no local Python or Node.js installation required.

### Prerequisites

- Docker Desktop installed and running
- The `TUI-Smart-Destination-Recommender` repository on the same Desktop (for CSV data)

### Setup

```bash
# 1. Create your environment file
copy .env.example .env
# Open .env and set: OPENAI_API_KEY=sk-...

# 2. Build and start
docker compose up --build
```

| Container | Port | URL |
|---|---|---|
| sage-backend | 8504 | http://localhost:8504 |
| sage-frontend | 5174 | http://localhost:5174 |

On first run, the backend downloads the embedding model (~80 MB) and builds the ChromaDB knowledge base inside the `sage_chroma` Docker volume. Subsequent starts reuse the cached KB.

### Stop and clean up

```bash
# Stop containers
docker compose down

# Stop and remove the ChromaDB volume (forces KB rebuild on next start)
docker compose down -v
```
