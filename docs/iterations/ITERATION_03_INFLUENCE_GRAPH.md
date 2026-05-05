# ITERATION 03 — INFLUENCE GRAPH

## Nome da Iteração

Influence Graph

---

## Objetivo

Implementar uma camada inicial de **rede de influência** no Social Twin Lab, permitindo que agentes deixem de reagir apenas a uma influência média global e passem a reagir também a conexões locais, grupos sociais e lideranças.

Esta iteração deve aproximar o sistema de uma simulação social mais dinâmica, onde o comportamento coletivo emerge das interações entre agentes.

---

## Contexto

Nas iterações anteriores, o sistema passou a ter:

- geração de população sintética;
- simulação básica por ciclos;
- cálculo de apoiadores, resistentes e hesitantes;
- Policy Sandbox para testar intervenções;
- comparação entre cenário base e cenário com política.

Agora o sistema deve evoluir para representar relações sociais.

Hoje, a influência social ainda é simplificada. Nesta iteração, ela será ampliada com uma rede de influência composta por:

- agentes comuns;
- líderes;
- grupos sociais;
- conexões;
- influência local.

---

## Conceito

O Influence Graph representa a ideia de que pessoas não reagem isoladamente.

Cada agente pode ser influenciado por:

- vizinhos conectados;
- líderes comunitários;
- líderes religiosos;
- influenciadores;
- grupos sociais;
- maioria local;
- intensidade das conexões.

O objetivo não é criar uma rede social real perfeita, mas uma primeira representação funcional e explicável da influência em rede.

---

## Estados possíveis dos agentes

Manter os estados já existentes:

- `supporter` — apoia o cenário/política;
- `resistant` — resiste ao cenário/política;
- `hesitant` — está indeciso ou aguardando influência externa.

---

## Novos conceitos de domínio

### Influence Node

Representa um nó da rede.

Pode ser:

- `agent`
- `leader`
- `group`

---

### Influence Edge

Representa conexão entre dois nós.

Cada conexão deve possuir:

- `source_id`
- `target_id`
- `weight`

O peso deve ficar entre `0.0` e `1.0`.

---

### Leader

Um líder é um agente com maior capacidade de influência.

Tipos iniciais:

- `community_leader`
- `religious_leader`
- `media_influencer`
- `institutional_actor`

---

### Cluster

Um cluster representa um agrupamento social.

Exemplos conceituais:

- bairro;
- comunidade religiosa;
- grupo digital;
- grupo familiar;
- grupo político;
- grupo profissional.

Nesta iteração, clusters podem ser sintéticos e simples.

---

## Atributos adicionais dos agentes

Cada agente pode receber novos campos:

- `group_id`
- `is_leader`
- `leader_type`
- `influence_power`
- `connections`

Valores numéricos devem preferencialmente ficar entre `0.0` e `1.0`.

---

## Escopo

### Backend

Criar ou evoluir o módulo:

```text
backend/app/simulation/influence.py
```

Criar ou evoluir os módulos existentes, se necessário:

```text
backend/app/simulation/population.py
backend/app/simulation/behavior.py
backend/app/simulation/runner.py
backend/app/simulation/results.py
```

---

## Funções esperadas

Implementar funções claras e reutilizáveis.

```python
def generate_influence_network(population: list[dict], leader_ratio: float, average_connections: int) -> dict:
    ...

def assign_groups(population: list[dict], number_of_groups: int) -> list[dict]:
    ...

def assign_leaders(population: list[dict], leader_ratio: float) -> list[dict]:
    ...

def calculate_local_influence(agent: dict, network: dict, population_index: dict) -> float:
    ...

def run_influence_simulation(
    population_size: int,
    cycles: int,
    number_of_groups: int,
    leader_ratio: float,
    average_connections: int
) -> dict:
    ...
```

---

## Regras de influência

### Influência local

A influência local deve considerar o estado dos vizinhos conectados.

Sugestão inicial:

