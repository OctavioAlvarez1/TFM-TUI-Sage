"""Converts destination CSV data into rich-text documents for the RAG knowledge base."""
import pandas as pd
from src.config.settings import MONTH_NAMES, sustainability_tier
from src.data.data_loader import load_destinations, load_sustainability, load_congestion, load_bookings


def build_destination_documents() -> list[dict]:
    """Return a list of {id, text, metadata} dicts — one per destination."""
    try:
        dest = load_destinations()
        sust = load_sustainability()
        cong = load_congestion()
        bookings = load_bookings()
    except Exception as e:
        return _fallback_documents()

    # Average congestion per destination
    avg_cong = cong.groupby("destination_id")["congestion_score"].mean().round(1)
    monthly_cong = cong.pivot_table(index="destination_id", columns="month", values="congestion_score")

    # Booking stats per destination
    booking_counts = bookings.groupby("destination_id").size()

    docs = []
    for _, row in dest.iterrows():
        did = row["destination_id"]
        name = row.get("destination_name", f"Destination {did}")
        dtype = row.get("destination_type", "")
        region = row.get("region", "")
        price = row.get("price_level", "")

        # Sustainability info
        sust_row = sust[sust["destination_id"] == did]
        if not sust_row.empty:
            sust_score = float(sust_row.iloc[0].get("sustainability_score", 0))
            carbon = float(sust_row.iloc[0].get("carbon_score", 0))
            local_biz = float(sust_row.iloc[0].get("local_business_score", 0))
            pub_trans = float(sust_row.iloc[0].get("public_transport_score", 0))
            tier = sustainability_tier(sust_score)
        else:
            sust_score = carbon = local_biz = pub_trans = 0
            tier = "Unknown"

        # Congestion info
        avg = float(avg_cong.get(did, 0))
        peak_month = ""
        overloaded_months = []
        if did in monthly_cong.index:
            row_cong = monthly_cong.loc[did]
            peak_idx = int(row_cong.idxmax())
            peak_month = MONTH_NAMES[peak_idx - 1]
            overloaded_months = [MONTH_NAMES[int(m) - 1] for m in row_cong[row_cong > 80].index]

        # Booking popularity
        n_bookings = int(booking_counts.get(did, 0))
        avg_rating = 0
        if "rating" in bookings.columns:
            dest_bookings = bookings[bookings["destination_id"] == did]
            if not dest_bookings.empty:
                avg_rating = round(float(dest_bookings["rating"].mean()), 1)

        # Horizon scoring implications
        horizon_notes = []
        if sust_score >= 85:
            horizon_notes.append("Horizon applies a +5% sustainability bonus")
        elif sust_score < 50:
            horizon_notes.append("Horizon applies a -10% sustainability penalty")
        if avg < 40:
            horizon_notes.append("low average congestion means Horizon gives a +5% congestion bonus")
        if overloaded_months:
            horizon_notes.append(
                f"congestion exceeds 80 in {', '.join(overloaded_months)}, "
                "triggering Horizon's -10% redistribution penalty those months"
            )

        horizon_str = "; ".join(horizon_notes) if horizon_notes else "no special Horizon adjustments"

        text = (
            f"{name} is a {dtype} destination located in {region}, Spain. "
            f"Price level: {price}. "
            f"Sustainability: {sust_score:.1f}/100 ({tier} tier). "
            f"Carbon score: {carbon:.1f}/100. "
            f"Local business support: {local_biz:.1f}/100. "
            f"Public transport score: {pub_trans:.1f}/100. "
            f"Average annual congestion: {avg:.1f}/100. "
            f"Peak congestion month: {peak_month}. "
        )
        if overloaded_months:
            text += f"Overloaded months (congestion > 80): {', '.join(overloaded_months)}. "
        else:
            text += "No months with congestion above 80 — well-distributed visitor flow. "
        text += (
            f"Booking popularity: {n_bookings} bookings in dataset"
            + (f", average rating {avg_rating}/5" if avg_rating else "") + ". "
            f"In Horizon's AI recommendation engine: {horizon_str}."
        )

        docs.append({
            "id": str(did),
            "text": text,
            "metadata": {
                "destination_id": int(did),
                "destination_name": name,
                "destination_type": dtype,
                "region": region,
                "sustainability_score": sust_score,
                "avg_congestion": avg,
            },
        })

    # Add a global context document
    docs.append({
        "id": "suite_context",
        "text": (
            "The TUI Care Foundation Suite addresses Spain's over-tourism problem. "
            "85% of Spain's tourists concentrate in 10% of destinations. "
            "Horizon (Reto 2) is an AI recommendation engine that scores destinations using: "
            "0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion. "
            "Business rules: sustainability > 85 gives +5% boost; sustainability < 50 gives -10% penalty. "
            "Congestion < 40 gives +5% bonus; congestion > 80 gives -10% redistribution penalty. "
            "Atlas (Reto 3) visualises congestion geographically. "
            "Sentinel (Reto 1) monitors tourist sentiment. "
            "Pathfinder (Reto 4) maps sustainable transport access. "
            "Sage (Reto 5, this project) answers questions using RAG over all suite data."
        ),
        "metadata": {"destination_id": -1, "destination_name": "Suite Context", "destination_type": "context", "region": "Spain", "sustainability_score": 0, "avg_congestion": 0},
    })

    return docs


def _fallback_documents() -> list[dict]:
    """Minimal hardcoded documents when CSVs are not available."""
    return [{
        "id": "fallback",
        "text": (
            "The TUI Care Foundation Suite covers 20 Spanish destinations including "
            "Barcelona, Madrid, Seville, Granada, Valencia, Bilbao, San Sebastian, Malaga, "
            "Palma de Mallorca, Las Palmas, Tenerife, Cordoba, Toledo, Salamanca, Zaragoza, "
            "Alicante, Cadiz, Santander, Pamplona, and Murcia. "
            "Data files are not currently available — please set up the data directory."
        ),
        "metadata": {"destination_id": 0, "destination_name": "Fallback", "destination_type": "fallback", "region": "Spain", "sustainability_score": 0, "avg_congestion": 0},
    }]
