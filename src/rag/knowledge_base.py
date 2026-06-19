"""ChromaDB knowledge base: build, persist, and query destination documents."""
import chromadb
from chromadb.utils import embedding_functions
from src.config.settings import CHROMA_DIR, COLLECTION_NAME
from src.rag.document_builder import build_destination_documents

_client: chromadb.PersistentClient | None = None
_collection = None


def _get_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    return _client


def build_knowledge_base(force_rebuild: bool = False) -> None:
    client = _get_client()
    existing = [c.name for c in client.list_collections()]

    if COLLECTION_NAME in existing and not force_rebuild:
        return

    if COLLECTION_NAME in existing:
        client.delete_collection(COLLECTION_NAME)

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
    client = _get_client()
    ef = embedding_functions.DefaultEmbeddingFunction()
    collection = client.get_collection(name=COLLECTION_NAME, embedding_function=ef)
    results = collection.query(query_texts=[text], n_results=n_results)

    output = []
    for i, doc in enumerate(results["documents"][0]):
        output.append({
            "text": doc,
            "metadata": results["metadatas"][0][i],
            "distance": results["distances"][0][i] if results.get("distances") else 0,
        })
    return output


def is_built() -> bool:
    try:
        client = _get_client()
        names = [c.name for c in client.list_collections()]
        return COLLECTION_NAME in names
    except Exception:
        return False
