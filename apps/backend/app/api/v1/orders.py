from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import AdminUser, CurrentUser
from app.core.database import get_db
from app.repositories.cart_repository import CartRepository
from app.repositories.order_repository import OrderRepository
from app.schemas.order import (
    OrderCreate,
    OrderListResponse,
    OrderResponse,
    OrderStatusUpdate,
)
from app.services.order_service import OrderService

router = APIRouter()


def get_order_service(db: Annotated[Session, Depends(get_db)]) -> OrderService:
    return OrderService(OrderRepository(db), CartRepository(db))


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    service: Annotated[OrderService, Depends(get_order_service)],
    current_user: CurrentUser,
) -> OrderResponse:
    return service.create_order(current_user.id, payload)


@router.get("", response_model=OrderListResponse)
def list_orders(
    service: Annotated[OrderService, Depends(get_order_service)],
    current_user: CurrentUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> OrderListResponse:
    return service.list_orders(current_user.id, limit=limit, offset=offset)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    service: Annotated[OrderService, Depends(get_order_service)],
    current_user: CurrentUser,
) -> OrderResponse:
    return service.get_order(order_id, current_user)


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    service: Annotated[OrderService, Depends(get_order_service)],
    admin: AdminUser,
) -> OrderResponse:
    return service.update_status(order_id, payload)
