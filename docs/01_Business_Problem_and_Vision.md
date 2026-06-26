# Business Problem and Vision

## Sage — RAG-Powered AI Destination Advisor for the TUI Care Foundation Suite

---

# 1. Business Problem Definition

Spain receives more international tourists than almost any country in the world. However, visitor demand is concentrated in a small fraction of destinations: approximately 85% of tourists travel to just 10% of Spain's available destinations — Barcelona, Mallorca, Ibiza, Tenerife, the Costa del Sol, and a handful of others.

This concentration creates compounding challenges that affect local communities, ecosystems, and the long-term commercial viability of the tourism sector.

## The Information Gap

Beyond the physical problem of overtourism, there is an information gap that makes it worse.

Travelers and tourism professionals cannot easily access the rich data that characterises each destination — congestion levels by month, sustainability indicators, carbon footprints, local business support scores, public transport quality, and how recommendation algorithms like Horizon's scoring engine treat each destination.

This data exists in the TUI Care Foundation Suite (built across Retos 1–5) but it is trapped in dashboards, CSV files, and structured tables that require technical knowledge to query.

## The Opportunity for Natural Language AI

If that data could be queried through natural language — the way a traveler or analyst would naturally ask questions — it would unlock the suite's full analytical value for a wider audience.

**Sage** fills this gap. It provides a conversational AI interface grounded exclusively in the TUI Care Foundation dataset, allowing anyone to ask questions in Spanish or English and receive data-backed answers.

---

# 2. Solution Objectives

## Primary Objective

Make the entire TUI Care Foundation dataset queryable via natural language, enabling travelers, analysts, and TUI professionals to extract insights without requiring technical knowledge of the underlying data.

## Secondary Objectives

### Intelligence Accessibility

Translate the quantitative outputs of the Horizon scoring engine (sustainability scores, congestion indices, bonuses and penalties) into plain-language explanations accessible to non-technical users.

### Demand Redistribution Support

Provide conversational guidance that complements Horizon's recommendation engine — helping users understand not just which destination is recommended, but why, in terms of sustainability, congestion, and business rules.

### Bilingual Coverage

Serve both Spanish-speaking and English-speaking users through a fully bilingual interface and knowledge base.

### TFM Research Value

Generate a structured feedback dataset (`feedback.jsonl`) capturing user satisfaction signals for academic analysis of RAG system performance.

---

# 3. Stakeholders

## Internal Stakeholders

### TUI Care Foundation

Interested in demonstrating that tourism data can be made conversationally accessible to a broader audience, not only to data analysts.

### TUI Sustainability Team

Benefits from having sustainability data — scores, tiers, carbon indicators, and local business metrics — surfaced through natural language rather than dashboards alone.

### Data and AI Teams

Responsible for the quality and freshness of the underlying CSV data that Sage's knowledge base is built from.

## Academic Stakeholders

### UCM TFM Jury

Evaluates the technical quality and innovation of the RAG pipeline, hybrid retrieval, streaming architecture, and bilingual design.

### Future Researchers

Sage's open `feedback.jsonl` dataset provides a ground-truth signal for evaluating conversational RAG systems over Spanish tourism data.

## End Users

### Travelers

Ask natural language questions about destinations before making booking decisions.

### Tourism Analysts

Query the dataset without writing SQL or reading raw CSVs.

---

# 4. Key Performance Indicators (KPIs)

## User Satisfaction (Feedback Rate)

Ratio of thumbs-up to thumbs-down votes logged per session. Target: > 70% positive.

## Source Attribution Rate

Percentage of responses that include at least one retrieved source document. Target: > 90%.

## Query Coverage

Percentage of questions that receive a grounded answer (vs. fallback or out-of-scope response). Measured via relevance threshold — documents with distance > 0.6 are filtered.

## Response Latency

Time from question submission to first streamed token. Target: < 2 seconds on local hardware.

## Knowledge Base Freshness

ChromaDB is rebuilt on-demand (`POST /rebuild`). Target: rebuild completes in < 60 seconds.

---

# 5. Target Users

## Curious Travelers

Travelers planning a trip to Spain who want data-backed answers to natural-language questions: "Is Ibiza too crowded in August?", "Which destination has the best sustainability rating?".

## TUI Professionals

Internal analysts who want to query the suite dataset without writing code or reading dashboards.

## Sustainability-Conscious Travelers

Travelers who want to understand which destinations have the lowest environmental impact and why Horizon recommends or penalises certain options.

---

# 6. Primary Use Cases

## Destination Research

"What are the most sustainable destinations in Spain?" → Sage retrieves destination documents ranked by sustainability score and synthesises a grounded answer.

## Congestion Avoidance

"Should I avoid Barcelona in summer?" → Sage retrieves Barcelona's congestion profile, reports its peak months, and suggests alternatives with lower congestion.

## Horizon Rule Explanation

"Which destinations get a bonus from Horizon and why?" → Sage retrieves documents that include the embedded Horizon business rules (sustainability > 85 → +5%; congestion < 40 → +5%) and explains them in plain language.

## Follow-Up Questions

"What about that destination's public transport?" → Sage's query rewriting converts this follow-up into a standalone retrieval query, maintaining conversational coherence across multiple turns.

## Bilingual Queries

Users can switch between Spanish and English at any time. The knowledge base stores both language versions — Spanish as the primary ChromaDB document and English in metadata — and Sage selects the appropriate version based on the active language.

---

# 7. MVP Functional Scope

The MVP is fully built and operational as of June 2026. It has been implemented using Python, FastAPI, React 19, TypeScript, MUI v6, ChromaDB, rank-bm25, and the OpenAI-compatible API.

## Implemented Features

### RAG Knowledge Base

21 documents: 20 destination docs (one per destination, bilingual) + 1 suite context document. Built from the shared TUI Care Foundation CSV dataset at startup.

### Hybrid Retrieval (BM25 + Semantic + RRF)

Two retrieval signals — ChromaDB cosine similarity and BM25 keyword ranking — fused via Reciprocal Rank Fusion (k=60). Relevance threshold of 0.6 filters out irrelevant documents before passing context to the LLM.

### Query Rewriting

Follow-up questions are rewritten into standalone retrieval queries using the LLM, enabling multi-turn conversation without losing context.

### Conversation History

Last 6 messages (3 turns) are passed to the LLM on each request, maintaining coherent multi-turn dialogue.

### Streaming Responses

Token-by-token streaming via Server-Sent Events (SSE). Source documents are emitted before the LLM response begins.

### Bilingual Interface

Full Spanish/English UI with a single flag toggle in the header. Both UI strings and retrieved source documents are served in the active language.

### Dark/Light Mode

MUI v6 dark and light themes, toggled via a sun/moon icon in the header. Preference persists in localStorage.

### Feedback System

Thumbs up/down per message. Votes are appended to `data/feedback.jsonl` for TFM analysis.

## Features Outside Initial Scope

- Real-time integration with live booking systems.
- Image or multimedia responses.
- Voice input or output.
- User authentication or session management.
- Dynamic pricing recommendations.

---

# 8. Executive Summary

**Sage** is a fully operational RAG-powered AI advisor that makes the TUI Care Foundation dataset conversationally accessible. It uses hybrid BM25 + semantic retrieval fused with Reciprocal Rank Fusion, LLM-based query rewriting, and real-time token streaming to deliver grounded, bilingual answers about Spain's 20 tourism destinations.

The system operates as the fifth and final project in the TUI Care Foundation Suite, serving as its conversational interface — the layer where all suite data becomes queryable through natural language rather than dashboards or technical queries.
