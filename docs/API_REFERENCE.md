# Sage — API Reference

Base URL: `http://localhost:8504`

---

## Endpoints

### `GET /health`

Liveness check. Returns the status of the API.

**Response**
```json
{ "status": "ok" }
```

---

### `GET /status`

Returns the current state of the knowledge base and API key configuration.

**Response — 200 OK**
```json
{
  "kb_built": true,
  "api_key_set": true,
  "collection_name": "tui_destinations",
  "document_count": 21,
  "status": "ready"
}
```

**Status field values**

| Value | Meaning |
|---|---|
| `ready` | Knowledge base built and API key present — fully operational |
| `kb_missing` | ChromaDB collection not built yet — startup build in progress or failed |
| `api_key_missing` | `OPENAI_API_KEY` environment variable is not set |
| `error` | Internal error during status check |

---

### `POST /ask`

Generates a non-streaming answer. Runs the full RAG pipeline (query rewriting → retrieval → LLM) and returns the complete answer.

**Request Body**
```json
{
  "question": "¿Qué destinos tienen la mejor sostenibilidad?",
  "n_results": 5,
  "history": [
    { "role": "user", "content": "Háblame de Tenerife" },
    { "role": "assistant", "content": "Tenerife es un destino mixto..." }
  ],
  "lang": "es"
}
```

**Request Fields**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `question` | string | Yes | — | User question (1–2000 characters) |
| `n_results` | integer | No | 5 | Number of documents to retrieve (1–10) |
| `history` | array | No | `[]` | Previous conversation turns (role + content) |
| `lang` | string | No | `"es"` | Response language: `"es"` (Spanish) or `"en"` (English) |

**Response — 200 OK**
```json
{
  "answer": "Los destinos con mayor puntuación de sostenibilidad son Picos de Europa (91.0/100) y Sierra Nevada (88.0/100)...",
  "sources": [
    {
      "destination_name": "Picos de Europa",
      "text": "Picos de Europa es un destino de tipo Nature ubicado en Asturias, España. Sostenibilidad: 91.0/100 (nivel Excelente)...",
      "relevance": 0.87
    },
    {
      "destination_name": "Sierra Nevada",
      "text": "Sierra Nevada es un destino de tipo Nature ubicado en Andalusia, España. Sostenibilidad: 88.0/100 (nivel Excelente)...",
      "relevance": 0.82
    }
  ],
  "question": "¿Qué destinos tienen la mejor sostenibilidad?"
}
```

**Response — 503 Service Unavailable**
```json
{ "detail": "Knowledge base not ready" }
```

---

### `POST /ask/stream`

Generates a streaming answer via Server-Sent Events (SSE). Uses the same RAG pipeline as `/ask` but streams the LLM response token by token.

**Request Body** — same as `POST /ask`

**SSE Stream**

The response is a text/event-stream. Each event has the format:

```
data: {"type": "...", ...}

```

Events are emitted in this order:

**1. Source events** (before LLM generation, one per retrieved document)

```
data: {"type": "source", "destination_name": "Mallorca", "text": "Mallorca es un destino...", "relevance": 0.81}

data: {"type": "source", "destination_name": "Ibiza", "text": "Ibiza es un destino...", "relevance": 0.76}
```

**2. Token events** (during LLM generation, one per text chunk)

```
data: {"type": "token", "content": "Los"}

data: {"type": "token", "content": " destinos"}

data: {"type": "token", "content": " con"}
```

**3. Done event** (after the last token)

```
data: {"type": "done"}
```

**Error event** (if an error occurs during streaming)

```
data: {"type": "error", "message": "OpenAI API error: ..."}
```

**Response — 503 Service Unavailable**
```json
{ "detail": "Knowledge base not ready" }
```

---

### `POST /feedback`

Logs a user feedback vote (thumbs up or down) to `data/feedback.jsonl`.

**Request Body**
```json
{
  "message_id": "3f8a2b91-4c1d-4e5f-8a7b-9c0d1e2f3a4b",
  "answer": "Los destinos más sostenibles son Picos de Europa y Sierra Nevada...",
  "feedback": "up"
}
```

**Request Fields**

| Field | Type | Values | Description |
|---|---|---|---|
| `message_id` | string | UUID | Unique ID of the assistant message |
| `answer` | string | — | Full text of the answer (truncated to 500 chars when stored) |
| `feedback` | string | `"up"` or `"down"` | User vote |

**Response — 200 OK**
```json
{ "ok": true }
```

The feedback is appended to `data/feedback.jsonl` as JSON Lines:

```json
{"ts": "2026-06-26T14:32:01.123456+00:00", "message_id": "...", "answer": "...", "feedback": "up"}
```

---

### `POST /rebuild`

Force-rebuilds the ChromaDB knowledge base from the CSV data. Deletes the existing collection and recreates all 21 documents with fresh embeddings.

**Request Body** — none required

**Response — 200 OK (success)**
```json
{
  "success": true,
  "message": "Knowledge base rebuilt successfully"
}
```

**Response — 200 OK (failure)**
```json
{
  "success": false,
  "message": "FileNotFoundError: data/raw/destinations.csv not found"
}
```

---

## Score Interpretation

### Relevance Score

The `relevance` field in source documents is computed as `round(1 - cosine_distance, 2)`:

| Relevance | Interpretation |
|---|---|
| 0.85–1.00 | Very high — near-exact match to the query |
| 0.70–0.84 | High — clearly relevant document |
| 0.55–0.69 | Moderate — related but not specific |
| 0.40–0.54 | Low — marginal relevance (approaching threshold) |
| < 0.40 | Filtered out (cosine distance > 0.60) |

---

## Examples

### cURL

```bash
# Health check
curl http://localhost:8504/health

# System status
curl http://localhost:8504/status

# Non-streaming question (Spanish)
curl -X POST http://localhost:8504/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "¿Qué destinos tienen mejor sostenibilidad?",
    "n_results": 3,
    "lang": "es"
  }'

# Non-streaming question (English)
curl -X POST http://localhost:8504/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Which destinations have the lowest congestion in August?",
    "n_results": 5,
    "lang": "en"
  }'

# Submit feedback
curl -X POST http://localhost:8504/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "abc-123",
    "answer": "Los destinos más sostenibles...",
    "feedback": "up"
  }'

# Rebuild knowledge base
curl -X POST http://localhost:8504/rebuild
```

### JavaScript (Fetch — streaming)

```js
const response = await fetch('http://localhost:8504/ask/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'Which destinations avoid overtourism?',
    history: [],
    lang: 'en',
    n_results: 5,
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop() ?? '';
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const event = JSON.parse(line.slice(6));
      if (event.type === 'token') process.stdout.write(event.content);
      if (event.type === 'done') console.log('\n[complete]');
    }
  }
}
```

### Python (requests — non-streaming)

```python
import requests

response = requests.post(
    'http://localhost:8504/ask',
    json={
        'question': '¿Cuáles son los destinos con bonus en Horizon?',
        'n_results': 5,
        'lang': 'es',
    }
)
data = response.json()
print(data['answer'])
for source in data['sources']:
    print(f"  [{source['relevance']:.2f}] {source['destination_name']}")
```
