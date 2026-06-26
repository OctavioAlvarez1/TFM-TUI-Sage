"""Converts destination CSV data into rich-text documents for the RAG knowledge base."""
import pandas as pd
from src.config.settings import MONTH_NAMES, sustainability_tier
from src.data.data_loader import load_destinations, load_sustainability, load_congestion, load_bookings

MONTH_NAMES_EN = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"]

TIER_EN = {
    "Excelente": "Excellent", "Bueno": "Good",
    "Moderado": "Moderate", "Deficiente": "Poor", "Desconocido": "Unknown",
}


def build_destination_documents() -> list[dict]:
    """Return a list of {id, text, metadata} dicts — one per destination."""
    try:
        dest = load_destinations()
        sust = load_sustainability()
        cong = load_congestion()
        bookings = load_bookings()
    except Exception:
        return _fallback_documents()

    avg_cong = cong.groupby("destination_id")["congestion_score"].mean().round(1)
    monthly_cong = cong.pivot_table(index="destination_id", columns="month", values="congestion_score")
    booking_counts = bookings.groupby("destination_id").size()

    docs = []
    for _, row in dest.iterrows():
        did = row["destination_id"]
        name = row.get("destination_name", f"Destino {did}")
        dtype = row.get("destination_type", "")
        region = row.get("region", "")
        price = row.get("price_level", "")

        sust_row = sust[sust["destination_id"] == did]
        if not sust_row.empty:
            sust_score = float(sust_row.iloc[0].get("sustainability_score", 0))
            carbon = float(sust_row.iloc[0].get("carbon_score", 0))
            local_biz = float(sust_row.iloc[0].get("local_business_score", 0))
            pub_trans = float(sust_row.iloc[0].get("public_transport_score", 0))
            tier = sustainability_tier(sust_score)
        else:
            sust_score = carbon = local_biz = pub_trans = 0.0
            tier = "Desconocido"

        tier_en = TIER_EN.get(tier, "Unknown")

        avg = float(avg_cong.get(did, 0))
        peak_month_es = peak_month_en = ""
        overloaded_es = overloaded_en = []
        if did in monthly_cong.index:
            row_cong = monthly_cong.loc[did]
            peak_idx = int(row_cong.idxmax())
            peak_month_es = MONTH_NAMES[peak_idx - 1]
            peak_month_en = MONTH_NAMES_EN[peak_idx - 1]
            overloaded_es = [MONTH_NAMES[int(m) - 1] for m in row_cong[row_cong > 80].index]
            overloaded_en = [MONTH_NAMES_EN[int(m) - 1] for m in row_cong[row_cong > 80].index]

        n_bookings = int(booking_counts.get(did, 0))
        avg_rating = 0.0
        if "rating" in bookings.columns:
            dest_bookings = bookings[bookings["destination_id"] == did]
            if not dest_bookings.empty:
                avg_rating = round(float(dest_bookings["rating"].mean()), 1)

        # — Spanish text —
        horizon_es = []
        if sust_score >= 85:
            horizon_es.append("Horizon aplica un bonus de sostenibilidad del +5%")
        elif sust_score < 50:
            horizon_es.append("Horizon aplica una penalización de sostenibilidad del -10%")
        if avg < 40:
            horizon_es.append("la baja congestión media le otorga un bonus del +5% en Horizon")
        if overloaded_es:
            horizon_es.append(
                f"la congestión supera 80 en {', '.join(overloaded_es)}, "
                "activando la penalización de redistribución del -10% de Horizon esos meses"
            )
        horizon_str_es = "; ".join(horizon_es) if horizon_es else "sin ajustes especiales en Horizon"

        text_es = (
            f"{name} es un destino de tipo {dtype} ubicado en {region}, España. "
            f"Nivel de precio: {price}. "
            f"Sostenibilidad: {sust_score:.1f}/100 (nivel {tier}). "
            f"Puntuación de carbono: {carbon:.1f}/100. "
            f"Apoyo a negocio local: {local_biz:.1f}/100. "
            f"Puntuación de transporte público: {pub_trans:.1f}/100. "
            f"Congestión media anual: {avg:.1f}/100. "
            f"Mes de mayor congestión: {peak_month_es}. "
        )
        if overloaded_es:
            text_es += f"Meses con congestión elevada (>80): {', '.join(overloaded_es)}. "
        else:
            text_es += "Ningún mes supera congestión 80 — flujo de visitantes bien distribuido. "
        text_es += (
            f"Popularidad: {n_bookings} reservas en el dataset"
            + (f", valoración media {avg_rating}/5" if avg_rating else "") + ". "
            f"En el motor de recomendación Horizon: {horizon_str_es}."
        )

        # — English text —
        horizon_en = []
        if sust_score >= 85:
            horizon_en.append("Horizon applies a +5% sustainability bonus")
        elif sust_score < 50:
            horizon_en.append("Horizon applies a -10% sustainability penalty")
        if avg < 40:
            horizon_en.append("low average congestion gives a +5% congestion bonus in Horizon")
        if overloaded_en:
            horizon_en.append(
                f"congestion exceeds 80 in {', '.join(overloaded_en)}, "
                "triggering Horizon's -10% redistribution penalty those months"
            )
        horizon_str_en = "; ".join(horizon_en) if horizon_en else "no special Horizon adjustments"

        text_en = (
            f"{name} is a {dtype} destination located in {region}, Spain. "
            f"Price level: {price}. "
            f"Sustainability: {sust_score:.1f}/100 ({tier_en} level). "
            f"Carbon score: {carbon:.1f}/100. "
            f"Local business support: {local_biz:.1f}/100. "
            f"Public transport score: {pub_trans:.1f}/100. "
            f"Average annual congestion: {avg:.1f}/100. "
            f"Peak congestion month: {peak_month_en}. "
        )
        if overloaded_en:
            text_en += f"Overloaded months (congestion > 80): {', '.join(overloaded_en)}. "
        else:
            text_en += "No months with congestion above 80 — well-distributed visitor flow. "
        text_en += (
            f"Booking popularity: {n_bookings} bookings in dataset"
            + (f", average rating {avg_rating}/5" if avg_rating else "") + ". "
            f"Horizon recommendation engine: {horizon_str_en}."
        )

        docs.append({
            "id": str(did),
            "text": text_es,
            "metadata": {
                "destination_id": str(did),
                "destination_name": name,
                "destination_type": dtype,
                "region": region,
                "sustainability_score": sust_score,
                "avg_congestion": avg,
                "text_en": text_en[:800],
            },
        })

    docs.append({
        "id": "suite_context",
        "text": (
            "El suite TUI Care Foundation aborda el problema del sobreturismo en España. "
            "El 85% de los turistas se concentra en el 10% de los destinos. "
            "Horizon (Reto 2) es un motor de recomendación IA que puntúa destinos con: "
            "0.45 × Preferencia + 0.25 × Sostenibilidad + 0.15 × Popularidad + 0.15 × Congestión. "
            "Reglas de negocio: sostenibilidad > 85 da un bonus del +5%; sostenibilidad < 50 aplica penalización del -10%. "
            "Congestión < 40 da un bonus del +5%; congestión > 80 aplica penalización de redistribución del -10%."
        ),
        "metadata": {
            "destination_id": "suite",
            "destination_name": "Suite Context",
            "destination_type": "context",
            "region": "Spain",
            "sustainability_score": 0.0,
            "avg_congestion": 0.0,
            "text_en": (
                "The TUI Care Foundation suite addresses Spain's over-tourism problem. "
                "85% of tourists concentrate in 10% of destinations. "
                "Horizon (Challenge 2) is an AI recommendation engine scoring destinations: "
                "0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion. "
                "Rules: sustainability > 85 gives +5% bonus; sustainability < 50 gives -10% penalty. "
                "Congestion < 40 gives +5% bonus; congestion > 80 gives -10% redistribution penalty."
            )[:800],
        },
    })

    return docs


