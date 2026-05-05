# Test Scenarios

## Cenario 1 - Health Check

1. Iniciar backend
2. Chamar `GET /health`
3. Validar status 200 e payload com `status: ok`

## Cenario 2 - Status da API

1. Chamar `GET /api/status`
2. Validar modo `mock-only`

## Cenario 3 - Mock Run

1. Chamar `POST /api/scenarios/mock-run`
2. Validar campos de adesao, polarizacao, risco, confianca e tendencia

## Cenario 4 - Navegacao Frontend

1. Iniciar frontend
2. Navegar por todas as paginas do menu lateral
3. Validar renderizacao sem erros
