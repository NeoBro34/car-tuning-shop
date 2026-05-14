# Car Tuning Shop Backend

Phase 1 implements FastAPI auth and users modules with SQLAlchemy, Alembic,
Pydantic schemas, service layer, repository layer, password hashing, and JWT.
Phase 2 adds categories, brands, and car models CRUD APIs with admin-only
write endpoints and paginated list responses.
Phase 3 adds products, product images, filters, local image uploads, and
static file serving.
Phase 4 adds authenticated cart management with stock validation and cart
totals.
Phase 5 adds checkout orders, order items, stock decrement, order history,
order details, and admin order status updates.
Phase 6 adds admin dashboard, role-based access control, admin user/order/product
management, and user blocking.

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

## Phase 5 orders

Authenticated order endpoints:

- `POST /api/v1/orders`
- `GET /api/v1/orders?limit=20&offset=0`
- `GET /api/v1/orders/{order_id}`

Admin-only endpoint:

- `PUT /api/v1/orders/{order_id}/status`

Example checkout body:

```json
{
  "customer_name": "Ali Valiyev",
  "phone_number": "+998901234567",
  "address": "Tashkent, Amir Temur street 1"
}
```

Example status update body:

```json
{
  "status": "CONFIRMED"
}
```

Supported statuses:

```text
PENDING
CONFIRMED
SHIPPED
DELIVERED
CANCELLED
```

Checkout creates an order from the current user's cart, moves cart items into
`order_items`, calculates `total_price`, decreases product stock, and clears
the cart after a successful transaction. Checkout fails if any cart quantity is
above current product stock.

Swagger checkout flow:

1. Start the API with `uvicorn app.main:app --reload`.
2. Open `http://127.0.0.1:8000/docs`.
3. Authorize with `Bearer <customer_access_token>`.
4. Add product to cart with `POST /api/v1/cart/add`.
5. Create order with `POST /api/v1/orders`.
6. Check order history and detail with `GET /api/v1/orders`.
7. Authorize as admin and update status with `PUT /api/v1/orders/{order_id}/status`.

Postman order flow:

1. Login as customer and set `Authorization: Bearer {{customer_token}}`.
2. Add a product to cart.
3. Send `POST /api/v1/orders` with checkout body.
4. Verify `total_price`, `items`, and `status = PENDING`.
5. Verify cart is empty with `GET /api/v1/cart/`.
6. Verify product stock decreased with `GET /api/v1/products/{product_id}`.
7. Login as admin and set `Authorization: Bearer {{admin_token}}`.
8. Update status with `PUT /api/v1/orders/{order_id}/status`.

## Phase 6 admin

Admin roles:

```text
USER
ADMIN
SUPER_ADMIN
```

Admin-only endpoints:

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/{user_id}`
- `PUT /api/v1/admin/users/{user_id}/block`
- `PUT /api/v1/admin/users/{user_id}/unblock`
- `GET /api/v1/admin/orders`
- `PUT /api/v1/admin/orders/{order_id}/status`
- `PUT /api/v1/admin/products/{product_id}/stock`
- `PUT /api/v1/admin/products/{product_id}/active`
- `DELETE /api/v1/admin/products/{product_id}`

Create an admin user locally:

```bash
cd apps/backend
source venv/bin/activate
python - <<'PY'
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User

db = SessionLocal()
try:
    admin = User(
        email="admin@example.com",
        full_name="Admin User",
        hashed_password=hash_password("strongpass123"),
        role="ADMIN",
        is_active=True,
    )
    db.add(admin)
    db.commit()
finally:
    db.close()
PY
```

Swagger admin test flow:

1. Run migrations with `alembic upgrade head`.
2. Start API with `uvicorn app.main:app --reload`.
3. Login as admin and authorize Swagger with `Bearer <admin_access_token>`.
4. Open the `admin` tag and test dashboard, users, orders, and stock endpoints.
5. Login as a normal user and verify admin endpoints return `403`.

Postman admin flow:

1. Login as admin and save `access_token` as `admin_token`.
2. Set `Authorization: Bearer {{admin_token}}`.
3. Call `GET /api/v1/admin/dashboard`.
4. List users and block/unblock with `/api/v1/admin/users/{id}/block`.
5. List all orders and update status with `/api/v1/admin/orders/{id}/status`.
6. Update product stock with `/api/v1/admin/products/{id}/stock`.
