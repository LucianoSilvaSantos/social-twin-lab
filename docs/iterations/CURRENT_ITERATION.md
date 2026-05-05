# CURRENT ITERATION

## Iteração Atual

ITERATION_02_POLICY_SANDBOX

---

## Status

EM EXECUÇÃO

---

## Objetivo Atual

Implementar o módulo **Policy Sandbox** do Social Twin Lab, permitindo testar intervenções de política pública e comparar os resultados entre um cenário base e um cenário com política aplicada.

Esta iteração deve evoluir o MVP de simulação criado na Iteration 01 para um laboratório de decisão, sem alterar a proposta central do sistema: simular tendências coletivas prováveis, não prever comportamentos individuais.

---

## Arquivo de Referência Principal

`docs/iterations/ITERATION_02_POLICY_SANDBOX.md`

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
9. `docs/qa/ACCEPTANCE_CHECKLIST.md`
10. `docs/qa/TEST_SCENARIOS.md`

---

## Escopo Ativo

Nesta iteração, implementar somente:

- criação do módulo `backend/app/simulation/policy_sandbox.py`;
- definição de schemas Pydantic para requisição e resposta da simulação de política;
- criação do endpoint `POST /api/policy-simulation/run`;
- execução de uma simulação base sem política;
- execução de uma simulação com política aplicada;
- comparação estruturada entre cenário base e cenário com política;
- evolução da página `PolicySandboxPage` no frontend;
- criação de sliders para variáveis de política;
- exibição dos resultados comparativos em cards, gráfico e resumo textual.

---

## Fora do Escopo Atual

Não implementar nesta execução:

- Psychohistory Engine completo;
- Influence Graph real;
- Monte Carlo;
- banco de dados;
- autenticação;
- IA generativa;
- agentes com memória;
- mapas;
- grafos reais;
- persistência de histórico;
- alteração profunda da lógica da Iteration 01 sem necessidade.

---

## Regras para o Codex

- Seguir rigorosamente o escopo da `ITERATION_02_POLICY_SANDBOX`.
- Reutilizar o motor de simulação já implementado na Iteration 01 sempre que possível.
- Não quebrar o endpoint existente `POST /api/simulations/run`.
- Não antecipar funcionalidades da Iteration 03 ou posteriores.
- Não alterar decisões arquiteturais sem registrar em `docs/product/DECISIONS.md`.
- Manter código limpo, modular e simples.
- Usar inglês para nomes de arquivos, funções, variáveis e classes.
- Usar português nos textos visíveis da interface quando fizer sentido para o produto.
- Manter regras de negócio no backend, não no frontend.
- Usar schemas Pydantic para entrada e saída da API.
- Validar entradas da simulação antes de executar.
- Garantir que valores de variáveis de política permaneçam em faixas válidas usando clamp.

---

## Critério de Conclusão

A iteração será considerada concluída quando:

- backend rodar sem erro;
- frontend rodar sem erro;
- endpoint `POST /api/policy-simulation/run` funcionar;
- simulação base for executada;
- simulação com política for executada;
- comparação entre cenários retornar diferenças de apoiadores, resistentes e hesitantes;
- frontend exibir sliders de política;
- frontend exibir resultados antes e depois;
- frontend exibir gráfico comparativo;
- teste com `policy_intensity` 0.0, 0.5 e 1.0 for verificado;
- documentação for atualizada se houver mudança relevante.

---

## Próxima Iteração

Após concluir esta iteração, atualizar este arquivo para:

`ITERATION_03_INFLUENCE_GRAPH`
