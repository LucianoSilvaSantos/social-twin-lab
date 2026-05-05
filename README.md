# Social Twin Lab

Social Twin Lab e uma plataforma experimental de simulacao sociopolitica baseada em agentes, redes de influencia, politicas publicas e analise probabilistica de tendencias coletivas.

## Visao Geral

O projeto cria um ambiente controlado para explorar cenarios sociais e avaliar efeitos coletivos provaveis antes de decisoes reais. Nesta fase inicial, a simulacao real ainda nao e implementada.

## Stack

### Frontend

- React
- Vite
- TypeScript
- Mantine UI
- Mantine Hooks
- Tabler Icons
- React Router DOM
- Recharts
- React Flow

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- SQLAlchemy (preparado)

### Simulacao futura

- Mesa
- NetworkX
- NumPy
- Pandas
- SciPy

### Banco futuro

- PostgreSQL

## Modulos do Produto

- Dashboard
- Scenario Builder
- Population Forge
- Influence Graph
- Policy Sandbox
- Psychohistory Engine
- Results and Analytics

## Como Rodar o Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Como Rodar o Frontend

```bash
cd frontend
npm install
npm run dev
```

## Filosofia de Iteracoes

O desenvolvimento evolui por iteracoes curtas (sprints), com escopo incremental e rastreavel em Markdown na pasta `docs/`.

Iteracao atual: `ITERATION_00_FOUNDATION`.

## Regra Operacional para o Codex

Antes de implementar qualquer funcionalidade, consultar obrigatoriamente:

- `docs/product/PRODUCT_VISION.md`
- `docs/product/ARCHITECTURE.md`
- `docs/product/DOMAIN_RULES.md`
- `docs/product/DECISIONS.md`
- `docs/iterations/CURRENT_ITERATION.md`
- `docs/qa/ACCEPTANCE_CHECKLIST.md`
