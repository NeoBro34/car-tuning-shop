# AGENTS.md

## Project Name

Car Tuning Shop

## Project Goal

Build an online marketplace for selling car tuning parts and accessories.

The website must allow users to:

- browse tuning products
- filter by category, brand, car model, price
- view product details
- add products to cart
- place orders
- allow admin to manage products, categories, orders, and users

## Tech Stack

Frontend:

- NextJS
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod

Backend:

- FastAPI
- Python
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic
- JWT Authentication

Database:

- PostgreSQL

DevOps:

- Docker
- Docker Compose

## Architecture Rules

Use Clean Architecture.

Backend flow:
Route -> Service -> Repository -> Database

Rules:

- Routes must not contain business logic
- Services contain business logic
- Repositories handle database queries
- Schemas validate request and response data
- Models represent database tables

## Frontend Rules

Frontend must use:

- reusable components
- typed API services
- clean folder structure
- responsive design
- SEO-friendly pages

Main pages:

- Home
- Products
- Product Detail
- Cart
- Checkout
- Login
- Register
- Admin Dashboard

## Backend Rules

Backend must include:

- auth module
- users module
- categories module
- products module
- cart module
- orders module
- admin module

API must use versioning:

/api/v1/products
/api/v1/categories
/api/v1/orders

## Database Rules

Main tables:

- users
- categories
- brands
- car_models
- products
- product_images
- cart_items
- orders
- order_items

## Testing Rules

Every important backend service must have tests.

Required tests:

- auth tests
- product tests
- order tests
- admin permission tests

## Security Rules

- Never commit .env
- Never expose secret keys
- Passwords must be hashed
- Admin routes must be protected
- Validate all user input

## Definition of Done

A feature is complete only if:

- code works
- tests pass
- API response is typed
- frontend page works
- documentation is updated