def _fallback_documents() -> list[dict]:
    text_es = (
        "El suite TUI Care Foundation cubre 20 destinos españoles incluyendo "
        "Barcelona, Madrid, Sevilla, Granada, Valencia, Bilbao, San Sebastián, Málaga, "
        "Palma de Mallorca, Las Palmas, Tenerife, Córdoba, Toledo, Salamanca, Zaragoza, "
        "Alicante, Cádiz, Santander, Pamplona y Murcia. "
        "Los archivos de datos no están disponibles actualmente."
    )
    text_en = (
        "The TUI Care Foundation suite covers 20 Spanish destinations including "
        "Barcelona, Madrid, Seville, Granada, Valencia, Bilbao, San Sebastian, Malaga, "
        "Palma de Mallorca, Las Palmas, Tenerife, Cordoba, Toledo, Salamanca, Zaragoza, "
        "Alicante, Cadiz, Santander, Pamplona, and Murcia. "
        "Data files are not currently available."
    )
    return [{
        "id": "fallback",
        "text": text_es,
        "metadata": {
            "destination_id": "fallback",
            "destination_name": "Fallback",
            "destination_type": "fallback",
            "region": "Spain",
            "sustainability_score": 0.0,
            "avg_congestion": 0.0,
            "text_en": text_en,
        },
    }]
