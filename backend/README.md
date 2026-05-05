# Backend - Social Twin Lab

Base inicial da API do Social Twin Lab para a Iteration 00 (Foundation).

## Stack

- Python
- FastAPI
- Pydantic
- Uvicorn
- SQLAlchemy (preparado para evolucao)

## Endpoints

- `GET /health`
- `GET /api/status`
- `POST /api/scenarios/mock-run`

## Executando localmente

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
