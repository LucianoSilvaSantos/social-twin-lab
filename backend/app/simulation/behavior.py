"""Agent behavior rules for the MVP simulation."""

from __future__ import annotations


def calculate_support_score(agent: dict, social_influence_factor: float) -> float:
    """Calculate the agent support score for the current cycle."""
    score = (
        (agent["trust_in_institutions"] * 0.35)
        + (agent["openness_to_change"] * 0.35)
        + ((1 - agent["fear_level"]) * 0.20)
        + (social_influence_factor * agent["social_influence_sensitivity"] * 0.10)
    )
    return max(0.0, min(1.0, score))


def classify_agent_state(score: float) -> str:
    """Classify an agent as supporter, resistant or hesitant."""
    if score >= 0.60:
        return "supporter"
    if score <= 0.40:
        return "resistant"
    return "hesitant"
