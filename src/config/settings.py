import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_CANDIDATES = [
    BASE_DIR / "data" / "raw",
    BASE_DIR.parent / "TUI-Smart-Destination-Recommender" / "data" / "raw",
]
DATA_DIR = next((p for p in DATA_CANDIDATES if list(p.glob("*.csv"))), DATA_CANDIDATES[0])
CHROMA_DIR = BASE_DIR / "data" / "chroma"
CHROMA_DIR.mkdir(parents=True, exist_ok=True)

COLLECTION_NAME = "tui_destinations"
RELEVANCE_THRESHOLD = 0.6  # max cosine distance; docs above this are filtered out

SUSTAINABILITY_TIERS = {
    (85, 101): "Excelente",
    (70, 85): "Bueno",
    (55, 70): "Moderado",
    (0, 55): "Deficiente",
}

MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
               "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]


def get_api_key() -> str:
    key = os.environ.get("OPENAI_API_KEY", "")
    if not key:
        raise ValueError(
            "OPENAI_API_KEY environment variable is not set. "
            "Set it in your shell: $env:OPENAI_API_KEY='sk-...'"
        )
    return key


def sustainability_tier(score: float) -> str:
    for (low, high), label in SUSTAINABILITY_TIERS.items():
        if low <= score < high:
            return label
    return "Unknown"
