# Local Deploy

## Requisitos

- Node.js 20+
- Python 3.11+
- npm

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API local esperada: `http://127.0.0.1:8000`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

UI local esperada: `http://127.0.0.1:5173`

## Observacoes

- Sem Docker nesta fase.
- Sem autenticacao nesta fase.
- Sem banco conectado nesta fase.
