# Car Tuning Shop Backend

Phase 1 implements FastAPI auth and users modules with SQLAlchemy, Alembic,
Pydantic schemas, service layer, repository layer, password hashing, and JWT.

## Local setup

```bash
cd apps/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements-dev.txt
```

Set local environment variables before running against PostgreSQL:

```bash
export DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/car_tuning_shop"
export SECRET_KEY="replace-with-a-long-random-secret"
```

## Database

```bash
alembic upgrade head
```

## Run API

```bash
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs`.

## Phase 1 endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/users/me`

