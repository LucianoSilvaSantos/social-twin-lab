from typing import Optional
from pydantic import BaseModel, Field


class MockScenarioRunRequest(BaseModel):
    scenario_name: Optional[str] = Field(
        default=None,
        description="Optional scenario name used in mock response.",
    )


class MockScenarioRunResponse(BaseModel):
    scenario: str
    adhesion: int
    polarization: str
    social_risk: str
    institutional_trust: int
    dominant_trend: str
    tipping_point: int
