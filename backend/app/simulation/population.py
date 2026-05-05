"""Synthetic population generation for the MVP simulation."""

from __future__ import annotations

import random

AGE_GROUPS = ("young", "adult", "senior")


def generate_population(size: int) -> list[dict]:
    """Generate a synthetic population with basic behavioral attributes."""
    if size <= 0:
        raise ValueError("population size must be greater than zero")

    population: list[dict] = []
    for index in range(size):
        population.append(
            {
                "id": index + 1,
                "age_group": random.choice(AGE_GROUPS),
                "trust_in_institutions": random.random(),
                "fear_level": random.random(),
                "openness_to_change": random.random(),
                "social_influence_sensitivity": random.random(),
                "current_state": "hesitant",
            }
        )
    return population
