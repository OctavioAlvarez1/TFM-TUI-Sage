"""FastAPI application for Sage — RAG-powered destination advisor."""
import asyncio
import json
from contextlib import asynccontextmanager
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from src.rag.knowledge_base import build_knowledge_base, query, is_built
from src.llm.claude_client import ask, stream_ask
from src.config.settings import get_api_key, COLLECTION_NAME, CHROMA_DIR
from src.api.models import (
    AskRequest, AskResponse, SourceDocument,
    StatusResponse, RebuildResponse,
)

_executor = ThreadPoolExecutor(max_workers=2)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not is_built():
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(_executor, build_knowledge_base)
    yield


app = FastAPI(
    title="Sage — AI Destination Advisor API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _doc_to_source(doc: dict) -> SourceDocument:
    return SourceDocument(
        destination_name=doc["metadata"].get("destination_name", "Unknown"),
        text=doc["text"][:300],
        relevance=round(1 - doc.get("distance", 0), 2),
    )


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/status", response_model=StatusResponse)
async def status():
    built = is_built()
    api_key_set = True
    try:
        get_api_key()
    except ValueError:
        api_key_set = False

    doc_count = 0
    if built:
        try:
            import chromadb
            client = chromadb.PersistentClient(path=str(CHROMA_DIR))
            doc_count = client.get_collection(COLLECTION_NAME).count()
        except Exception:
            pass

    if not api_key_set:
        status_str = "api_key_missing"
    elif not built:
        status_str = "kb_missing"
    else:
        status_str = "ready"

    return StatusResponse(
        kb_built=built,
        api_key_set=api_key_set,
        collection_name=COLLECTION_NAME,
        document_count=doc_count,
        status=status_str,
    )


@app.post("/ask", response_model=AskResponse)
async def ask_endpoint(request: AskRequest):
    if not is_built():
        raise HTTPException(status_code=503, detail="Knowledge base not ready")
    loop = asyncio.get_event_loop()
    retrieved = await loop.run_in_executor(
        _executor, lambda: query(request.question, request.n_results)
    )
    answer = await loop.run_in_executor(
        _executor, lambda: ask(request.question, retrieved)
    )
    return AskResponse(
        answer=answer,
        sources=[_doc_to_source(d) for d in retrieved],
        question=request.question,
    )


@app.post("/ask/stream")
async def ask_stream(request: AskRequest):
    if not is_built():
        raise HTTPException(status_code=503, detail="Knowledge base not ready")

    async def event_generator():
        loop = asyncio.get_event_loop()

        # Retrieve relevant documents
        retrieved = await loop.run_in_executor(
            _executor, lambda: query(request.question, request.n_results)
        )

        # Emit source events first
        for doc in retrieved:
            source = _doc_to_source(doc)
            yield {
                "data": json.dumps({
                    "type": "source",
                    "destination_name": source.destination_name,
                    "text": source.text,
                    "relevance": source.relevance,
                })
            }

        # Bridge synchronous stream_ask generator to async via queue
        queue: asyncio.Queue = asyncio.Queue()

        def run_stream():
            try:
                for token in stream_ask(request.question, retrieved):
                    asyncio.run_coroutine_threadsafe(queue.put(token), loop)
            except Exception as e:
                asyncio.run_coroutine_threadsafe(queue.put(e), loop)
            finally:
                asyncio.run_coroutine_threadsafe(queue.put(None), loop)

        _executor.submit(run_stream)

        while True:
            item = await queue.get()
            if item is None:
                break
            if isinstance(item, Exception):
                yield {"data": json.dumps({"type": "error", "message": str(item)})}
                return
            yield {"data": json.dumps({"type": "token", "content": item})}

        yield {"data": json.dumps({"type": "done"})}

    return EventSourceResponse(event_generator())


@app.post("/rebuild", response_model=RebuildResponse)
async def rebuild():
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            _executor, lambda: build_knowledge_base(force_rebuild=True)
        )
        return RebuildResponse(success=True, message="Knowledge base rebuilt successfully")
    except Exception as e:
        return RebuildResponse(success=False, message=str(e))
