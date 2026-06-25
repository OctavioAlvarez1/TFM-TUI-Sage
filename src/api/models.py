"""Pydantic schemas for Sage API request/response contracts."""
from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    n_results: int = Field(default=5, ge=1, le=10)


class SourceDocument(BaseModel):
    destination_name: str
    text: str
    relevance: float


class AskResponse(BaseModel):
    answer: str
    sources: list[SourceDocument]
    question: str


class StatusResponse(BaseModel):
    kb_built: bool
    api_key_set: bool
    collection_name: str
    document_count: int
    status: str  # "ready" | "kb_missing" | "api_key_missing" | "error"


class RebuildResponse(BaseModel):
    success: bool
    message: str
