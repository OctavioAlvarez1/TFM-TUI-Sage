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

SUSTAINABILITY_TIERS = {
    (85, 101): "Excellent",
    (70, 85): "Good",
    (55, 70): "Moderate",
    (0, 55): "Poor",
}

MONTH_NAMES = ["January","February","March","April","May","June",
               "July","August","September","October","November","December"]


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
