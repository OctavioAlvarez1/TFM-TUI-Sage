# Project Context

## TUI Care Foundation Future Shapers Spain — Reto 5

---

# 1. Programme Context

The TUI Care Foundation Future Shapers Spain programme is a university challenge for UCM (Universidad Complutense de Madrid) students, running in the 2025–2026 academic year as part of the TFM (Trabajo Fin de Máster).

The programme challenges students to address Spain's overtourism problem using data science, artificial intelligence, and software engineering — delivering a suite of five interconnected projects, each corresponding to a separate Reto (challenge).

---

# 2. The Overtourism Problem

Spain receives approximately 96.8 million international tourists per year, generating an estimated €134.7 billion in economic activity. However, this demand is severely concentrated:

- **85% of tourists** visit only **10% of destinations**
- Barcelona, Mallorca, Ibiza, Tenerife, and the Costa del Sol absorb most of the pressure
- Secondary destinations — Picos de Europa, Sierra Nevada, Menorca, Asturias — remain systematically underutilised

Consequences include deteriorating ecosystems, rising housing costs, social rejection of mass tourism, and long-term damage to the tourism sector's sustainability.

---

# 3. The Five Retos (Challenges)

| Reto | Project | Name | Role |
|---|---|---|---|
| 1 | TUI-Sentinel | Sentinel | Sentiment and reputation monitoring for tourist destinations |
| 2 | TUI-Smart-Destination-Recommender | Horizon | AI recommendation engine for sustainable demand redistribution |
| 3 | TUI-Atlas | Atlas | Geospatial congestion and sustainability dashboard |
| 4 | TUI-Pathfinder | Pathfinder | Sustainable mobility and accessibility mapping |
| **5** | **TUI-Sage** | **Sage** | **RAG-powered AI advisor — natural language interface to all suite data** |

---

# 4. Reto 5 — Sage

Sage is the fifth and final project. Its challenge was to build a conversational AI system that makes the entire TUI Care Foundation dataset queryable through natural language.

Unlike the other four projects, which each address a specific analytical problem (sentiment, recommendations, geography, mobility), Sage's role is integrative: it is the conversational layer that sits on top of all other projects' data.

## Specific Technical Challenge

- Build a RAG pipeline that grounds LLM responses in real CSV data from the suite
- Implement hybrid retrieval (semantic + keyword) that outperforms either signal alone
- Design a bilingual knowledge base that serves both Spanish and English users without per-query translation overhead
- Stream responses token by token for a real-time chat experience
- Maintain conversational coherence across multiple turns using query rewriting

---

# 5. Shared Dataset

All five projects use the same underlying dataset, originally created and maintained by Horizon (Reto 2).

**Primary data location:**
```
Desktop/TUI-Smart-Destination-Recommender/data/raw/
```

Sage auto-detects this location at startup:

```python
DATA_CANDIDATES = [
    BASE_DIR / "data" / "raw",
    Path.home() / "Desktop" / "TUI-Smart-Destination-Recommender" / "data" / "raw",
]
```

### Dataset Files

| File | Content | Source |
|---|---|---|
| `destinations.csv` | 20 destinations with type, region, price level | Synthetic (GDPR-compliant) |
| `sustainability_scores.csv` | Carbon, local business, transport, overall sustainability scores | FRONTUR Table 23988 |
| `congestion_scores.csv` | 12 monthly congestion values per destination (240 rows) | INE EOH Table 49371 |
| `bookings_history.csv` | ~1,000 booking records with ratings | Synthetic (GDPR-compliant) |

### The 20 Monitored Destinations

