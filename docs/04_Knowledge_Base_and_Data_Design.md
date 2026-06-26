# Knowledge Base and Data Design

## Sage — Document Construction and ChromaDB Integration

---

# 1. Overview

Sage's knowledge base consists of 21 documents stored in a ChromaDB persistent collection. Each document is a dense bilingual text built from the TUI Care Foundation CSV dataset at build time. Documents are not updated at runtime — they are rebuilt on demand via `POST /rebuild`.

---

# 2. Data Sources

All source data comes from the shared TUI Care Foundation dataset. Sage auto-detects data in two candidate locations:

```python
DATA_CANDIDATES = [
    BASE_DIR / "data" / "raw",                                  # local copy
    Path.home() / "Desktop" / "TUI-Smart-Destination-Recommender" / "data" / "raw",  # Horizon's folder
]
DATA_DIR = next((p for p in DATA_CANDIDATES if p.exists()), None)
```

## CSV Files Used

| File | Content | Records |
|---|---|---|
| `destinations.csv` | Destination ID, name, type, region, price level | 20 destinations |
| `sustainability_scores.csv` | Sustainability, carbon, local business, public transport scores | 20 rows |
| `congestion_scores.csv` | Monthly congestion score per destination (12 months) | 240 rows |
| `bookings_history.csv` | Booking records with ratings | ~1,000 rows |

## Open Data Origins

| Dataset | Source | Used For |
|---|---|---|
| Congestion scores | INE EOH Table 49371 (hotel occupancy by province) | Monthly congestion values per destination |
| Sustainability scores | FRONTUR Table 23988 (international arrivals by CCAA) | Sustainability enrichment |
| Destinations + bookings | Synthetic (GDPR-compliant) | Preference and popularity data |

---

# 3. Document Structure

Each document consists of three components that ChromaDB stores:

| Component | Description |
|---|---|
| `id` | Unique string identifier (e.g., `"D001"`, `"suite_context"`) |
| `text` | Spanish rich-text document (primary ChromaDB field, used for embeddings) |
| `metadata` | Structured fields + English text |

## Metadata Fields

| Field | Type | Description |
|---|---|---|
| `destination_id` | string | Same as `id` (e.g., `"D001"`) |
| `destination_name` | string | Human-readable name (e.g., `"Mallorca"`) |
| `destination_type` | string | Beach / City / Nature / Mixed |
| `region` | string | Spanish autonomous community |
| `sustainability_score` | float | Overall sustainability score (0–100) |
| `avg_congestion` | float | Average annual congestion score (0–100) |
| `text_en` | string | English version of the document (truncated to 800 chars) |

---

# 4. Destination Document Content

Each destination document is a single dense paragraph combining all available data for that destination.

## Spanish Template

```
{name} es un destino de tipo {dtype} ubicado en {region}, España.
Nivel de precio: {price}.
Sostenibilidad: {sust_score:.1f}/100 (nivel {tier}).
Puntuación de carbono: {carbon:.1f}/100.
Apoyo a negocio local: {local_biz:.1f}/100.
Puntuación de transporte público: {pub_trans:.1f}/100.
Congestión media anual: {avg:.1f}/100.
Mes de mayor congestión: {peak_month}.
[Meses con congestión elevada (>80): {overloaded_months}.]
Popularidad: {n_bookings} reservas en el dataset[, valoración media {avg_rating}/5].
En el motor de recomendación Horizon: {horizon_rules}.
```

## Embedded Horizon Rules (per destination)

The Horizon scoring rules are embedded verbatim in every document so the LLM can explain them in context:

| Condition | Spanish text |
|---|---|
| Sustainability ≥ 85 | "Horizon aplica un bonus de sostenibilidad del +5%" |
| Sustainability < 50 | "Horizon aplica una penalización de sostenibilidad del -10%" |
| Avg congestion < 40 | "la baja congestión media le otorga un bonus del +5% en Horizon" |
| Any month > 80 congestion | "la congestión supera 80 en {months}, activando la penalización de redistribución del -10% de Horizon esos meses" |
| No special rules | "sin ajustes especiales en Horizon" |

## Peak Month and Overloaded Months

```python
row_cong = monthly_cong.loc[did]                      # 12 monthly values
peak_idx = int(row_cong.idxmax())                     # month with highest congestion
peak_month = MONTH_NAMES[peak_idx - 1]                # e.g. "Agosto"
overloaded = [MONTH_NAMES[int(m)-1]                   # months where congestion > 80
              for m in row_cong[row_cong > 80].index]
```

---

# 5. Suite Context Document

