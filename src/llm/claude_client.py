"""LLM wrapper for Sage's RAG responses."""
from collections.abc import Iterator
from openai import OpenAI
from src.config.settings import get_api_key

SYSTEM_PROMPT = """You are Sage, an AI tourism advisor for the TUI Care Foundation Future Shapers Spain programme.

You help stakeholders understand Spain's tourism patterns, sustainability performance, and destination recommendations. You have access to data on 20 Spanish destinations including congestion levels, sustainability scores, and Horizon's AI recommendation engine rules.

IMPORTANT RULES:
1. Answer ONLY based on the context documents provided. Do not invent data.
2. Always cite the specific destination names you refer to.
3. When mentioning scores, be precise (e.g., "sustainability score 87/100").
4. If the context does not contain enough information to answer, say so clearly.
5. Keep answers concise and actionable — 3-6 sentences unless a longer explanation is genuinely needed.
6. When relevant, mention the Horizon recommendation engine's business rules (sustainability >85 = +5%, congestion >80 = -10% penalty, etc.)."""


def _build_context(context_docs: list[dict]) -> str:
    return "\n\n---\n\n".join(
        f"[Document {i+1}: {doc['metadata'].get('destination_name', 'Unknown')}]\n{doc['text']}"
        for i, doc in enumerate(context_docs)
    )


def _build_user_message(question: str, context_docs: list[dict]) -> str:
    return f"Context documents:\n\n{_build_context(context_docs)}\n\n---\n\nQuestion: {question}"


def ask(question: str, context_docs: list[dict]) -> str:
    client = OpenAI(api_key=get_api_key())
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=1024,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_message(question, context_docs)},
        ],
    )
    return response.choices[0].message.content


def stream_ask(question: str, context_docs: list[dict]) -> Iterator[str]:
    """Yields text delta strings as the model generates them."""
    client = OpenAI(api_key=get_api_key())
    with client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=1024,
        stream=True,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_message(question, context_docs)},
        ],
    ) as stream:
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
