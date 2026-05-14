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

## Phase 3

Implemented modules:

- products
- product_images

Products module includes:

- SQLAlchemy `Product` and `ProductImage` models
- Pydantic request/response schemas
- repository layer for database queries
- service layer for business logic
- CRUD API under `/api/v1/products`
- Alembic migration
- pagination
- search
- filter by category
- filter by brand
- filter by price
- stock validation
- slug generation
- SKU and slug uniqueness checks
- local multiple image uploads
- static file serving from `/uploads`

Admin-only product endpoints:

- create product
- update product
- delete product
- upload images
- set main image
- delete image

Public product endpoints:

- list products
- product detail by id
- product detail by slug

## Phase 4

Implemented module:

- cart

Cart module includes:

- SQLAlchemy `CartItem` model
- Pydantic request/response schemas
- repository layer for cart queries
- service layer for cart business logic
- CRUD API under `/api/v1/cart`
- Alembic migration
- add to cart
- get current user cart
- update item quantity
- remove item
- subtotal calculation
- total items calculation
- stock validation
- authenticated users only

Cart business rules:

- if product already exists in cart, new quantity is added to existing quantity
- users cannot add or update quantity above `product.stock_quantity`
- users can only access their own cart items

## Models

Tables added:

```text
users
categories
brands
car_models
products
product_images
cart_items
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

`products` fields:

```text
id, name, slug, description, price, discount_price, stock_quantity, sku,
category_id, brand_id, created_at, updated_at
```

`product_images` fields:

```text
id, product_id, image_url, is_main
```

`cart_items` fields:

```text
id, user_id, product_id, quantity, created_at
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

Products:

```text
GET    /api/v1/products
GET    /api/v1/products/{id}
GET    /api/v1/products/slug/{slug}
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
POST   /api/v1/products/{id}/images
PUT    /api/v1/products/{id}/images/{image_id}/main
DELETE /api/v1/products/{id}/images/{image_id}
```

Products can be filtered:

```text
GET /api/v1/products?search=exhaust
GET /api/v1/products?category_id=1
GET /api/v1/products?brand_id=1
GET /api/v1/products?min_price=100&max_price=1000
GET /api/v1/products?search=exhaust&category_id=1&brand_id=1&min_price=100&max_price=1000
```

Cart:

```text
POST   /api/v1/cart/add
GET    /api/v1/cart/
PUT    /api/v1/cart/{item_id}
DELETE /api/v1/cart/{item_id}
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
GET /api/v1/products?limit=10&offset=0
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

Create, update, delete endpoints for admin-managed resources require admin token.

Header:

```text
Authorization: Bearer <token>
```

User must have:

```text
role = "admin"
```

Cart endpoints require any authenticated active user:

```text
Authorization: Bearer <token>
```

## Image Uploads

Product images are uploaded with multipart form-data.

Endpoint:

```text
POST /api/v1/products/{product_id}/images?main_index=0
```

Form-data:

```text
files = image file
files = image file
```

Rules:

- multiple files are supported
- accepted extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- content type must start with `image/`
- files are stored under `uploads/products`
- returned URLs use `/uploads/products/<filename>`
- first upload becomes main image by default if `main_index` is not provided

Static files are mounted in `app/main.py`:

```text
/uploads
```

## Migrations

Migration files:

```text
202605150001_create_users_table.py
202605150002_create_catalog_lookup_tables.py
202605150003_create_products_tables.py
202605150004_create_cart_items_table.py
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
202605150004
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
11 passed
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
- products CRUD
- product filters
- product slug generation
- stock validation
- product image upload
- static image serving
- cart authentication
- add to cart and existing item quantity increase
- cart subtotal and total items
- cart stock validation
- update quantity
- remove item
- user cart isolation

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
POST /api/v1/products
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

Example product body:

```json
{
  "name": "HKS Hi-Power Exhaust",
  "description": "Stainless cat-back exhaust system",
  "price": "799.99",
  "discount_price": "699.99",
  "stock_quantity": 5,
  "sku": "HKS-EXH-001",
  "category_id": 1,
  "brand_id": 1
}
```

6. Test product image upload:

```text
POST /api/v1/products/1/images?main_index=0
```

Use Postman `form-data`:

```text
key: files
type: File
value: select image
```

Add multiple `files` rows to upload multiple images.

7. Test static file serving:

```text
GET /uploads/products/<filename>
```

Use the `image_url` returned by the upload response.

8. Test list/detail without token:

```text
GET /api/v1/categories
GET /api/v1/brands
GET /api/v1/car-models
GET /api/v1/products
GET /api/v1/products/1
GET /api/v1/products/slug/hks-hi-power-exhaust
```

## Swagger Test

1. Run backend:

```bash
cd apps/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

2. Open Swagger:

```text
http://127.0.0.1:8000/docs
```

3. Use `Authorize` with:

```text
Bearer <access_token>
```

4. Test cart endpoints:

```text
POST /api/v1/cart/add
GET /api/v1/cart/
PUT /api/v1/cart/{item_id}
DELETE /api/v1/cart/{item_id}
```