```text
supporter_neighbors_weight = soma dos pesos dos vizinhos supporter
resistant_neighbors_weight = soma dos pesos dos vizinhos resistant
total_neighbor_weight = soma dos pesos de todos os vizinhos

local_influence =
  (supporter_neighbors_weight - resistant_neighbors_weight) / total_neighbor_weight
```

Normalizar resultado para faixa `0.0` a `1.0`.

---

### Influência de líderes

Se o vizinho for líder, o peso da conexão deve ser amplificado por `influence_power`.

Exemplo:

```text
effective_weight = edge.weight * (1 + leader.influence_power)
```

---

### Integração com comportamento

A fórmula de apoio deve evoluir para considerar a influência local.

Sugestão:

```text
support_score =
  (trust_in_institutions * 0.30) +
  (openness_to_change * 0.25) +
  ((1 - fear_level) * 0.20) +
  (local_influence_factor * social_influence_sensitivity * 0.25)
```

Classificação:

```text
support_score >= 0.60 -> supporter
support_score <= 0.40 -> resistant
caso contrário -> hesitant
```

---

## Endpoint

Criar endpoint:

```http
POST /api/influence-simulation/run
```

---

## Payload esperado

```json
{
  "scenario_name": "Expansão de campanha pública com líderes locais",
  "population_size": 1000,
  "cycles": 30,
  "number_of_groups": 8,
  "leader_ratio": 0.05,
  "average_connections": 6
}
```

---

## Resposta esperada

A resposta deve conter:

```json
{
  "scenario_name": "Expansão de campanha pública com líderes locais",
  "population_size": 1000,
  "cycles": 30,
  "network_metrics": {
    "nodes": 1000,
    "edges": 6000,
    "leaders": 50,
    "groups": 8,
    "average_connections": 6
  },
  "final_result": {
    "supporters": 0,
    "resistant": 0,
    "hesitant": 0,
    "supporters_percentage": 0.0,
    "resistant_percentage": 0.0,
    "hesitant_percentage": 0.0
  },
  "timeline": [
    {
      "cycle": 1,
      "supporters": 0,
      "resistant": 0,
      "hesitant": 0
    }
  ],
  "graph": {
    "nodes": [
      {
        "id": "agent-1",
        "type": "agent",
        "state": "hesitant",
        "group_id": "group-1",
        "is_leader": false
      }
    ],
    "edges": [
      {
        "source": "agent-1",
        "target": "agent-2",
        "weight": 0.75
      }
    ]
  },
  "interpretation": {
    "dominant_trend": "População dividida",
    "social_risk": "Médio",
    "polarization_level": "Moderado",
    "network_effect": "Influência local relevante"
  }
}
```

---

## Schemas Pydantic

Criar ou evoluir schemas para:

```text
InfluenceSimulationRequest
InfluenceNetworkMetrics
InfluenceGraphNode
InfluenceGraphEdge
InfluenceSimulationResponse
```

Validações:

```text
population_size mínimo: 10
population_size máximo: 10000
cycles mínimo: 1
cycles máximo: 100
number_of_groups mínimo: 1
number_of_groups máximo: 100
leader_ratio mínimo: 0.0
leader_ratio máximo: 0.3
average_connections mínimo: 1
average_connections máximo: 50
```

---

## Frontend

### Página

Evoluir:

```text
InfluenceGraphPage
```

---

## Interface esperada

Criar formulário com Mantine contendo:

- nome do cenário;
- tamanho da população;
- ciclos;
- número de grupos;
- percentual de líderes;
- média de conexões por agente;
- botão “Executar Simulação de Influência”.

---

## Visualização esperada

Exibir:

### Cards

- total de nós;
- total de conexões;
- líderes;
- grupos;
- apoiadores;
- resistentes;
- hesitantes;
- risco social;
- polarização.

---

### Grafo

Usar React Flow se já estiver disponível no frontend.

Representar:

- nós como agentes;
- líderes com destaque visual;
- cores por estado:
  - supporter: verde;
  - resistant: vermelho;
  - hesitant: amarelo/cinza;
