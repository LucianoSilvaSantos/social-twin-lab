# CURRENT ITERATION

## Iteração Atual

ITERATION_03_INFLUENCE_GRAPH

---

## Status

EM EXECUÇÃO

---

## Objetivo Atual

Implementar o módulo **Influence Graph** do Social Twin Lab, adicionando uma camada de rede social simulada ao motor de simulação.

Esta iteração deve evoluir o sistema para representar relações de influência entre agentes, grupos e lideranças, permitindo observar como conexões sociais, líderes e clusters afetam o comportamento coletivo.

A proposta central permanece a mesma: o sistema simula tendências coletivas prováveis e cenários possíveis, não prevê comportamento individual.

---

## Arquivo de Referência Principal

`docs/iterations/ITERATION_03_INFLUENCE_GRAPH.md`

---

## Arquivos que o Codex deve consultar antes de implementar

Antes de alterar qualquer código, o Codex deve ler e respeitar:

1. `README.md`
2. `docs/product/PRODUCT_VISION.md`
3. `docs/product/ARCHITECTURE.md`
4. `docs/product/DOMAIN_RULES.md`
5. `docs/product/DECISIONS.md`
6. `docs/product/MODULES.md`
7. `docs/iterations/ITERATION_01_MVP_SIMULATION.md`
8. `docs/iterations/ITERATION_02_POLICY_SANDBOX.md`
9. `docs/iterations/ITERATION_03_INFLUENCE_GRAPH.md`
10. `docs/qa/ACCEPTANCE_CHECKLIST.md`
11. `docs/qa/TEST_SCENARIOS.md`

---

## Escopo Ativo

Nesta iteração, implementar somente:

- criação ou evolução do módulo `backend/app/simulation/influence.py`;
- criação de uma rede de influência simples entre agentes;
- criação de grupos sociais e líderes sintéticos;
- cálculo de influência local baseada nos vizinhos conectados;
- integração da influência local ao comportamento dos agentes;
- criação do endpoint `POST /api/influence-simulation/run`;
- retorno de métricas da rede e dos resultados da simulação;
- evolução da página `InfluenceGraphPage` no frontend;
- visualização inicial da rede com nós e conexões;
- uso de cores para estados dos agentes;
- exibição de métricas como número de líderes, clusters, conexões e distribuição de estados.

---

## Fora do Escopo Atual

Não implementar nesta execução:

- Psychohistory Engine completo;
- agentes com memória longa;
- IA generativa;
- Monte Carlo;
- banco de dados;
- autenticação;
- mapas geográficos;
- simulação espacial real;
- animação complexa em tempo real;
- persistência de histórico;
- reescrita profunda da Iteration 01 ou 02 sem necessidade.

---

## Regras para o Codex

- Seguir rigorosamente o escopo da `ITERATION_03_INFLUENCE_GRAPH`.
- Reutilizar o motor de simulação da Iteration 01 sempre que possível.
- Não quebrar os endpoints existentes:
  - `POST /api/simulations/run`
  - `POST /api/policy-simulation/run`
- Não antecipar funcionalidades da Iteration 04 ou posteriores.
- Não alterar decisões arquiteturais sem registrar em `docs/product/DECISIONS.md`.
- Manter código limpo, modular e simples.
- Usar inglês para nomes de arquivos, funções, variáveis e classes.
- Usar português nos textos visíveis da interface quando fizer sentido para o produto.
- Manter regras de negócio no backend, não no frontend.
- Usar schemas Pydantic para entrada e saída da API.
- Validar entradas da simulação antes de executar.
- Garantir que valores numéricos permaneçam em faixas válidas usando clamp.
- Manter a simulação explicável e auditável.

---

## Critério de Conclusão

A iteração será considerada concluída quando:

- backend rodar sem erro;
- frontend rodar sem erro;
- endpoint `POST /api/influence-simulation/run` funcionar;
- rede de influência for gerada;
- líderes e grupos forem criados;
- influência local alterar o comportamento dos agentes;
- resultado final retornar contagens, percentuais e métricas da rede;
- frontend exibir a rede de influência;
- frontend exibir cards de métricas;
- frontend exibir gráfico ou resumo da evolução por ciclos;
- endpoints das iterações anteriores continuarem funcionando;
- documentação for atualizada se houver mudança relevante.

---

## Próxima Iteração

Após concluir esta iteração, atualizar este arquivo para:

`ITERATION_04_PSYCHOHISTORY_ENGINE`
