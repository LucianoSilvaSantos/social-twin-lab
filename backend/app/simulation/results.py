"""Simulation result aggregation and interpretation."""

from __future__ import annotations


def summarize_results(cycle_results: list[dict]) -> dict:
    """Summarize the final simulation result."""
    if not cycle_results:
        return {
            "supporters": 0,
            "resistant": 0,
            "hesitant": 0,
            "supporters_percentage": 0.0,
            "resistant_percentage": 0.0,
            "hesitant_percentage": 0.0,
        }

    last_cycle = cycle_results[-1]
    supporters = int(last_cycle["supporters"])
    resistant = int(last_cycle["resistant"])
    hesitant = int(last_cycle["hesitant"])
    population_size = supporters + resistant + hesitant

    if population_size == 0:
        return {
            "supporters": 0,
            "resistant": 0,
            "hesitant": 0,
            "supporters_percentage": 0.0,
            "resistant_percentage": 0.0,
            "hesitant_percentage": 0.0,
        }

    supporters_percentage = round((supporters / population_size) * 100, 2)
    resistant_percentage = round((resistant / population_size) * 100, 2)
    hesitant_percentage = round(100 - supporters_percentage - resistant_percentage, 2)

    if abs(hesitant_percentage) <= 0.01:
        hesitant_percentage = 0.0

    return {
        "supporters": supporters,
        "resistant": resistant,
        "hesitant": hesitant,
        "supporters_percentage": supporters_percentage,
        "resistant_percentage": resistant_percentage,
        "hesitant_percentage": hesitant_percentage,
    }


def interpret_results(final_result: dict) -> dict:
    """Generate a simple interpretation for the final simulation result."""
    supporters_percentage = float(final_result["supporters_percentage"])
    resistant_percentage = float(final_result["resistant_percentage"])
    hesitant_percentage = float(final_result["hesitant_percentage"])

    difference = abs(supporters_percentage - resistant_percentage)

    if hesitant_percentage >= 30:
        dominant_trend = "Hesitacao elevada"
    elif difference <= 15:
        dominant_trend = "Populacao dividida"
    elif supporters_percentage >= 60:
        dominant_trend = "Adesao majoritaria"
    elif resistant_percentage >= 50:
        dominant_trend = "Resistencia majoritaria"
    else:
        dominant_trend = "Tendencia indefinida"

    if resistant_percentage >= 45:
        social_risk = "Alto"
    elif resistant_percentage >= 25:
        social_risk = "Medio"
    else:
        social_risk = "Baixo"

    if supporters_percentage >= 40 and resistant_percentage >= 40:
        polarization_level = "Alto"
    elif difference <= 20:
        polarization_level = "Moderado"
    else:
        polarization_level = "Baixo"

    return {
        "dominant_trend": dominant_trend,
        "social_risk": social_risk,
        "polarization_level": polarization_level,
    }