| ID | Destination | Region | Type |
|---|---|---|---|
| D001 | Mallorca | Balearic Islands | Beach |
| D002 | Ibiza | Balearic Islands | Beach |
| D003 | Menorca | Balearic Islands | Beach |
| D004 | Tenerife | Canary Islands | Mixed |
| D005 | Gran Canaria | Canary Islands | Mixed |
| D006 | Lanzarote | Canary Islands | Nature |
| D007 | Costa del Sol | Andalusia | Beach |
| D008 | Marbella | Andalusia | Beach |
| D009 | Malaga | Andalusia | City |
| D010 | Valencia | Valencian Community | City |
| D011 | Alicante | Valencian Community | Beach |
| D012 | Benidorm | Valencian Community | Beach |
| D013 | Barcelona | Catalonia | City |
| D014 | Madrid | Community of Madrid | City |
| D015 | Seville | Andalusia | City |
| D016 | Granada | Andalusia | City |
| D017 | Bilbao | Basque Country | City |
| D018 | San Sebastián | Basque Country | Mixed |
| D019 | Picos de Europa | Asturias | Nature |
| D020 | Sierra Nevada | Andalusia | Nature |

Destinations D019 (Picos de Europa) and D020 (Sierra Nevada) are Horizon's primary redistribution targets — low congestion year-round, high sustainability, currently underutilised.

---

# 6. Horizon Scoring Rules (Embedded in Sage's Knowledge Base)

Sage's documents encode Horizon's scoring formula and business rules so they can be explained conversationally:

**Formula:**
```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```

**Business Rules (multiplicative adjustments):**

| Condition | Effect | Spanish Text in Documents |
|---|---|---|
| Sustainability ≥ 85 | +5% bonus | "Horizon aplica un bonus de sostenibilidad del +5%" |
| Sustainability < 50 | −10% penalty | "Horizon aplica una penalización de sostenibilidad del -10%" |
| Avg congestion < 40 | +5% bonus | "la baja congestión media le otorga un bonus del +5% en Horizon" |
| Any month > 80 congestion | −10% redistribution penalty | "la congestión supera 80 en {months}, activando la penalización del -10% de Horizon" |

---

# 7. System Status (as of June 2026)

| Component | Status | Notes |
|---|---|---|
| FastAPI backend | ✅ Complete | All 6 endpoints operational |
| ChromaDB knowledge base | ✅ Complete | 21 bilingual documents |
| BM25 + Semantic hybrid retrieval | ✅ Complete | RRF fusion, 0.6 threshold |
| Query rewriting | ✅ Complete | LLM-based, multi-turn coherence |
| Conversation history | ✅ Complete | Last 6 messages passed to LLM |
| SSE streaming | ✅ Complete | Token-by-token, source events |
| React frontend | ✅ Complete | Single-page, 5 sections |
| Dark/light mode | ✅ Complete | MUI v6, localStorage |
| ES/EN bilingual UI | ✅ Complete | All strings translated |
| Bilingual knowledge base | ✅ Complete | Spanish primary, English in metadata |
| Feedback logging | ✅ Complete | feedback.jsonl |
| Docker deployment | ✅ Complete | Dockerfile + docker-compose.yml, nginx reverse proxy |

---

# 8. Desktop Layout

All five projects must be placed on the same Desktop for automatic data detection:

```
Desktop/
├── TUI-Smart-Destination-Recommender/   ← Reto 2 (primary data source + API + React UI)
│   └── data/raw/                        ← shared CSVs (Sage auto-detects this)
├── TUI-Atlas/                           ← Reto 3 (port 8501)
├── TUI-Sentinel/                        ← Reto 1 (port 8502)
├── TUI-Pathfinder/                      ← Reto 4 (port 8503)
└── TUI-Sage/                            ← Reto 5 (ports 8504 / 5174)
```

---

# 9. Required Environment Variables

| Variable | Project | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | TUI-Sage | OpenAI-compatible API key for LLM inference |
| `AEMET_API_KEY` | Horizon, Atlas | AEMET climate data (optional, for open data refresh) |

`OPENAI_API_KEY` is the only environment variable required to run Sage. It must be set before starting the backend — it is read once at startup and validated by `GET /status`.
