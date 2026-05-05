# Architecture

## Visao Arquitetural

A arquitetura do Social Twin Lab separa interface, API, dominio e simulacao para facilitar evolucao incremental por iteracoes.

## Frontend

- React + Vite + TypeScript
- Mantine para layout e componentes
- React Router DOM para navegacao
- Recharts para visualizacoes
- React Flow para grafos de influencia

## Backend

- FastAPI como camada de API
- Pydantic para contratos de dados
- SQLAlchemy preparado para persistencia futura

## Motor de Simulacao (Futuro)

- Mesa para modelagem baseada em agentes
- NetworkX para rede de influencia
- NumPy, Pandas e SciPy para processamento e analise

## Modulos Conceituais

- Policy Sandbox: testa variacoes de politica publica em cenarios
- Psychohistory Engine: agrega execucoes para inferir tendencias coletivas provaveis

## Banco de Dados Futuro

- PostgreSQL

## Escopo da Foundation

Nesta iteracao, a arquitetura e preparada com interfaces e stubs, sem logica real de simulacao e sem integracao com banco.
