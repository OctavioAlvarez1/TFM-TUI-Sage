# LLM Integration and Streaming Architecture

## Sage — OpenAI API, SSE Streaming, and Conversation Management

---

# 1. Overview

Sage integrates with an OpenAI-compatible LLM API using the official `openai` Python SDK. All LLM calls go through `src/llm/claude_client.py`, which handles three responsibilities:

1. **Query rewriting** — converts follow-up questions into standalone retrieval queries
2. **Answer generation** — generates grounded responses from retrieved context documents
3. **Streaming** — yields response tokens one by one for real-time display

---

# 2. LLM Configuration

| Parameter | Value |
|---|---|
| SDK | `openai` Python SDK |
| Model | `gpt-4o-mini` |
| Max tokens (non-streaming) | 1024 |
| Temperature | Default (not overridden) |
| Authentication | `OPENAI_API_KEY` environment variable |

The `openai.OpenAI()` client is instantiated once at module import time. `get_api_key()` from `settings.py` reads `OPENAI_API_KEY` from the environment and raises `ValueError` if missing.

---

# 3. System Prompts

Two system prompts are defined for Spanish and English. Both share the same structure and constraints, differing only in language.

## Spanish System Prompt

```
Eres Sage, el guía experto de turismo sostenible de TUI Care Foundation para el programa
Future Shapers Spain.

Ayudas a stakeholders a entender los patrones turísticos de España, el rendimiento en
sostenibilidad y las recomendaciones de destinos. Tienes acceso a datos de 20 destinos
españoles: niveles de congestión, puntuaciones de sostenibilidad y las reglas del motor
de recomendación Horizon.

REGLAS IMPORTANTES:
1. Responde SIEMPRE en español, independientemente del idioma de los documentos de contexto.
2. Responde ÚNICAMENTE basándote en los documentos de contexto proporcionados. No inventes datos.
3. Cita siempre los nombres específicos de los destinos que mencionas.
4. Cuando menciones puntuaciones, sé preciso (p. ej., "puntuación de sostenibilidad 87/100").
5. Si el contexto no contiene información suficiente para responder, indícalo claramente.
6. Mantén las respuestas concisas y accionables — 3-6 frases salvo que sea necesario más detalle.
7. Cuando sea relevante, menciona las reglas del motor de recomendación Horizon
   (sostenibilidad >85 = +5%, congestión >80 = penalización -10%, etc.).
8. Finaliza siempre tu respuesta con: "Muchas gracias por confiar en TUI Care Foundation.
   Sigo aquí para cualquier otra pregunta."
```

## English System Prompt

```
You are Sage, TUI Care Foundation's expert sustainable tourism guide for the Future Shapers
Spain programme.

You help stakeholders understand Spain's tourism patterns, sustainability performance, and
destination recommendations. You have access to data on 20 Spanish destinations including
congestion levels, sustainability scores, and Horizon's AI recommendation engine rules.

IMPORTANT RULES:
1. Always respond in English, regardless of the language of the context documents.
2. Answer ONLY based on the context documents provided. Do not invent data.
3. Always cite the specific destination names you refer to.
4. When mentioning scores, be precise (e.g., "sustainability score 87/100").
5. If the context does not contain enough information to answer, say so clearly.
6. Keep answers concise and actionable — 3-6 sentences unless more detail is genuinely needed.
7. When relevant, mention Horizon's recommendation engine rules
   (sustainability >85 = +5% bonus, congestion >80 = -10% penalty, etc.).
8. Always end your response with: "Thank you for trusting TUI Care Foundation.
   I'm here for any other questions."
```

The active prompt is selected by `_get_system_prompt(lang: str)` based on `request.lang`.

---

# 4. Message Construction

`_build_messages()` assembles the OpenAI messages array for each request:

```python
def _build_messages(question, context_docs, history=None, lang='es') -> list[dict]:
    messages = [{"role": "system", "content": _get_system_prompt(lang)}]

    if history:
        messages.extend(
            {"role": m["role"], "content": m["content"]}
            for m in history[-MAX_HISTORY_TURNS:]
        )

    messages.append({
        "role": "user",
        "content": _build_user_message(question, context_docs)
    })

    return messages
```

`MAX_HISTORY_TURNS = 6` (3 user + 3 assistant turns).

## User Message Format

```
Context documents:

[1] {destination_name}
{document_text}

[2] {destination_name}
{document_text}

...

Question: {user_question}
```

---

# 5. Answer Generation (Non-Streaming)

`ask()` is used by `POST /ask` for non-streaming responses:

```python
def ask(question, context_docs, history=None, lang='es') -> str:
    messages = _build_messages(question, context_docs, history, lang)
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=1024,
    )
    return response.choices[0].message.content
```

