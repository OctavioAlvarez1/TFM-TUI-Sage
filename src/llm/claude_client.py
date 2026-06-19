"""Anthropic Claude API wrapper for Sage's RAG responses."""
import anthropic
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


def ask(question: str, context_docs: list[dict]) -> str:
    api_key = get_api_key()
    client = anthropic.Anthropic(api_key=api_key)

    context_text = "\n\n---\n\n".join(
        f"[Document {i+1}: {doc['metadata'].get('destination_name', 'Unknown')}]\n{doc['text']}"
        for i, doc in enumerate(context_docs)
    )

    user_message = f"""Context documents:

{context_text}

---

Question: {question}"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )
    return message.content[0].text
