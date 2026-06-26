"""LLM wrapper for Sage's RAG responses."""
from collections.abc import Iterator
from openai import OpenAI
from src.config.settings import get_api_key

_SYSTEM_PROMPT_ES = """Eres Sage, un asesor de turismo con IA para el programa TUI Care Foundation Future Shapers Spain.

Ayudas a stakeholders a entender los patrones turísticos de España, el rendimiento en sostenibilidad y las recomendaciones de destinos. Tienes acceso a datos de 20 destinos españoles: niveles de congestión, puntuaciones de sostenibilidad y las reglas del motor de recomendación Horizon.

REGLAS IMPORTANTES:
1. Responde SIEMPRE en español, independientemente del idioma de los documentos de contexto.
2. Responde ÚNICAMENTE basándote en los documentos de contexto proporcionados. No inventes datos.
3. Cita siempre los nombres específicos de los destinos que mencionas.
4. Cuando menciones puntuaciones, sé preciso (p. ej., "puntuación de sostenibilidad 87/100").
5. Si el contexto no contiene información suficiente para responder, indícalo claramente.
6. Mantén las respuestas concisas y accionables — 3-6 frases salvo que sea necesario más detalle.
7. Cuando sea relevante, menciona las reglas del motor de recomendación Horizon (sostenibilidad >85 = +5%, congestión >80 = penalización -10%, etc.)."""

_SYSTEM_PROMPT_EN = """You are Sage, an AI tourism advisor for the TUI Care Foundation Future Shapers Spain programme.

You help stakeholders understand Spain's tourism patterns, sustainability performance, and destination recommendations. You have access to data on 20 Spanish destinations including congestion levels, sustainability scores, and Horizon's AI recommendation engine rules.

IMPORTANT RULES:
1. Always respond in English, regardless of the language of the context documents.
2. Answer ONLY based on the context documents provided. Do not invent data.
3. Always cite the specific destination names you refer to.
4. When mentioning scores, be precise (e.g., "sustainability score 87/100").
5. If the context does not contain enough information to answer, say so clearly.
6. Keep answers concise and actionable — 3-6 sentences unless more detail is genuinely needed.
7. When relevant, mention Horizon's recommendation engine rules (sustainability >85 = +5% bonus, congestion >80 = -10% penalty, etc.)."""


def _get_system_prompt(lang: str) -> str:
    return _SYSTEM_PROMPT_EN if lang == 'en' else _SYSTEM_PROMPT_ES

MAX_HISTORY_TURNS = 6  # last 3 exchanges (user + assistant each)


def _build_context(context_docs: list[dict]) -> str:
    return "\n\n---\n\n".join(
        f"[Document {i+1}: {doc['metadata'].get('destination_name', 'Unknown')}]\n{doc['text']}"
        for i, doc in enumerate(context_docs)
    )


def _build_user_message(question: str, context_docs: list[dict]) -> str:
    return f"Context documents:\n\n{_build_context(context_docs)}\n\n---\n\nQuestion: {question}"


def _build_messages(question: str, context_docs: list[dict], history: list[dict] | None, lang: str = 'es') -> list[dict]:
    messages = [{"role": "system", "content": _get_system_prompt(lang)}]
    if history:
        messages.extend(
            {"role": m["role"], "content": m["content"]}
            for m in history[-MAX_HISTORY_TURNS:]
        )
    messages.append({"role": "user", "content": _build_user_message(question, context_docs)})
    return messages


def rewrite_query(question: str, history: list[dict] | None) -> str:
    """Rewrite a follow-up question into a standalone retrieval query."""
    if not history or len(history) < 2:
        return question
    client = OpenAI(api_key=get_api_key())
    history_str = "\n".join(
        f"{m['role'].upper()}: {m['content'][:300]}" for m in history[-4:]
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=80,
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": (
                    "Eres un asistente que reescribe preguntas de seguimiento como consultas "
                    "de búsqueda autónomas en español. Incorpora el contexto necesario del "
                    "historial. Devuelve ÚNICAMENTE la consulta reescrita, sin explicaciones."
                ),
            },
            {
                "role": "user",
                "content": f"Historial:\n{history_str}\n\nPregunta de seguimiento: {question}",
            },
        ],
    )
    return response.choices[0].message.content.strip()


def ask(question: str, context_docs: list[dict], history: list[dict] | None = None, lang: str = 'es') -> str:
    client = OpenAI(api_key=get_api_key())
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=1024,
        messages=_build_messages(question, context_docs, history, lang),
    )
    return response.choices[0].message.content


def stream_ask(question: str, context_docs: list[dict], history: list[dict] | None = None, lang: str = 'es') -> Iterator[str]:
    client = OpenAI(api_key=get_api_key())
    with client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=1024,
        stream=True,
        messages=_build_messages(question, context_docs, history, lang),
    ) as stream:
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
