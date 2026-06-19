import streamlit as st
from src.rag.knowledge_base import build_knowledge_base, query, is_built
from src.llm.claude_client import ask
from src.config.settings import get_api_key

st.set_page_config(
    page_title="Sage — AI Destination Advisor",
    page_icon="🔮",
    layout="wide",
)

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.title("🔮 Sage")
    st.caption("RAG-powered AI advisor for Spanish tourism destinations.")
    st.divider()

    # API key check
    try:
        get_api_key()
        st.success("✅ ANTHROPIC_API_KEY is set")
    except ValueError as e:
        st.error(str(e))
        st.stop()

    # Knowledge base status
    kb_built = is_built()
    if kb_built:
        st.success("✅ Knowledge base ready")
    else:
        st.warning("⚙️ Knowledge base not built yet")

    st.divider()
    st.markdown("**How Sage works:**")
    st.markdown("""
1. Your question is embedded and matched against 20 destination profiles
2. The top relevant documents are retrieved from ChromaDB
3. Claude AI generates a grounded answer using only those documents
4. Sources are shown below each answer
    """)

    st.divider()
    st.markdown("**Example questions:**")
    examples = [
        "Which beach destination has the lowest congestion in August?",
        "What are the most sustainable destinations in Spain?",
        "Which destinations should I avoid in summer due to overcrowding?",
        "Which city is best for a family with sustainable travel?",
        "Which destinations get a Horizon bonus and why?",
    ]
    for ex in examples:
        st.markdown(f"- *{ex}*")

# ── Main area ─────────────────────────────────────────────────────────────────
st.title("🔮 Sage — AI Destination Intelligence")
st.caption("Ask anything about Spain's 20 tourism destinations. Answers are grounded in real data.")

# Build knowledge base on first run
if not is_built():
    with st.spinner("Building knowledge base — first run takes ~30 seconds (downloading embedding model)..."):
        try:
            build_knowledge_base()
            st.success("Knowledge base ready!")
            st.rerun()
        except Exception as e:
            st.error(f"Failed to build knowledge base: {e}")
            st.stop()

# ── Chat interface ────────────────────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = []

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
        if msg["role"] == "assistant" and "sources" in msg:
            with st.expander(f"📚 Sources ({len(msg['sources'])} documents retrieved)"):
                for i, src in enumerate(msg["sources"]):
                    name = src["metadata"].get("destination_name", "Unknown")
                    dist = src.get("distance", 0)
                    st.markdown(f"**{i+1}. {name}** (relevance: {1 - dist:.2f})")
                    st.markdown(f"_{src['text'][:300]}..._")

if prompt := st.chat_input("Ask about Spain's tourism destinations..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Retrieving relevant documents and consulting Claude..."):
            try:
                retrieved = query(prompt, n_results=5)
                response = ask(prompt, retrieved)
                st.markdown(response)
                with st.expander(f"📚 Sources ({len(retrieved)} documents retrieved)"):
                    for i, src in enumerate(retrieved):
                        name = src["metadata"].get("destination_name", "Unknown")
                        dist = src.get("distance", 0)
                        st.markdown(f"**{i+1}. {name}** (relevance: {1 - dist:.2f})")
                        st.markdown(f"_{src['text'][:300]}..._")

                st.session_state.messages.append({
                    "role": "assistant",
                    "content": response,
                    "sources": retrieved,
                })
            except ValueError as e:
                st.error(str(e))
            except Exception as e:
                st.error(f"Error: {e}")
