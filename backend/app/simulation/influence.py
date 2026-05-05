"""Influence graph simulation for iteration 03."""

from __future__ import annotations

import random

from app.simulation.behavior import classify_agent_state
from app.simulation.results import interpret_results, summarize_results

AVERAGE_CONNECTIONS = 3


def _clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def _build_groups(population: list[dict]) -> list[dict]:
    size = len(population)
    groups_count = max(2, min(20, size // 100 + 2))
    groups = [{"id": f"group-{index + 1}", "name": f"Grupo {index + 1}", "size": 0} for index in range(groups_count)]

    for agent in population:
        group = random.choice(groups)
        group["size"] += 1
        agent["group_id"] = group["id"]

    return groups


def _leader_stance(agent: dict) -> str:
    score = (
        (agent["trust_in_institutions"] * 0.45)
        + (agent["openness_to_change"] * 0.35)
        + ((1 - agent["fear_level"]) * 0.20)
    )
    if score >= 0.62:
        return "supporter"
    if score <= 0.40:
        return "resistant"
    return "hesitant"


def generate_influence_network(population: list[dict], leaders_count: int = 5) -> dict:
    """Generate a synthetic influence network with leaders, groups and weighted edges."""
    population_size = len(population)
    leaders_count = max(1, min(leaders_count, population_size))

    groups = _build_groups(population)
    leader_agent_ids = set(random.sample([agent["id"] for agent in population], leaders_count))
    leaders: list[dict] = []

    for agent in population:
        is_leader = agent["id"] in leader_agent_ids
        agent["is_leader"] = is_leader
        if not is_leader:
            continue

        stance = _leader_stance(agent)
        influence_power = round(_clamp(0.55 + random.random() * 0.45), 2)
        leader = {
            "id": f"leader-{agent['id']}",
            "agent_id": agent["id"],
            "name": f"Lider {agent['id']}",
            "influence_power": influence_power,
            "stance": stance,
        }
        leaders.append(leader)
        agent["leader_type"] = "community_leader"
        agent["influence_power"] = influence_power
        agent["current_state"] = stance

    leader_ids = [leader["id"] for leader in leaders]
    agent_ids = [f"agent-{agent['id']}" for agent in population]

    edges: list[dict] = []
    influence_weights: dict[str, float] = {}
    incoming_edges: dict[int, list[dict]] = {agent["id"]: [] for agent in population}

    for agent in population:
        targets = set()
        connection_index = 0
        attempts = 0

        while connection_index < AVERAGE_CONNECTIONS and attempts < AVERAGE_CONNECTIONS * 10:
            attempts += 1
            weight = round(_clamp(0.2 + random.random() * 0.8), 2)

            if leader_ids and random.random() < 0.30:
                source = random.choice(leader_ids)
                source_kind = "leader"
            else:
                source_agent_id = agent["id"]
                while source_agent_id == agent["id"]:
                    source_agent_id = random.randint(1, population_size)
                source = f"agent-{source_agent_id}"
                source_kind = "agent"

            edge_key = f"{source}->{agent['id']}"
            if edge_key in targets:
                continue
            targets.add(edge_key)

            connection_index += 1
            edge_id = f"edge-{agent['id']}-{connection_index}-{len(edges) + 1}"
            edge = {
                "id": edge_id,
                "source": source,
                "target": f"agent-{agent['id']}",
                "weight": weight,
            }
            edges.append(edge)
            influence_weights[edge_id] = weight
            incoming_edges[agent["id"]].append(
                {
                    "source": source,
                    "source_kind": source_kind,
                    "weight": weight,
                }
            )

    nodes = []
    for agent in population:
        nodes.append(
            {
                "id": f"agent-{agent['id']}",
                "type": "agent",
                "state": agent["current_state"],
                "group_id": agent.get("group_id", "group-1"),
                "is_leader": bool(agent.get("is_leader", False)),
                "label": f"Agente {agent['id']}",
            }
        )

    for leader in leaders:
        nodes.append(
            {
                "id": leader["id"],
                "type": "leader",
                "state": leader["stance"],
                "group_id": "leaders",
                "is_leader": True,
                "label": leader["name"],
            }
        )

    return {
        "agents": population,
        "leaders": leaders,
        "edges": edges,
        "groups": groups,
        "influence_weights": influence_weights,
        "incoming_edges": incoming_edges,
        "nodes": nodes,
    }


def calculate_network_influence(agent: dict, network: dict, population: list[dict]) -> float:
    """Calculate local network influence in range 0.0..1.0 for one agent."""
    incoming_edges = network["incoming_edges"].get(agent["id"], [])
    if not incoming_edges:
        return 0.5

    population_index = {f"agent-{item['id']}": item for item in population}
    leader_index = {leader["id"]: leader for leader in network["leaders"]}

    supporter_weight = 0.0
    resistant_weight = 0.0
    total_weight = 0.0

    for incoming in incoming_edges:
        source = incoming["source"]
        source_kind = incoming["source_kind"]
        weight = float(incoming["weight"])

        stance = "hesitant"
        if source_kind == "leader":
            leader = leader_index.get(source)
            if leader:
                stance = leader["stance"]
                weight = weight * (1 + float(leader["influence_power"]))
        else:
            source_agent = population_index.get(source)
            if source_agent:
                stance = source_agent["current_state"]

        total_weight += weight
        if stance == "supporter":
            supporter_weight += weight
        elif stance == "resistant":
            resistant_weight += weight

    if total_weight <= 0:
        return 0.5

    local_balance = (supporter_weight - resistant_weight) / total_weight
    return _clamp((local_balance + 1) / 2)


def summarize_influence_network(network: dict) -> dict:
    """Summarize core network metrics."""
    edge_weights = [float(edge["weight"]) for edge in network["edges"]]
    average_influence = round(sum(edge_weights) / len(edge_weights), 2) if edge_weights else 0.0

    return {
        "nodes": len(network["nodes"]),
        "edges": len(network["edges"]),
        "leaders": len(network["leaders"]),
        "average_influence": average_influence,
    }


def run_influence_simulation(population_size: int, cycles: int, leaders_count: int = 5) -> dict:
    """Run cycle simulation using local network influence."""
    from app.simulation.population import generate_population

    population = generate_population(population_size)
    network = generate_influence_network(population=population, leaders_count=leaders_count)
    timeline: list[dict] = []

    for cycle in range(1, cycles + 1):
        global_supporters = sum(1 for agent in population if agent["current_state"] == "supporter")
        global_influence = global_supporters / population_size

        for agent in population:
            local_influence = calculate_network_influence(agent=agent, network=network, population=population)
            social_influence_factor = _clamp((global_influence * 0.35) + (local_influence * 0.65))
            score = (
                (agent["trust_in_institutions"] * 0.30)
                + (agent["openness_to_change"] * 0.25)
                + ((1 - agent["fear_level"]) * 0.20)
                + (social_influence_factor * agent["social_influence_sensitivity"] * 0.25)
            )
            agent["current_state"] = classify_agent_state(_clamp(score))

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
    interpretation["network_effect"] = (
        "Influencia local relevante"
        if summarize_influence_network(network)["average_influence"] >= 0.4
        else "Influencia local limitada"
    )

    return {
        "network_summary": summarize_influence_network(network),
        "final_result": final_result,
        "timeline": timeline,
        "network": {"nodes": network["nodes"], "edges": network["edges"]},
        "leaders": network["leaders"],
        "interpretation": interpretation,
    }
