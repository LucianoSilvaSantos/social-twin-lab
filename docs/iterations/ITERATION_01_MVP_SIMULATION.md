# ITERATION 01 — MVP SIMULATION

## Nome da Iteração

MVP Simulation

---

## Objetivo

Implementar o primeiro motor funcional de simulação do **Social Twin Lab**, permitindo:

- gerar uma população sintética;
- simular comportamento coletivo simples;
- executar ciclos de interação;
- produzir resultados quantitativos;
- exibir os resultados no frontend.

Esta iteração transforma o projeto de uma fundação técnica e documental para um MVP funcional e demonstrável.

---

## Contexto

Na Iteração 00, o projeto foi estruturado com:

- frontend em React + Vite + TypeScript + Mantine;
- backend em FastAPI;
- documentação base;
- páginas iniciais;
- endpoints mock.

Agora o objetivo é criar uma primeira simulação simples, ainda sem complexidade avançada, mas suficiente para demonstrar o conceito do produto.

---

## Conceito da Simulação Inicial

A simulação deve representar uma população sintética reagindo a um cenário social.

Exemplo de cenário:

> Nova política pública de vacinação

Cada agente deve possuir atributos básicos que influenciam sua reação ao cenário.

O objetivo não é representar fielmente uma sociedade real, mas criar uma base funcional, simples e evolutiva para futuras iterações.

---

## Estados possíveis dos agentes

Cada agente deve assumir um dos seguintes estados:

- `supporter` — apoia o cenário/política;
- `resistant` — resiste ao cenário/política;
- `hesitant` — está indeciso ou aguardando influência externa.

---

## Atributos mínimos do agente

Cada agente sintético deve possuir:

- `id`;
- `age_group`;
- `trust_in_institutions`;
- `fear_level`;
- `openness_to_change`;
- `social_influence_sensitivity`;
- `current_state`.

Valores numéricos devem ficar entre `0.0` e `1.0`.

### Exemplo de agente

```json
{
  "id": 1,
  "age_group": "adult",
  "trust_in_institutions": 0.72,
  "fear_level": 0.31,
  "openness_to_change": 0.64,
  "social_influence_sensitivity": 0.58,
  "current_state": "hesitant"
}
```

---

## Grupos etários sugeridos

Usar distribuição simples para `age_group`:

- `young`;
- `adult`;
- `senior`.

A distribuição pode ser aleatória nesta iteração.

---

## Regras básicas de comportamento

A decisão do agente deve considerar:

- confiança institucional;
- abertura à mudança;
- nível de medo;
- sensibilidade à influência social.

### Fórmula inicial

```text
support_score =
  (trust_in_institutions * 0.35) +
  (openness_to_change * 0.35) +
  ((1 - fear_level) * 0.20) +
  (social_influence_factor * social_influence_sensitivity * 0.10)
```

### Classificação

```text
support_score >= 0.60 -> supporter
support_score <= 0.40 -> resistant
caso contrário -> hesitant
```

---

## Ciclos da simulação

A simulação deve rodar por um número configurável de ciclos.

Valor padrão sugerido:

```text
30 ciclos
```

Em cada ciclo:

1. calcular o fator médio de influência social com base na proporção atual de apoiadores;
2. recalcular o estado de cada agente;
3. registrar a quantidade de apoiadores, resistentes e hesitantes;
4. armazenar o resultado do ciclo na timeline.

---

## Backend

Criar ou evoluir os módulos:

```text
backend/app/simulation/population.py
backend/app/simulation/behavior.py
backend/app/simulation/runner.py
backend/app/simulation/results.py
```

---

## Funções esperadas

### `population.py`

Responsável por gerar a população sintética.

```python
def generate_population(size: int) -> list[dict]:
    """Generate a synthetic population with basic behavioral attributes."""
```

---

### `behavior.py`

Responsável por calcular a reação individual do agente.

```python
def calculate_support_score(agent: dict, social_influence_factor: float) -> float:
    """Calculate the agent support score for the current cycle."""


def classify_agent_state(score: float) -> str:
    """Classify an agent as supporter, resistant or hesitant."""
```

---

### `runner.py`

Responsável por executar os ciclos da simulação.

```python
def run_simulation(scenario_name: str, population_size: int, cycles: int) -> dict:
    """Run the MVP simulation and return timeline, final result and interpretation."""
```

---

### `results.py`

Responsável por consolidar os resultados.

```python
def summarize_results(cycle_results: list[dict], population_size: int) -> dict:
    """Summarize the final simulation result."""


def interpret_results(final_result: dict) -> dict:
    """Generate a simple interpretation for the final simulation result."""
```

---

## Schemas Pydantic

Criar ou evoluir schemas para entrada e saída da simulação.

Sugestão de schemas:

```text
SimulationRequest
SimulationCycleResult
SimulationFinalResult
SimulationInterpretation
SimulationResponse
```

---

## Endpoint

Criar endpoint real:

```http
POST /api/simulations/run
```

### Payload esperado

```json
{
  "scenario_name": "Nova política pública de vacinação",
  "population_size": 1000,
  "cycles": 30
}
```

### Resposta esperada

