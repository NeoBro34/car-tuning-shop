# Backend Documentation

## Overview

Backend FastAPI bilan yozilgan va Clean Architecture ishlatadi.

Flow:

```text
Route -> Service -> Repository -> Database
```

API prefix:

```text
/api/v1
```

Backend path:

```text
apps/backend/
```

## Structure

```text
apps/backend/app/
├── api/v1/          # API routes
├── core/            # config, database, security
├── models/          # SQLAlchemy models
├── schemas/         # Pydantic schemas
├── repositories/    # database queries
├── services/        # business logic
└── main.py
```

## Phase 1

Implemented:

- auth module
- users module
- JWT login/register
- password hashing with bcrypt
- SQLAlchemy `User` model
- Pydantic schemas
- service layer
- repository layer
- Alembic migration
- auth tests

Main files:

```text
app/api/v1/auth.py
app/api/v1/users.py
app/models/user.py
app/schemas/auth.py
app/schemas/user.py
app/services/auth_service.py
app/repositories/user_repository.py
```

Endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
GET  /api/v1/users/me
```

## Phase 2

Implemented modules:

- categories
- brands
- car_models

Each module has:

- SQLAlchemy model
- Pydantic schemas
- repository
- service
- CRUD API
- Alembic migration

Admin-only endpoints:

- create
- update
- delete

Public endpoints:

- list
- detail

## Models

Tables added:

```text
users
categories
brands
car_models
```

`categories` fields:

```text
id, name, slug, description, is_active, created_at, updated_at
```

`brands` fields:

```text
id, name, slug, description, is_active, created_at, updated_at
```

`car_models` fields:

```text
id, brand_id, name, slug, year_start, year_end, is_active, created_at, updated_at
```

## API Endpoints

Categories:

```text
GET    /api/v1/categories
GET    /api/v1/categories/{id}
POST   /api/v1/categories
PUT    /api/v1/categories/{id}
DELETE /api/v1/categories/{id}
```

Brands:

```text
GET    /api/v1/brands
GET    /api/v1/brands/{id}
POST   /api/v1/brands
PUT    /api/v1/brands/{id}
DELETE /api/v1/brands/{id}
```

Car Models:

```text
GET    /api/v1/car-models
GET    /api/v1/car-models/{id}
POST   /api/v1/car-models
PUT    /api/v1/car-models/{id}
DELETE /api/v1/car-models/{id}
```

Car models can be filtered by brand:

```text
GET /api/v1/car-models?brand_id=1
```

## Pagination

List endpoints support:

```text
limit
offset
```

Example:

```text
GET /api/v1/categories?limit=10&offset=0
```

Response:

```json
{
  "items": [],
  "meta": {
    "total": 0,
    "limit": 10,
    "offset": 0
  }
}
```

## Admin Access

Create, update, delete endpoints require admin token.

Header:

```text
Authorization: Bearer <token>
```

User must have:

```text
role = "admin"
```

## Migrations

Migration files:

```text
202605150001_create_users_table.py
202605150002_create_catalog_lookup_tables.py
```

Run migrations:

```bash
cd apps/backend
source venv/bin/activate
alembic upgrade head
```

Check current head:

```bash
alembic heads
```

Expected:

```text
202605150002
```

## Run Backend

```bash
cd apps/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## Tests

Run:

```bash
cd apps/backend
source venv/bin/activate
pytest tests
```

Current result:

```text
6 passed
```

Tested:

- register
- login
- protected user endpoint
- duplicate email
- wrong password
- admin-only permissions
- categories CRUD
- brands CRUD
- car models CRUD
- pagination
- validation errors

## Postman Test

1. Run backend.
2. Login as admin:

```text
POST /api/v1/auth/login
```

3. Save `access_token`.
4. Add auth header:

```text
Authorization: Bearer <access_token>
```

5. Test create endpoints:

```text
POST /api/v1/categories
POST /api/v1/brands
POST /api/v1/car-models
```

Example category body:

```json
{
  "name": "Exhaust Systems",
  "description": "Performance exhaust parts"
}
```

Example brand body:

```json
{
  "name": "HKS",
  "description": "Japanese tuning brand"
}
```

Example car model body:

```json
{
  "brand_id": 1,
  "name": "Supra",
  "year_start": 1993,
  "year_end": 2002
}
```

6. Test list/detail without token:

```text
GET /api/v1/categories
GET /api/v1/brands
GET /api/v1/car-models
```
