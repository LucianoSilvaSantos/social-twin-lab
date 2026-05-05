"""Simulation runner for cycle-based collective behavior."""

from __future__ import annotations

import json
import logging

from app.simulation.behavior import calculate_support_score, classify_agent_state
from app.simulation.population import generate_population
from app.simulation.results import interpret_results, summarize_results

logger = logging.getLogger("app.simulation.runner")


def _log_event(event: str, **fields: object) -> None:
    payload = {"event": event, **fields}
    logger.info(json.dumps(payload, ensure_ascii=True, sort_keys=True))


def run_simulation(population_size: int, cycles: int) -> dict:
    """Run the MVP simulation and return timeline, final result and interpretation."""
    _log_event("simulation_started", population_size=population_size, cycles=cycles)
    population = generate_population(population_size)
    timeline: list[dict] = []

    for cycle in range(1, cycles + 1):
        current_supporters = sum(1 for agent in population if agent["current_state"] == "supporter")
        social_influence_factor = current_supporters / population_size

        for agent in population:
            score = calculate_support_score(agent, social_influence_factor)
            agent["current_state"] = classify_agent_state(score)

        supporters = sum(1 for agent in population if agent["current_state"] == "supporter")
        resistant = sum(1 for agent in population if agent["current_state"] == "resistant")
        hesitant = population_size - supporters - resistant

        timeline.append(
            {
                "cycle": cycle,
                "supporters": supporters,
                "resistant": resistant,
                "hesitant": hesitant,
            }
        )
        _log_event(
            "simulation_cycle_completed",
            cycle=cycle,
            social_influence_factor=round(social_influence_factor, 4),
            supporters=supporters,
            resistant=resistant,
            hesitant=hesitant,
        )

    final_result = summarize_results(timeline)
    interpretation = interpret_results(final_result)
    _log_event(
        "simulation_completed",
        population_size=population_size,
        cycles=cycles,
        final_result=final_result,
        interpretation=interpretation,
    )

    return {
        "final_result": final_result,
        "timeline": timeline,
        "interpretation": interpretation,
    }
