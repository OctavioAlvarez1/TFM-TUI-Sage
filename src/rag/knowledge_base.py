"""ChromaDB knowledge base: build, persist, and query destination documents."""
import re
import chromadb
from rank_bm25 import BM25Okapi
from chromadb.utils import embedding_functions
from src.config.settings import CHROMA_DIR, COLLECTION_NAME, RELEVANCE_THRESHOLD
from src.rag.document_builder import build_destination_documents

_client: chromadb.PersistentClient | None = None
_bm25: BM25Okapi | None = None
_bm25_corpus: list[dict] | None = None


def _get_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    return _client


def _tokenize(text: str) -> list[str]:
    return re.sub(r'[^\w\s]', '', text.lower()).split()


def _build_bm25_index(collection) -> None:
    global _bm25, _bm25_corpus
    result = collection.get(include=["documents", "metadatas"])
    _bm25_corpus = [
        {"id": id_, "text": text, "metadata": meta}
        for id_, text, meta in zip(result["ids"], result["documents"], result["metadatas"])
    ]
    _bm25 = BM25Okapi([_tokenize(d["text"]) for d in _bm25_corpus])


def build_knowledge_base(force_rebuild: bool = False) -> None:
    global _bm25, _bm25_corpus
    client = _get_client()
    existing = [c.name for c in client.list_collections()]

    if COLLECTION_NAME in existing and not force_rebuild:
        return

    if COLLECTION_NAME in existing:
        client.delete_collection(COLLECTION_NAME)
    _bm25 = None
    _bm25_corpus = None

    ef = embedding_functions.DefaultEmbeddingFunction()
    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=ef,
        metadata={"hnsw:space": "cosine"},
    )

    docs = build_destination_documents()
    collection.add(
        ids=[d["id"] for d in docs],
        documents=[d["text"] for d in docs],
        metadatas=[d["metadata"] for d in docs],
    )


def query(text: str, n_results: int = 5) -> list[dict]:
    global _bm25, _bm25_corpus
    client = _get_client()
    ef = embedding_functions.DefaultEmbeddingFunction()
    collection = client.get_collection(name=COLLECTION_NAME, embedding_function=ef)

    if _bm25 is None:
        _build_bm25_index(collection)

    n_candidates = min(collection.count(), max(n_results * 3, 15))

    # Semantic search
    sem = collection.query(query_texts=[text], n_results=n_candidates)

    # BM25 search
    bm25_scores = _bm25.get_scores(_tokenize(text))
    bm25_ranked = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)

    # Build doc map keyed by destination_id
    doc_map: dict[str, dict] = {}

    for rank, (doc_text, metadata, distance) in enumerate(zip(
        sem["documents"][0], sem["metadatas"][0], sem["distances"][0]
    )):
        key = str(metadata.get("destination_id", f"sem_{rank}"))
        doc_map[key] = {"text": doc_text, "metadata": metadata, "distance": distance, "rrf": 0.0}

    for corpus_doc in _bm25_corpus:
        key = str(corpus_doc["metadata"].get("destination_id", corpus_doc["id"]))
        if key not in doc_map:
            doc_map[key] = {"text": corpus_doc["text"], "metadata": corpus_doc["metadata"], "distance": 1.0, "rrf": 0.0}

    # RRF fusion (k=60)
    k = 60
    for rank, metadata in enumerate(sem["metadatas"][0]):
        key = str(metadata.get("destination_id", f"sem_{rank}"))
        doc_map[key]["rrf"] += 1 / (k + rank + 1)

    for rank, idx in enumerate(bm25_ranked[:n_candidates]):
        key = str(_bm25_corpus[idx]["metadata"].get("destination_id", _bm25_corpus[idx]["id"]))
        if key in doc_map:
            doc_map[key]["rrf"] += 1 / (k + rank + 1)

    # Filter by relevance threshold
    candidates = [d for d in doc_map.values() if d["distance"] <= RELEVANCE_THRESHOLD]

    if not candidates:
        # Fallback: return best semantic results even above threshold
        candidates = sorted(doc_map.values(), key=lambda d: d["distance"])[:n_results]

    candidates.sort(key=lambda d: d["rrf"], reverse=True)
    return [
        {"text": d["text"], "metadata": d["metadata"], "distance": d["distance"]}
        for d in candidates[:n_results]
    ]


def is_built() -> bool:
    try:
        client = _get_client()
        names = [c.name for c in client.list_collections()]
        return COLLECTION_NAME in names
    except Exception:
        return False
