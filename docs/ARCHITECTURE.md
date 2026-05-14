# Architecture

## System Overview

Frontend communicates with backend using REST API.

Frontend:
NextJS -> API Client -> FastAPI

Backend:
FastAPI -> Service Layer -> Repository Layer -> PostgreSQL

## Backend Structure

apps/backend/
├── app/
│ ├── api/
│ │ └── v1/
│ ├── core/
│ ├── models/
│ ├── schemas/
│ ├── services/
│ ├── repositories/
│ └── main.py

## Frontend Structure

apps/frontend/
├── app/
├── components/
├── features/
├── services/
├── types/
└── lib/

## Main Modules

- Auth
- Users
- Categories
- Brands
- Car Models
- Products
- Cart
- Orders
- Admin

## API Example

GET /api/v1/products
GET /api/v1/products/{id}
POST /api/v1/cart
POST /api/v1/orders
POST /api/v1/admin/products
