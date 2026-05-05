# ITERATION 02 — POLICY SANDBOX

## Nome da Iteração

Policy Sandbox

---

## Objetivo

Permitir ao usuário testar cenários de políticas públicas e observar impactos na simulação.

Esta iteração transforma o sistema em um laboratório de decisão, permitindo comparar o comportamento social antes e depois de uma intervenção.

---

## Contexto

Na Iteration 01, foi implementado o primeiro MVP funcional de simulação, contendo:

- geração de população sintética;
- simulação por ciclos;
- regras básicas de comportamento;
- endpoint `POST /api/simulations/run`;
- visualização de resultados no frontend;
- cards, gráfico temporal e tabela de ciclos.

Agora o sistema deve evoluir para permitir intervenções externas, chamadas aqui de políticas, e comparar os resultados entre cenário base e cenário com política aplicada.

---

## Conceito

O usuário poderá alterar variáveis de contexto e observar como isso afeta:

- adesão (`supporters`);
- resistência (`resistant`);
- hesitação (`hesitant`);
- risco social;
- polarização;
- tendência dominante.

O sistema deve continuar deixando claro que trabalha com cenários simulados e tendências possíveis, não previsões determinísticas.

---

## Exemplos de casos de uso

A estrutura deve permitir simular, de forma inicial e abstrata:

- implantação de uma UPA;
- aumento de policiamento em um bairro;
- construção de viaduto ou ponte;
- campanha pública de vacinação;
- influência religiosa ou comunitária em uma política;
- aumento ou redução de confiança institucional.

---

## Variáveis de política

Adicionar ao modelo de simulação as seguintes variáveis:

```text
institutional_trust_modifier (float: -1.0 a +1.0)
media_influence (float: 0.0 a 1.0)
religious_influence (float: 0.0 a 1.0)
economic_stress (float: 0.0 a 1.0)
policy_intensity (float: 0.0 a 1.0)
```

### Significado das variáveis

- `institutional_trust_modifier`: altera a confiança institucional percebida pelos agentes.
- `media_influence`: representa força de comunicação, mídia e campanhas públicas.
- `religious_influence`: representa influência de lideranças religiosas/comunitárias.
- `economic_stress`: representa pressão econômica, insegurança ou instabilidade social.
- `policy_intensity`: intensidade geral da política/intervenção aplicada.

---

## Escopo do Backend

Criar ou evoluir o módulo:

```text
backend/app/simulation/policy_sandbox.py
```

---

## Funções esperadas

Criar funções com responsabilidades claras:

```python
def clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    ...


def apply_policy_to_agent(agent: dict, policy: dict) -> dict:
    ...


def run_policy_simulation(
    scenario_name: str,
    population_size: int,
    cycles: int,
    policy: dict,
) -> dict:
    ...


def compare_results(base_result: dict, policy_result: dict) -> dict:
    ...
```

---

## Lógica de aplicação da política

A política deve modificar atributos dos agentes antes da simulação com política.

Lógica inicial sugerida:

```text
trust_in_institutions += institutional_trust_modifier * policy_intensity
fear_level += economic_stress * policy_intensity
openness_to_change += media_influence * 0.30 * policy_intensity
social_influence_sensitivity += religious_influence * 0.20 * policy_intensity
```

Regras obrigatórias:

- valores finais devem permanecer entre `0.0` e `1.0`;
- aplicar `clamp` após cada alteração;
- não modificar a população base original por referência;
- copiar os agentes antes de aplicar política;
- manter a simulação base sem política para comparação.

---

## Fluxo de execução

O endpoint de política deve executar o seguinte fluxo:

1. receber payload com cenário, população, ciclos e política;
2. validar entrada;
3. rodar simulação base sem política;
4. rodar simulação com política aplicada;
5. comparar resultados finais;
6. retornar cenário base, cenário com política e diferenças calculadas.

---

## Endpoint

Criar endpoint:

```http
POST /api/policy-simulation/run
```

---

## Payload esperado

```json
{
  "scenario_name": "Nova UPA",
  "population_size": 1000,
  "cycles": 30,
  "policy": {
    "institutional_trust_modifier": 0.3,
    "media_influence": 0.4,
    "religious_influence": 0.2,
    "economic_stress": 0.1,
    "policy_intensity": 0.7
  }
}
```

---

## Resposta esperada

A resposta deve conter:

```json
{
  "scenario_name": "Nova UPA",
  "population_size": 1000,
  "cycles": 30,
  "policy": {
    "institutional_trust_modifier": 0.3,
    "media_influence": 0.4,
    "religious_influence": 0.2,
    "economic_stress": 0.1,
    "policy_intensity": 0.7
  },
  "base_scenario": {
    "final_result": {},
    "timeline": [],
    "interpretation": {}
  },
  "policy_scenario": {
    "final_result": {},
    "timeline": [],
    "interpretation": {}
  },
  "difference": {
    "supporters_change": 0,
    "supporters_percentage_change": 0.0,
    "resistant_change": 0,
    "resistant_percentage_change": 0.0,
    "hesitant_change": 0,
    "hesitant_percentage_change": 0.0,
    "risk_change": "sem alteração",
    "polarization_change": "sem alteração"
  }
}
```