In addition to the 20 destination documents, one suite context document is added:

```python
{
    "id": "suite_context",
    "text": (
        "El suite TUI Care Foundation aborda el problema del sobreturismo en España. "
        "El 85% de los turistas se concentra en el 10% de los destinos. "
        "Horizon (Reto 2) es un motor de recomendación IA que puntúa destinos con: "
        "0.45 × Preferencia + 0.25 × Sostenibilidad + 0.15 × Popularidad + 0.15 × Congestión. "
        "Reglas de negocio: sostenibilidad > 85 da un bonus del +5%; sostenibilidad < 50 aplica penalización del -10%. "
        "Congestión < 40 da un bonus del +5%; congestión > 80 aplica penalización de redistribución del -10%."
    ),
    ...
}
```

This document ensures that general questions about the suite's purpose and Horizon's scoring formula are answered accurately even when no specific destination is retrieved.

---

# 6. Bilingual Design

Documents are generated in both Spanish and English at build time in `document_builder.py`. The decision to store both languages was made because real-time translation would introduce latency and possible inaccuracies in numerical data.

| Language | Storage | Selection |
|---|---|---|
| Spanish | `text` field (ChromaDB primary, used for embeddings) | Always retrieved; used when `lang = 'es'` |
| English | `metadata.text_en` (truncated to 800 chars) | Used when `lang = 'en'` in `_doc_to_source()` |

Embeddings are computed from Spanish text only. This is acceptable because the embedding model (`all-MiniLM-L6-v2`) is multilingual and queries in English still retrieve Spanish documents with reasonable accuracy.

```python
def _doc_to_source(doc: dict, lang: str = 'es') -> SourceDocument:
    text_es = doc["text"][:300]
    text_en = str(doc["metadata"].get("text_en", ""))[:300] or text_es
    return SourceDocument(
        destination_name=doc["metadata"].get("destination_name", "Unknown"),
        text=text_en if lang == 'en' else text_es,
        relevance=round(1 - doc.get("distance", 0), 2),
    )
```

---

# 7. ChromaDB Configuration

| Parameter | Value |
|---|---|
| Client type | `PersistentClient` |
| Storage path | `data/chroma/` (gitignored, built locally) |
| Collection name | `tui_destinations` |
| Distance metric | Cosine similarity (ChromaDB default) |
| Embedding function | `sentence-transformers/all-MiniLM-L6-v2` (ChromaDB default, downloaded on first run) |
| Document count | 21 (20 destinations + 1 suite context) |

---

# 8. Knowledge Base Build Process

The knowledge base is built automatically at FastAPI startup if not present, or on demand via `POST /rebuild`.

```
build_knowledge_base(force_rebuild=False)
    │
    ├─► If not force_rebuild and collection exists with count > 0: skip
    │
    ├─► build_destination_documents()
    │       load_destinations(), load_sustainability(), load_congestion(), load_bookings()
    │       Build 21 bilingual document dicts
    │       On CSV load failure: use _fallback_documents() (1 generic document)
    │
    ├─► Delete existing collection (if force_rebuild)
    ├─► Create/get collection "tui_destinations"
    │
    ├─► collection.add(
    │       ids=[...], documents=[...], metadatas=[...]
    │   )
    │   ChromaDB computes embeddings during this call (~30s on first run)
    │
    └─► Reset BM25 index: _bm25 = None, _bm25_corpus = None
        (forces re-indexing on next query call)
```

## Fallback Documents

If the CSV data cannot be loaded (data folder not found), `_fallback_documents()` returns a single document listing all 20 destination names in both Spanish and English. This allows Sage to remain functional with degraded knowledge.

---

# 9. Sustainability Tiers

| Score Range | Spanish Label | English Label | Horizon Effect |
|---|---|---|---|
| 85–100 | Excelente | Excellent | +5% bonus |
| 70–84 | Bueno | Good | No adjustment |
| 55–69 | Moderado | Moderate | No adjustment |
| 0–54 | Deficiente | Poor | −10% penalty |
| Unknown | Desconocido | Unknown | No adjustment |

---

# 10. Data Refresh

The ChromaDB knowledge base is a static snapshot of the CSV data at build time. To refresh it after the underlying CSVs change:

```bash
# Via API
curl -X POST http://localhost:8504/rebuild

# Or programmatically
from src.rag.knowledge_base import build_knowledge_base
build_knowledge_base(force_rebuild=True)
```

The CSV data itself (congestion and sustainability scores from INE and FRONTUR) is refreshed from the source using Horizon's `fetch_open_data.py` script, then Sage's knowledge base is rebuilt.
