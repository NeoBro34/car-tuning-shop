# Car Tuning Shop Backend

Phase 1 implements FastAPI auth and users modules with SQLAlchemy, Alembic,
Pydantic schemas, service layer, repository layer, password hashing, and JWT.
Phase 2 adds categories, brands, and car models CRUD APIs with admin-only
write endpoints and paginated list responses.
Phase 3 adds products, product images, filters, local image uploads, and
static file serving.
Phase 4 adds authenticated cart management with stock validation and cart
totals.

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

## Phase 3 products

Public read endpoints:

- `GET /api/v1/products?limit=20&offset=0`
- `GET /api/v1/products?search=exhaust&category_id=1&brand_id=1&min_price=100&max_price=1000`
- `GET /api/v1/products/{product_id}`
- `GET /api/v1/products/slug/{slug}`

Admin-only write endpoints:

- `POST /api/v1/products`
- `PUT /api/v1/products/{product_id}`
- `DELETE /api/v1/products/{product_id}`
- `POST /api/v1/products/{product_id}/images?main_index=0`
- `PUT /api/v1/products/{product_id}/images/{image_id}/main`
- `DELETE /api/v1/products/{product_id}/images/{image_id}`

Image uploads use multipart form-data with one or more `files` fields.
Uploaded files are saved under `UPLOAD_DIR/products` and served at
`/uploads/products/<filename>`.

Postman product flow:

1. Run `alembic upgrade head`.
2. Start the API with `uvicorn app.main:app --reload`.
3. Login as an admin and set `Authorization: Bearer {{token}}`.
4. Create a category and brand.
5. Create a product with `POST /api/v1/products`.
6. Upload images with form-data: key `files`, type `File`, add multiple rows.
7. Open the returned `image_url` in the browser to verify static file serving.

## Phase 4 cart

Authenticated cart endpoints:

- `POST /api/v1/cart/add`
- `GET /api/v1/cart/`
- `PUT /api/v1/cart/{item_id}`
- `DELETE /api/v1/cart/{item_id}`

Example add body:

```json
{
  "product_id": 1,
  "quantity": 2
}
```

Example update body:

```json
{
  "quantity": 3
}
```

Cart responses include `items`, `subtotal`, and `total_items`. If the same
product is added again, its cart quantity is increased. Quantity cannot exceed
the product stock.

Swagger flow:

1. Start the API with `uvicorn app.main:app --reload`.
2. Open `http://127.0.0.1:8000/docs`.
3. Authorize with `Bearer <access_token>`.
4. Create a product or use an existing one.
5. Test add, get, update, and delete under the `cart` tag.

Postman cart flow:

1. Login with `POST /api/v1/auth/login`.
2. Save `access_token` as `token`.
3. Set `Authorization: Bearer {{token}}`.
4. Add an item with `POST /api/v1/cart/add`.
5. Read the cart with `GET /api/v1/cart/`.
6. Update quantity with `PUT /api/v1/cart/{item_id}`.
7. Remove the item with `DELETE /api/v1/cart/{item_id}`.
