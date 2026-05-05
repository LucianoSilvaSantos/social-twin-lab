from pydantic import BaseModel, Field, field_validator


class SimulationRequest(BaseModel):
    scenario_name: str = Field(min_length=1, description="Scenario name for traceability.")
    population_size: int = Field(ge=10, le=10000, description="Synthetic population size.")
    cycles: int = Field(ge=1, le=100, description="Number of simulation cycles.")

    @field_validator("scenario_name")
    @classmethod
    def validate_scenario_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("scenario_name must not be empty.")
        return normalized


class SimulationCycleResult(BaseModel):
    cycle: int = Field(ge=1)
    supporters: int = Field(ge=0)
    resistant: int = Field(ge=0)
    hesitant: int = Field(ge=0)


class SimulationFinalResult(BaseModel):
    supporters: int = Field(ge=0)
    resistant: int = Field(ge=0)
    hesitant: int = Field(ge=0)
    supporters_percentage: float = Field(ge=0, le=100)
    resistant_percentage: float = Field(ge=0, le=100)
    hesitant_percentage: float = Field(ge=0, le=100)


class SimulationInterpretation(BaseModel):
    dominant_trend: str
    social_risk: str
    polarization_level: str


class SimulationScenarioSnapshot(BaseModel):
    final_result: SimulationFinalResult
    timeline: list[SimulationCycleResult]
    interpretation: SimulationInterpretation


class SimulationResponse(BaseModel):
    scenario_name: str
    population_size: int
    cycles: int
    final_result: SimulationFinalResult
    timeline: list[SimulationCycleResult]
    interpretation: SimulationInterpretation


class PolicyInput(BaseModel):
    institutional_trust_modifier: float = Field(ge=-1.0, le=1.0)
    media_influence: float = Field(ge=0.0, le=1.0)
    religious_influence: float = Field(ge=0.0, le=1.0)
    economic_stress: float = Field(ge=0.0, le=1.0)
    policy_intensity: float = Field(ge=0.0, le=1.0)


class PolicySimulationRequest(BaseModel):
    scenario_name: str = Field(min_length=1, description="Scenario name for traceability.")
    population_size: int = Field(ge=10, le=10000, description="Synthetic population size.")
    cycles: int = Field(ge=1, le=100, description="Number of simulation cycles.")
    policy: PolicyInput

    @field_validator("scenario_name")
    @classmethod
    def validate_scenario_name_policy(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("scenario_name must not be empty.")
        return normalized


class PolicyDifference(BaseModel):
    supporters_change: int
    supporters_percentage_change: float
    resistant_change: int
    resistant_percentage_change: float
    hesitant_change: int
    hesitant_percentage_change: float
    risk_change: str
    polarization_change: str


class PolicySimulationResponse(BaseModel):
    scenario_name: str
    population_size: int
    cycles: int
    policy: PolicyInput
    base_scenario: SimulationScenarioSnapshot
    policy_scenario: SimulationScenarioSnapshot
    difference: PolicyDifference
