export type SimulationRequest = {
  scenario_name: string;
  population_size: number;
  cycles: number;
};

export type SimulationCycleResult = {
  cycle: number;
  supporters: number;
  resistant: number;
  hesitant: number;
};

export type SimulationFinalResult = {
  supporters: number;
  resistant: number;
  hesitant: number;
  supporters_percentage: number;
  resistant_percentage: number;
  hesitant_percentage: number;
};

export type SimulationInterpretation = {
  dominant_trend: string;
  social_risk: string;
  polarization_level: string;
};

export type SimulationScenarioSnapshot = {
  final_result: SimulationFinalResult;
  timeline: SimulationCycleResult[];
  interpretation: SimulationInterpretation;
};

export type SimulationResponse = {
  scenario_name: string;
  population_size: number;
  cycles: number;
  final_result: SimulationFinalResult;
  timeline: SimulationCycleResult[];
  interpretation: SimulationInterpretation;
};

export type PolicyInput = {
  institutional_trust_modifier: number;
  media_influence: number;
  religious_influence: number;
  economic_stress: number;
  policy_intensity: number;
};

export type PolicySimulationRequest = {
  scenario_name: string;
  population_size: number;
  cycles: number;
  policy: PolicyInput;
};

export type PolicyDifference = {
  supporters_change: number;
  supporters_percentage_change: number;
  resistant_change: number;
  resistant_percentage_change: number;
  hesitant_change: number;
  hesitant_percentage_change: number;
  risk_change: string;
  polarization_change: string;
};

export type PolicySimulationResponse = {
  scenario_name: string;
  population_size: number;
  cycles: number;
  policy: PolicyInput;
  base_scenario: SimulationScenarioSnapshot;
  policy_scenario: SimulationScenarioSnapshot;
  difference: PolicyDifference;
};

export type InfluenceSimulationRequest = {
  scenario_name: string;
  population_size: number;
  cycles: number;
  leaders_count: number;
};

export type InfluenceNetworkSummary = {
  nodes: number;
  edges: number;
  leaders: number;
  average_influence: number;
};

export type InfluenceGraphNode = {
  id: string;
  type: string;
  state: 'supporter' | 'resistant' | 'hesitant';
  group_id: string;
  is_leader: boolean;
  label: string;
};

export type InfluenceGraphEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
};

export type InfluenceLeader = {
  id: string;
  name: string;
  influence_power: number;
  stance: 'supporter' | 'resistant' | 'hesitant';
};

export type InfluenceSimulationResponse = {
  scenario_name: string;
  population_size: number;
  cycles: number;
  leaders_count: number;
  network_summary: InfluenceNetworkSummary;
  final_result: SimulationFinalResult;
  timeline: SimulationCycleResult[];
  network: {
    nodes: InfluenceGraphNode[];
    edges: InfluenceGraphEdge[];
  };
  leaders: InfluenceLeader[];
  interpretation: SimulationInterpretation & {
    network_effect: string;
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export async function runSimulation(payload: SimulationRequest): Promise<SimulationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/simulations/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'Nao foi possivel executar a simulacao.');
  }

  return response.json() as Promise<SimulationResponse>;
}

export async function runPolicySimulation(
  payload: PolicySimulationRequest,
): Promise<PolicySimulationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/policy-simulation/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'Nao foi possivel executar a simulacao de politica.');
  }

  return response.json() as Promise<PolicySimulationResponse>;
}

export async function runInfluenceSimulation(
  payload: InfluenceSimulationRequest,
): Promise<InfluenceSimulationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/influence-simulation/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'Nao foi possivel executar a simulacao de influencia.');
  }

  return response.json() as Promise<InfluenceSimulationResponse>;
}