- conexões entre agentes.

Se houver muitos agentes, limitar a visualização gráfica para uma amostra inicial, por exemplo:

```text
máximo de 100 nós renderizados no frontend
```

O backend pode retornar a rede completa ou uma amostra. A decisão deve priorizar estabilidade e performance.

---

### Gráfico temporal

Usar Recharts para mostrar evolução por ciclos:

- supporters;
- resistant;
- hesitant.

---

### Resumo textual

Exibir interpretação:

- tendência dominante;
- risco social;
- polarização;
- efeito da rede.

---

## Casos de uso simuláveis

- influência de líderes religiosos em uma campanha;
- reação de bairros a uma nova obra pública;
- aceitação de uma UPA em diferentes comunidades;
- efeito de influenciadores em uma campanha de vacinação;
- polarização causada por grupos digitais;
- resistência comunitária a uma nova lei.

---

## Fora do Escopo

Não implementar nesta iteração:

- agentes com memória longa;
- IA generativa;
- mundo visual animado;
- mapas geográficos;
- banco de dados;
- autenticação;
- Monte Carlo;
- Psychohistory Engine completo;
- persistência de histórico;
- leitura de dados reais;
- upload de arquivos;
- visualização 3D;
- otimização avançada de redes.

---

## Critérios de Aceite

### Backend

- endpoint `POST /api/influence-simulation/run` funcional;
- rede de influência gerada;
- grupos atribuídos aos agentes;
- líderes atribuídos aos agentes;
- influência local usada no cálculo do comportamento;
- resultado final com contagens e percentuais;
- timeline retornada corretamente;
- métricas da rede retornadas;
- graph nodes e edges retornados;
- endpoints anteriores continuam funcionando.

---

### Frontend

- página Influence Graph funcional;
- formulário com os campos da iteração;
- execução da simulação pelo frontend;
- cards de métricas exibidos;
- grafo exibido ou placeholder funcional caso a renderização precise ser limitada;
- gráfico temporal exibido;
- resumo textual exibido;
- erro de API tratado de forma amigável.

---

### Qualidade

- código modular;
- funções pequenas e claras;
- schemas Pydantic criados ou evoluídos;
- nenhuma regra de negócio hardcoded no frontend;
- nomes claros;
- sem duplicação desnecessária;
- performance aceitável para 1000 agentes;
- estabilidade preservada nas iterações anteriores.

---

## Testes mínimos

Executar:

```text
population_size = 100
cycles = 10
number_of_groups = 4
leader_ratio = 0.05
average_connections = 3
```

```text
population_size = 1000
cycles = 30
number_of_groups = 8
leader_ratio = 0.05
average_connections = 6
```

```text
population_size = 5000
cycles = 30
number_of_groups = 20
leader_ratio = 0.03
average_connections = 5
```

Validar:

- soma final = population_size;
- quantidade de ciclos = cycles;
- percentuais somam aproximadamente 100%;
- líderes não ultrapassam o percentual informado;
- grupos são atribuídos;
- grafo possui nós e conexões;
- endpoint não quebra com parâmetros válidos.

---

## Atualizações de documentação

Ao concluir esta iteração, atualizar se necessário:

- `docs/product/ARCHITECTURE.md`;
- `docs/product/MODULES.md`;
- `docs/qa/TEST_SCENARIOS.md`;
- `README.md`.

---

## Próxima Iteração

### ITERATION_04_PSYCHOHISTORY_ENGINE

Objetivo:

Rodar múltiplas simulações, agregar resultados, identificar padrões, calcular tendências prováveis e transformar simulações individuais em leitura estratégica de cenários coletivos.

---

## Observação Importante

Esta iteração deve introduzir influência em rede de forma simples, explicável e funcional.

O objetivo não é criar uma rede social perfeita, mas evoluir o sistema para que o comportamento dos agentes dependa também das relações sociais.

O sistema deve continuar deixando claro que trabalha com cenários possíveis e tendências simuladas, não previsões determinísticas.