```json
{
  "scenario_name": "Nova política pública de vacinação",
  "population_size": 1000,
  "cycles": 30,
  "final_result": {
    "supporters": 620,
    "resistant": 240,
    "hesitant": 140,
    "supporters_percentage": 62.0,
    "resistant_percentage": 24.0,
    "hesitant_percentage": 14.0
  },
  "timeline": [
    {
      "cycle": 1,
      "supporters": 510,
      "resistant": 300,
      "hesitant": 190
    }
  ],
  "interpretation": {
    "dominant_trend": "Adesão majoritária",
    "social_risk": "Médio",
    "polarization_level": "Moderado"
  }
}
```

---

## Validações

A API deve validar:

```text
population_size mínimo: 10
population_size máximo: 10000
cycles mínimo: 1
cycles máximo: 100
scenario_name obrigatório
```

Valores inválidos devem retornar erro claro.

---

## Interpretação inicial

O backend deve retornar:

- `dominant_trend`;
- `social_risk`;
- `polarization_level`.

### Regras sugeridas para tendência dominante

```text
supporters_percentage >= 60 -> Adesão majoritária
resistant_percentage >= 50 -> Resistência majoritária
diferença entre supporters_percentage e resistant_percentage <= 15 -> População dividida
hesitant_percentage >= 30 -> Hesitação elevada
```

Ordem recomendada de avaliação:

1. hesitação elevada;
2. população dividida;
3. adesão majoritária;
4. resistência majoritária;
5. tendência indefinida.

### Regras sugeridas para risco social

```text
resistant_percentage >= 45 -> Alto
resistant_percentage >= 25 -> Médio
caso contrário -> Baixo
```

### Regras sugeridas para polarização

```text
supporters_percentage >= 40 e resistant_percentage >= 40 -> Alto
diferença entre supporters_percentage e resistant_percentage <= 20 -> Moderado
caso contrário -> Baixo
```

---

## Frontend

Criar ou evoluir uma tela de simulação.

Pode ser:

```text
SimulationPage
```

ou, caso a arquitetura atual não possua essa página:

```text
ScenariosPage
```

---

## Formulário de simulação

A tela deve conter formulário com Mantine para:

- nome do cenário;
- tamanho da população;
- número de ciclos;
- botão `Executar Simulação`.

---

## Resultado no frontend

Após executar a simulação, exibir:

### Cards

- percentual de apoiadores;
- percentual de resistentes;
- percentual de hesitantes;
- risco social;
- polarização.

### Gráfico temporal

Usar Recharts para exibir evolução temporal com as linhas:

- apoiadores;
- resistentes;
- hesitantes.

### Tabela por ciclo

Exibir tabela com:

| Ciclo | Apoiadores | Resistentes | Hesitantes |
|---:|---:|---:|---:|

---

## Integração Frontend-Backend

O frontend deve consumir:

```http
POST /api/simulations/run
```

A URL base da API deve ser fácil de ajustar futuramente, preferencialmente em arquivo de serviço ou configuração.

---

## Fora do Escopo

Não implementar nesta iteração:

- Policy Sandbox;
- Psychohistory Engine real;
- Influence Graph real;
- Monte Carlo;
- banco de dados;
- autenticação;
- IA generativa;
- agentes com memória;
- mapas;
- grafos reais;
- persistência de resultados.

---

## Critérios de Aceite

### Backend

- endpoint `POST /api/simulations/run` funcional;
- população sintética gerada;
- simulação roda por ciclos;
- timeline retornada corretamente;
- soma final dos agentes igual ao tamanho da população;
- percentuais somam aproximadamente 100%;
- validações de entrada funcionando;
- resposta JSON consistente.

### Frontend

- formulário funcional;
- chamada ao backend funcionando;
- resultados exibidos em cards;
- gráfico temporal exibido;
- tabela por ciclo exibida;
- estados de carregamento e erro tratados minimamente.

### Qualidade

- código modular;
- schemas Pydantic criados;
- nenhuma regra de negócio hardcoded no frontend;
- nomes claros;
- documentação atualizada se necessário;
- não implementar funcionalidades de iterações futuras.

---

## Testes mínimos

Testar com:

```text
population_size = 100
cycles = 10

population_size = 1000
cycles = 30

population_size = 10000
cycles = 50
```

Validar:

- soma final = `population_size`;
- quantidade de ciclos = `cycles`;
- percentuais somam aproximadamente 100%;
- resposta contém `final_result`;
- resposta contém `timeline`;
- resposta contém `interpretation`.

---

## Atualizações de documentação

Ao concluir esta iteração, atualizar se necessário:

- `docs/iterations/CURRENT_ITERATION.md`;
- `docs/product/ARCHITECTURE.md`;
- `docs/product/MODULES.md`;
- `docs/qa/TEST_SCENARIOS.md`;
- `README.md`.

---

## Próxima Iteração

`ITERATION_02_POLICY_SANDBOX`

Objetivo da próxima iteração:

Permitir ao usuário alterar variáveis de política pública e comparar os impactos entre cenários.

---

## Observação Importante

Esta simulação inicial é simplificada e experimental.

O sistema deve sempre deixar claro que trabalha com cenários possíveis e tendências simuladas, não previsões determinísticas.
