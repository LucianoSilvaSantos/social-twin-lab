"""Policy sandbox simulation for iteration 02."""

from __future__ import annotations

from copy import deepcopy

from app.simulation.behavior import calculate_support_score, classify_agent_state
from app.simulation.population import generate_population
from app.simulation.results import interpret_results, summarize_results


def clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def apply_policy(agent: dict, policy: dict) -> dict:
    """Apply policy effects to one agent and return a new updated agent."""
    updated_agent = deepcopy(agent)
    policy_intensity = float(policy["policy_intensity"])

    updated_agent["trust_in_institutions"] = clamp(
        float(updated_agent["trust_in_institutions"])
        + (float(policy["institutional_trust_modifier"]) * policy_intensity)
    )
    updated_agent["fear_level"] = clamp(
        float(updated_agent["fear_level"]) + (float(policy["economic_stress"]) * policy_intensity)
    )
    updated_agent["openness_to_change"] = clamp(
        float(updated_agent["openness_to_change"]) + (float(policy["religious_influence"]) * 0.5)
    )
    return updated_agent


def _run_cycles(population: list[dict], cycles: int, media_influence: float = 0.0) -> dict:
    population_size = len(population)
    timeline: list[dict] = []

    for cycle in range(1, cycles + 1):
        current_supporters = sum(1 for agent in population if agent["current_state"] == "supporter")
        social_influence_factor = current_supporters / population_size
        social_influence_factor = clamp(social_influence_factor + media_influence)

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

    final_result = summarize_results(timeline)
    interpretation = interpret_results(final_result)
    return {
        "final_result": final_result,
        "timeline": timeline,
        "interpretation": interpretation,
    }


def compare_results(base_result: dict, policy_result: dict) -> dict:
    base_final = base_result["final_result"]
    policy_final = policy_result["final_result"]
    base_interpretation = base_result["interpretation"]
    policy_interpretation = policy_result["interpretation"]

    risk_change = "sem alteracao"
    if base_interpretation["social_risk"] != policy_interpretation["social_risk"]:
        risk_change = (
            f'{base_interpretation["social_risk"]} -> {policy_interpretation["social_risk"]}'
        )

    polarization_change = "sem alteracao"
    if base_interpretation["polarization_level"] != policy_interpretation["polarization_level"]:
        polarization_change = (
            f'{base_interpretation["polarization_level"]} -> '
            f'{policy_interpretation["polarization_level"]}'
        )

    return {
        "supporters_change": policy_final["supporters"] - base_final["supporters"],
        "supporters_percentage_change": round(
            policy_final["supporters_percentage"] - base_final["supporters_percentage"], 2
        ),
        "resistant_change": policy_final["resistant"] - base_final["resistant"],
        "resistant_percentage_change": round(
            policy_final["resistant_percentage"] - base_final["resistant_percentage"], 2
        ),
        "hesitant_change": policy_final["hesitant"] - base_final["hesitant"],
        "hesitant_percentage_change": round(
            policy_final["hesitant_percentage"] - base_final["hesitant_percentage"], 2
        ),
        "risk_change": risk_change,
        "polarization_change": polarization_change,
    }


def run_policy_simulation(population_size: int, cycles: int, policy: dict) -> dict:
    """Run base scenario, policy scenario and compare both results."""
    base_population = generate_population(population_size)
    policy_population = [apply_policy(agent, policy) for agent in deepcopy(base_population)]

    base_result = _run_cycles(deepcopy(base_population), cycles=cycles, media_influence=0.0)
    policy_result = _run_cycles(
        policy_population,
        cycles=cycles,
        media_influence=float(policy["media_influence"]),
    )
    difference = compare_results(base_result=base_result, policy_result=policy_result)

    return {
        "base_scenario": base_result,
        "policy_scenario": policy_result,
        "difference": difference,
    }
