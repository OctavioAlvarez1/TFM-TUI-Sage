# RAG Pipeline Design

## Sage — Hybrid Retrieval-Augmented Generation

---

# 1. Overview

Sage uses a Retrieval-Augmented Generation (RAG) architecture in which every LLM response is grounded in documents retrieved from a local knowledge base. The LLM cannot answer from its own training knowledge — it is instructed to respond only from the context documents provided.

The retrieval pipeline is hybrid: it combines two independent ranking signals (semantic similarity and keyword matching) fused via Reciprocal Rank Fusion (RRF), with a relevance threshold that filters irrelevant documents before they reach the LLM.

---

# 2. End-to-End Pipeline

```
User question
    │
    ├─► Query Rewriting (if follow-up)
    │       LLM converts "and that one?" into a standalone query
    │       Skips if history < 2 messages (first question is always standalone)
    │
    ├─► Hybrid Retrieval
    │   ├─► Semantic Search
    │   │       ChromaDB cosine similarity
    │   │       n_candidates = min(count, max(n_results×3, 15))
    │   │
    │   ├─► BM25 Keyword Search
    │   │       BM25Okapi over all 21 documents
    │   │       Tokenised: lowercase + strip punctuation + split on whitespace
    │   │
    │   └─► RRF Fusion
    │           score = 1 / (60 + rank + 1) for each ranker
    │           Scores summed across both rankers
    │           Sorted descending by combined RRF score
    │
    ├─► Relevance Filter
    │       Remove docs where cosine distance > 0.6
    │       If all filtered: fall back to top n_results from semantic ranker
    │
    └─► LLM Generation
            Retrieved docs injected as context
            Conversation history (last 6 messages) included
            System prompt: respond only from context, in the active language
            Streamed token by token via OpenAI API
```

---

# 3. Semantic Search (ChromaDB)

ChromaDB stores all 21 documents with embeddings computed using `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional dense vectors).

At query time, the question is embedded with the same model and a cosine similarity search is performed. The number of candidates retrieved is:

```python
n_candidates = min(collection.count(), max(n_results * 3, 15))
```

This over-fetches candidates to give the RRF fusion enough signal from both rankers, rather than returning the final n_results directly from semantic search.

Each candidate is returned with its cosine distance (lower = more similar). The distance is converted to a relevance score for display: `relevance = round(1 - distance, 2)`.

---

# 4. Keyword Search (BM25)

BM25 (Best Match 25) is a probabilistic keyword ranking function that scores documents based on term frequency and inverse document frequency, with length normalisation.

Sage uses `BM25Okapi` from the `rank-bm25` library.

## Index Construction

The BM25 index is built lazily on the first `query()` call after startup or after a rebuild. It is stored in module-level variables:

```python
_bm25: BM25Okapi | None = None
_bm25_corpus: list[dict] | None = None
```

On rebuild (`POST /rebuild`), both are reset to `None`, forcing re-indexing on the next query.

## Tokenisation

```python
def _tokenize(text: str) -> list[str]:
    return re.sub(r'[^\w\s]', '', text.lower()).split()
```

All document texts and queries are tokenised using this function — lowercase, punctuation stripped, split on whitespace.

## Corpus

The BM25 corpus is built from the ChromaDB collection at index time:

```python
result = collection.get(include=["documents", "metadatas"])
_bm25_corpus = [
    {"id": id_, "text": text, "metadata": meta}
    for id_, text, meta in zip(result["ids"], result["documents"], result["metadatas"])
]
_bm25 = BM25Okapi([_tokenize(d["text"]) for d in _bm25_corpus])
```

---

# 5. Reciprocal Rank Fusion (RRF)

RRF combines rankings from multiple retrieval systems without requiring score normalisation. The formula for each document per retriever is:

```
RRF_score(d, retriever) = 1 / (k + rank(d) + 1)
```

where `k = 60` (the standard constant that reduces the influence of the top-ranked documents) and `rank(d)` is the document's 0-indexed position in that retriever's ranked list.

The final score is the sum across both retrievers:

```
final_score(d) = RRF_score(d, semantic) + RRF_score(d, bm25)
```

Documents are sorted descending by `final_score`, so documents that rank highly in both retrievers score highest. Documents that appear in only one retriever still receive a non-zero score from that retriever's contribution.

---

# 6. Relevance Threshold

After RRF fusion, documents are filtered by cosine distance:

```python
RELEVANCE_THRESHOLD = 0.6  # in src/config/settings.py

