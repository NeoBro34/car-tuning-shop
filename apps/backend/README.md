# Car Tuning Shop Backend

Phase 1 implements FastAPI auth and users modules with SQLAlchemy, Alembic,
Pydantic schemas, service layer, repository layer, password hashing, and JWT.
Phase 2 adds categories, brands, and car models CRUD APIs with admin-only
write endpoints and paginated list responses.

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

## Phase 2 endpoints

Public read endpoints:

- `GET /api/v1/categories?limit=20&offset=0`
- `GET /api/v1/categories/{category_id}`
- `GET /api/v1/brands?limit=20&offset=0`
- `GET /api/v1/brands/{brand_id}`
- `GET /api/v1/car-models?limit=20&offset=0&brand_id=1`
- `GET /api/v1/car-models/{car_model_id}`

Admin-only write endpoints:

- `POST /api/v1/categories`
- `PUT /api/v1/categories/{category_id}`
- `DELETE /api/v1/categories/{category_id}`
- `POST /api/v1/brands`
- `PUT /api/v1/brands/{brand_id}`
- `DELETE /api/v1/brands/{brand_id}`
- `POST /api/v1/car-models`
- `PUT /api/v1/car-models/{car_model_id}`
- `DELETE /api/v1/car-models/{car_model_id}`

Admin requests must include:

```text
Authorization: Bearer <admin_access_token>
```

## Test

```bash
pytest tests
```

Postman flow:

1. Start the API with `uvicorn app.main:app --reload`.
2. Create or seed an admin user in the `users` table with `role = 'admin'`.
3. Login with `POST /api/v1/auth/login`.
4. Save `access_token` as a Postman variable named `token`.
5. For create, update, and delete requests, set `Authorization` to
   `Bearer {{token}}`.
6. Check public list/detail endpoints without a token.
