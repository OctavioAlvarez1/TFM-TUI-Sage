# Business Case, KPIs, and ESG Alignment

## Sage — Value Proposition and Impact Measurement

---

# 1. Business Case

## The Problem Sage Solves

The TUI Care Foundation Suite generates substantial data about Spain's 20 tourism destinations. Horizon scores them, Atlas visualises their congestion, Sentinel tracks their reputation, and Pathfinder maps sustainable transport routes to them.

But all of this intelligence is locked inside dashboards and structured tables. A tourism professional, a sustainability analyst, or a curious traveler cannot simply ask "Which destinations have excellent sustainability and low congestion in summer?" without knowing how to navigate four separate applications.

Sage converts the suite's entire knowledge base into a conversational interface — a single natural-language entry point to all of the suite's data.

## Value for TUI

### Accessibility

Non-technical stakeholders (marketing, sustainability teams, travel agents) can query destination intelligence without accessing raw data or dashboards.

### Recommendation Support

Sage complements Horizon's algorithmic recommendations with natural-language explanations of *why* a destination scores a certain way. This supports traveler trust and acceptance of alternative recommendations.

### Research Value

The feedback dataset (`feedback.jsonl`) provides a structured signal for evaluating RAG system performance over a Spanish tourism domain — a contribution to academic and applied AI research.

---

# 2. Key Performance Indicators (KPIs)

## Retrieval Quality

| KPI | Description | Target |
|---|---|---|
| Source attribution rate | % of responses with at least one retrieved source | > 90% |
| Relevance pass rate | % of queries where at least one document passes the 0.6 distance threshold | > 85% |
| Average relevance score | Mean relevance across all retrieved sources (1 − distance) | > 0.65 |

## User Satisfaction

| KPI | Description | Target |
|---|---|---|
| Positive feedback rate | Thumbs up / total rated responses | > 70% |
| Session depth | Average number of turns per session | > 2 |
| Language distribution | % of sessions in ES vs. EN | Track only |

## System Performance

| KPI | Description | Target |
|---|---|---|
| First token latency | Time from question submission to first streamed token | < 2 seconds |
| Knowledge base build time | Time to build 21-document ChromaDB collection | < 60 seconds |
| Query rewriting latency | Additional time added by rewrite_query() | < 500ms |

---

# 3. ESG Alignment

## Environmental (E)

Sage makes sustainability data conversationally accessible, lowering the barrier to understanding which destinations have low carbon footprints, support public transport, and have not reached congestion thresholds that damage local ecosystems.

By explaining Horizon's sustainability bonuses and penalties in plain language, Sage helps travelers understand the environmental rationale behind alternative destination recommendations — increasing the likelihood of sustainable choices.

## Social (S)

Sage explains Horizon's redistribution mechanism — the −10% congestion penalty applied to destinations with monthly congestion > 80. By surfacing this in natural language, Sage communicates to travelers that some destinations are actively deprioritised to protect local communities from overtourism pressure.

Bilingual design (ES/EN) ensures the tool is accessible to both Spanish domestic travelers and the international visitors who most heavily concentrate in a small number of Spanish destinations.

## Governance (G)

All responses are grounded in retrieved documents — the LLM is instructed never to invent data. Source documents are shown alongside every answer, enabling users to verify claims.

The `GET /status` endpoint provides a real-time view of system health (API key, KB status, document count), supporting operational transparency.

Feedback logging (`feedback.jsonl`) creates an auditable record of user satisfaction signals for academic and operational review.

---

# 4. ROI Framework

For a production deployment, the following benefits can be quantified:

## Demand Redistribution Support

If Sage's natural-language explanations increase traveler acceptance of Horizon's alternative recommendations by 5 percentage points, and the average redistributed booking generates equivalent revenue at a less-congested destination, the financial impact equals:

```
Bookings redirected × 5% × average booking value
```

## Agent Productivity

Travel agents using Sage to answer customer questions about destination sustainability reduce per-query research time from ~5 minutes (navigating dashboards) to < 30 seconds (conversational query).

## Sustainability Reporting

Sage reduces the time required to extract destination-level sustainability data for reporting by making it queryable in seconds vs. manual CSV analysis.

---

# 5. SDG Alignment

| Goal | Connection |
|---|---|
| SDG 8.9 | Promotes sustainable tourism that creates jobs and promotes local culture and products |
| SDG 11.4 | Supports heritage and natural environment protection through congestion-aware redistribution |
| SDG 12.b | Supports sustainable tourism monitoring through data-backed conversational access |
| SDG 17.18 | Contributes to open, bilingual data access for sustainable development planning |
