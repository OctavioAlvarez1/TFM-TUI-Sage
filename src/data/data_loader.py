import pandas as pd
from src.config.settings import DATA_DIR


def load_destinations() -> pd.DataFrame:
    return pd.read_csv(DATA_DIR / "destinations.csv")


def load_sustainability() -> pd.DataFrame:
    return pd.read_csv(DATA_DIR / "sustainability_scores.csv")


def load_congestion() -> pd.DataFrame:
    return pd.read_csv(DATA_DIR / "congestion_scores.csv")


def load_bookings() -> pd.DataFrame:
    return pd.read_csv(DATA_DIR / "bookings_history.csv")