---

# 6. Streaming Architecture

`stream_ask()` is used by `POST /ask/stream` for token-by-token streaming:

```python
def stream_ask(question, context_docs, history=None, lang='es') -> Iterator[str]:
    messages = _build_messages(question, context_docs, history, lang)
    stream = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
```

This is a synchronous generator. FastAPI is async — bridging is required.

## Sync-to-Async Bridge

The synchronous generator cannot be called directly from async FastAPI code. The bridge uses `asyncio.Queue` and `ThreadPoolExecutor`:

```python
# In app.py — inside the SSE event generator
queue: asyncio.Queue = asyncio.Queue()

def run_stream():
    try:
        for token in stream_ask(question, retrieved, history, lang):
            asyncio.run_coroutine_threadsafe(queue.put(token), loop)
    except Exception as e:
        asyncio.run_coroutine_threadsafe(queue.put(e), loop)
    finally:
        asyncio.run_coroutine_threadsafe(queue.put(None), loop)  # sentinel

_executor.submit(run_stream)

while True:
    item = await queue.get()
    if item is None:      break           # stream complete
    if isinstance(item, Exception):
        yield {"data": json.dumps({"type": "error", "message": str(item)})}
        return
    yield {"data": json.dumps({"type": "token", "content": item})}
```

The `ThreadPoolExecutor` has 2 workers — sufficient for the single-user demo case.

---

# 7. Server-Sent Events (SSE) Protocol

`POST /ask/stream` returns an `EventSourceResponse` from `sse-starlette`. The SSE stream emits three event types:

## Source Events

Emitted before the LLM call, one per retrieved document:

```json
{ "type": "source", "destination_name": "Mallorca", "text": "...", "relevance": 0.82 }
```

## Token Events

Emitted for each LLM output chunk:

```json
{ "type": "token", "content": "Mallorca" }
{ "type": "token", "content": " es" }
{ "type": "token", "content": " un" }
```

## Done Event

Emitted after the last token:

```json
{ "type": "done" }
```

## Error Event

Emitted on failure:

```json
{ "type": "error", "message": "OpenAI API rate limit exceeded" }
```

---

# 8. Frontend SSE Reader

`streamAsk()` in `sageApi.ts` reads the SSE stream line by line:

```typescript
export async function* streamAsk(
  question: string,
  history: ConversationTurn[] = [],
  lang = 'es',
  nResults = 5,
): AsyncGenerator<SseEvent> {
  const res = await fetch('/api/ask/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history, lang, n_results: nResults }),
  });

  const reader = res.body!.getReader();
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
        const json = line.slice(6).trim();
        if (json) yield JSON.parse(json) as SseEvent;
      }
    }
  }
}
```

The `useSageStream` hook consumes this generator and dispatches state updates for each event type.

---

# 9. Query Rewriting

`rewrite_query()` is called before retrieval on every request:

```python
def rewrite_query(question: str, history: list[dict] | None) -> str:
    if not history or len(history) < 2:
        return question  # first question — no rewriting needed

    messages = [
        {"role": "system", "content": REWRITE_SYSTEM_PROMPT},
        *history[-4:],  # last 2 turns for context
        {"role": "user", "content": question},
    ]
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=100,
    )
    rewritten = response.choices[0].message.content.strip()
    return rewritten or question  # fallback to original if empty
```

The rewriting call uses `max_tokens=100` since standalone queries are short. It adds a small latency cost (~200–500ms) but significantly improves retrieval accuracy for follow-up questions.

---

# 10. Blocking Calls and Executor

All LLM and ChromaDB calls are blocking (synchronous). FastAPI is async — all blocking calls must run in the ThreadPoolExecutor to avoid blocking the event loop:

```python
_executor = ThreadPoolExecutor(max_workers=2)

# In endpoint handlers:
retrieval_query = await loop.run_in_executor(
    _executor, lambda: rewrite_query(request.question, history)
)
retrieved = await loop.run_in_executor(
    _executor, lambda: query(retrieval_query, request.n_results)
)
```

ChromaDB's `PersistentClient` is not thread-safe in all configurations. The executor ensures calls are serialised within its worker pool.

---

# 11. Feedback Logging

After a response is complete, the user can submit a thumbs up or down via `rateFeedback()` in `useSageStream.ts`. This calls `POST /api/feedback`, which appends a JSON Lines record to `data/feedback.jsonl`:

```json
{"ts": "2026-06-26T14:32:01.123456+00:00", "message_id": "uuid-...", "answer": "Mallorca es...", "feedback": "up"}
```

The `answer` field is truncated to 500 characters. `feedback.jsonl` is gitignored — it accumulates locally during demos and TFM evaluation sessions.