filtered = [d for d in fused if d.get("distance", 1.0) <= RELEVANCE_THRESHOLD]

if not filtered:
    # Fallback: return top n_results from semantic results (no threshold)
    return semantic_results[:n_results]

return filtered[:n_results]
```

A distance of 0.6 corresponds to roughly 40% cosine similarity. Documents farther than this threshold are considered insufficiently relevant to the query and are excluded from the context sent to the LLM.

The fallback prevents empty responses when the query is genuinely on-topic but phrased in a way that doesn't match any document closely (e.g., a very abstract or oblique question).

---

# 7. Query Rewriting

In a multi-turn conversation, follow-up questions often lack the context needed for accurate retrieval:

- "What about its public transport?" — who is "its"?
- "And that destination you mentioned?" — which destination?
- "Is it crowded in winter too?" — crowded where?

Without rewriting, these queries retrieve the wrong documents because the retriever has no access to conversation history.

`rewrite_query(question, history)` in `claude_client.py` solves this by calling the LLM with a meta-prompt:

```python
REWRITE_SYSTEM = (
    "You are a query rewriting assistant. Your task is to rewrite a follow-up question "
    "into a standalone search query that captures the full retrieval intent. "
    "Return ONLY the rewritten query — no explanation, no preamble."
)
```

The function is skipped when `history` is empty or has fewer than 2 messages (the first question in a session is always self-contained).

The rewritten query is used for retrieval. The original question (not the rewritten version) is what the LLM answers, preserving the user's natural phrasing in the response.

---

# 8. Conversation History

The last `MAX_HISTORY_TURNS = 6` messages (3 user + 3 assistant turns) are passed to the LLM on every request. They are sent in the OpenAI messages array, ordered chronologically before the current user message:

```python
messages = [
    {"role": "system", "content": system_prompt},
    # ... up to 6 historical messages ...
    {"role": "user", "content": user_message_with_context}
]
```

The frontend captures history from `messagesRef.current` before adding the new user message, filtering out any messages that are still streaming (`isStreaming: true`) or have empty content.

---

# 9. Relevance Score Interpretation

| Relevance (1 - distance) | Interpretation |
|---|---|
| 0.85–1.00 | Very high — document is a near-exact match to the query |
| 0.70–0.84 | High — document is clearly relevant |
| 0.55–0.69 | Moderate — document is related but not specific |
| 0.40–0.54 | Low — document is on the edge of relevance |
| < 0.40 | Filtered out (distance > 0.60 threshold) |

---

# 10. System Prompt Design

Two system prompts are maintained in `claude_client.py` — one per language:

```python
_SYSTEM_PROMPT_ES = """Eres Sage, el asesor de destinos turísticos de España de la suite
TUI Care Foundation. Responde SIEMPRE en español. Responde ÚNICAMENTE con la información
de los documentos de contexto proporcionados. Cita los nombres de destinos con precisión.
Menciona las reglas de negocio de Horizon cuando sean relevantes. Si la información no está
en el contexto, indícalo claramente — nunca inventes datos."""

_SYSTEM_PROMPT_EN = """You are Sage, Spain's tourism destination advisor from the TUI Care
Foundation suite. Always respond in English. Answer ONLY from the provided context documents.
Cite destination names precisely. Reference Horizon's business rules when relevant. If the
information is not in the context, say so clearly — never invent data."""
```

The active prompt is selected based on `request.lang` (`'es'` or `'en'`).

---

# 11. Document Context Format

Retrieved documents are injected into the user message in a structured format:

```
Context documents:

[1] Mallorca
Mallorca es un destino de tipo Beach ubicado en Balearic Islands, España.
Sostenibilidad: 72.3/100 (nivel Bueno). Congestión media anual: 78.4/100.
Mes de mayor congestión: Agosto. Meses con congestión elevada (>80): Julio, Agosto.
En el motor de recomendación Horizon: la congestión supera 80 en Julio, Agosto,
activando la penalización de redistribución del -10% de Horizon esos meses.

[2] Menorca
Menorca es un destino de tipo Beach ubicado en Balearic Islands, España.
Sostenibilidad: 81.5/100 (nivel Bueno). Congestión media anual: 44.2/100.
...
```

The LLM is explicitly instructed not to answer from knowledge outside this context block.
