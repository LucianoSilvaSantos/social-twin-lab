from typing import Optional
from fastapi import APIRouter

from app.schemas.scenario import MockScenarioRunRequest, MockScenarioRunResponse
from app.schemas.simulation import (
    PolicySimulationRequest,
    PolicySimulationResponse,
    SimulationRequest,
    SimulationResponse,
)
from app.simulation.policy_sandbox import run_policy_simulation
from app.simulation.runner import run_simulation

router = APIRouter(tags=["api"])


@router.get("/status")
def api_status() -> dict[str, str]:
    return {
        "api": "online",
        "iteration": "ITERATION_02_POLICY_SANDBOX",
        "simulation": "policy-sandbox-enabled",
    }


@router.post("/scenarios/mock-run", response_model=MockScenarioRunResponse)
def mock_run_scenario(payload: Optional[MockScenarioRunRequest] = None) -> MockScenarioRunResponse:
    scenario_name = "Nova politica publica"
    if payload and payload.scenario_name:
        scenario_name = payload.scenario_name
    return MockScenarioRunResponse(
        scenario=scenario_name,
        adhesion=68,
        polarization="Alta",
        social_risk="Medio",
        institutional_trust=57,
        dominant_trend="Aceitacao gradual com resistencia inicial",
        tipping_point=43,
    )


@router.post("/simulations/run", response_model=SimulationResponse)
def simulation_run(payload: SimulationRequest) -> SimulationResponse:
    simulation_output = run_simulation(
        population_size=payload.population_size,
        cycles=payload.cycles,
    )

    return SimulationResponse(
        scenario_name=payload.scenario_name,
        population_size=payload.population_size,
        cycles=payload.cycles,
        final_result=simulation_output["final_result"],
        timeline=simulation_output["timeline"],
        interpretation=simulation_output["interpretation"],
    )


@router.post("/policy-simulation/run", response_model=PolicySimulationResponse)
def policy_simulation_run(payload: PolicySimulationRequest) -> PolicySimulationResponse:
    simulation_output = run_policy_simulation(
        population_size=payload.population_size,
        cycles=payload.cycles,
        policy=payload.policy.model_dump(),
    )

    return PolicySimulationResponse(
        scenario_name=payload.scenario_name,
        population_size=payload.population_size,
        cycles=payload.cycles,
        policy=payload.policy,
        base_scenario=simulation_output["base_scenario"],
        policy_scenario=simulation_output["policy_scenario"],
        difference=simulation_output["difference"],
    )
