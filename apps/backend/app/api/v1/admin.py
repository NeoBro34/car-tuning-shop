from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import AdminUser
from app.core.database import get_db
from app.repositories.admin_repository import AdminRepository
from app.schemas.admin import (
    AdminDashboardResponse,
    AdminOrderListResponse,
    AdminOrderStatusUpdate,
    AdminProductActiveUpdate,
    AdminProductStockUpdate,
    AdminUserListResponse,
)
from app.schemas.order import OrderResponse
from app.schemas.product import ProductResponse
from app.schemas.user import UserResponse
from app.services.admin_service import AdminService

router = APIRouter()


def get_admin_service(db: Annotated[Session, Depends(get_db)]) -> AdminService:
    return AdminService(AdminRepository(db))


@router.get("/dashboard", response_model=AdminDashboardResponse)
def get_dashboard(
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
) -> AdminDashboardResponse:
    return service.dashboard()


@router.get("/users", response_model=AdminUserListResponse)
def list_users(
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> AdminUserListResponse:
    return service.list_users(limit=limit, offset=offset)


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
) -> UserResponse:
    return service.get_user(user_id)


@router.put("/users/{user_id}/block", response_model=UserResponse)
def block_user(
    user_id: int,
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
) -> UserResponse:
    return service.block_user(user_id, admin)


@router.put("/users/{user_id}/unblock", response_model=UserResponse)
def unblock_user(
    user_id: int,
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
) -> UserResponse:
    return service.unblock_user(user_id)


@router.get("/orders", response_model=AdminOrderListResponse)
def list_orders(
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> AdminOrderListResponse:
    return service.list_orders(limit=limit, offset=offset)


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    payload: AdminOrderStatusUpdate,
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
) -> OrderResponse:
    return service.update_order_status(order_id, payload)


@router.put("/products/{product_id}/stock", response_model=ProductResponse)
def update_product_stock(
    product_id: int,
    payload: AdminProductStockUpdate,
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
) -> ProductResponse:
    return service.update_product_stock(product_id, payload)


@router.put("/products/{product_id}/active", response_model=ProductResponse)
def set_product_active(
    product_id: int,
    payload: AdminProductActiveUpdate,
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
) -> ProductResponse:
    return service.set_product_active(product_id, payload)


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    service: Annotated[AdminService, Depends(get_admin_service)],
    admin: AdminUser,
) -> Response:
    service.delete_product(product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