---

## Schemas Pydantic

Criar ou evoluir schemas em:

```text
backend/app/schemas/simulation.py
```

Adicionar schemas sugeridos:

```python
class PolicyInput(BaseModel):
    institutional_trust_modifier: float
    media_influence: float
    religious_influence: float
    economic_stress: float
    policy_intensity: float


class PolicySimulationRequest(BaseModel):
    scenario_name: str
    population_size: int
    cycles: int
    policy: PolicyInput


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
    base_scenario: dict
    policy_scenario: dict
    difference: PolicyDifference
```

---

## Validações

Implementar validações:

```text
population_size mínimo: 10
population_size máximo: 10000
cycles mínimo: 1
cycles máximo: 100
institutional_trust_modifier mínimo: -1.0
institutional_trust_modifier máximo: 1.0
media_influence mínimo: 0.0
media_influence máximo: 1.0
religious_influence mínimo: 0.0
religious_influence máximo: 1.0
economic_stress mínimo: 0.0
economic_stress máximo: 1.0
policy_intensity mínimo: 0.0
policy_intensity máximo: 1.0
```

Valores inválidos devem retornar erro claro da API.

---

## Escopo do Frontend

Evoluir a página:

```text
frontend/src/pages/PolicySandboxPage.tsx
```

Caso ela ainda esteja apenas como placeholder, implementar a tela funcional.

---

## Formulário da tela Policy Sandbox

Adicionar campos:

- nome do cenário;
- tamanho da população;
- número de ciclos;
- confiança institucional;
- influência da mídia;
- influência religiosa;
- estresse econômico;
- intensidade da política.

Os controles das variáveis de política devem ser preferencialmente sliders Mantine.

---

## Ação principal

Botão:

```text
Executar Simulação de Política
```

Ao clicar:

1. chamar `POST /api/policy-simulation/run`;
2. exibir carregamento enquanto processa;
3. exibir erro amigável em caso de falha;
4. exibir os resultados em caso de sucesso.

---

## Visualização dos resultados

Exibir:

### Cards comparativos

- apoiadores antes;
- apoiadores depois;
- resistentes antes;
- resistentes depois;
- hesitantes antes;
- hesitantes depois;
- risco social antes/depois;
- polarização antes/depois.

### Diferenças

Exibir variações:

```text
+ adesão
- resistência
+/- hesitação
mudança no risco social
mudança na polarização
```

### Gráfico comparativo

Usar Recharts para comparar, pelo menos:

- supporters base vs policy;
- resistant base vs policy;
- hesitant base vs policy.

Pode ser gráfico de barras ou linhas.

---

## Service frontend

Criar ou evoluir service:

```text
frontend/src/services/simulation.ts
```

Adicionar função sugerida:

```typescript
export async function runPolicySimulation(payload: PolicySimulationRequest): Promise<PolicySimulationResponse> {
  ...
}
```

Reutilizar a configuração de API já existente.

Não hardcodar regras de negócio no frontend.

---

## CORS e integração

Garantir que o backend continue permitindo chamadas do frontend em:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Não remover a configuração de CORS criada na Iteration 01.

---

## Fora do Escopo

Não implementar nesta iteração:

- Psychohistory Engine completo;
- Influence Graph real;
- Monte Carlo;
- banco de dados;
- autenticação;
- IA generativa;
- agentes com memória;
- mapas;
- grafos reais;
- persistência de histórico.

---

## Critérios de Aceite

### Backend

- endpoint `POST /api/policy-simulation/run` funcional;
- simulação base executada;
- simulação com política executada;
- comparação entre cenários retornada;
- endpoint antigo `POST /api/simulations/run` continua funcionando;
- validações funcionando;
- valores de política respeitam faixas válidas.

### Frontend

- página `PolicySandboxPage` funcional;
- formulário renderiza corretamente;
- sliders funcionam;
- chamada ao backend funciona;
- resultados antes/depois aparecem;
- gráfico comparativo aparece;
- erros são exibidos de forma compreensível.

### Qualidade

- código modular;
- schemas Pydantic usados;
- nenhuma regra de negócio relevante hardcoded no frontend;
- reaproveitamento do motor da Iteration 01;
- documentação atualizada se necessário.

---

## Testes mínimos

Testar chamadas para `POST /api/policy-simulation/run` com:

```text
policy_intensity = 0.0
policy_intensity = 0.5
policy_intensity = 1.0
```

Validar:

- com `policy_intensity = 0.0`, diferença deve ser pequena ou nula;
- com `policy_intensity = 0.5`, deve haver alteração moderada;
- com `policy_intensity = 1.0`, deve haver alteração mais perceptível;
- soma dos agentes permanece igual à população;
- percentuais somam aproximadamente 100%;
- backend e frontend continuam rodando sem erro.

---

## Próxima Iteração

ITERATION_03_INFLUENCE_GRAPH
