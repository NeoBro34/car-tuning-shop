from decimal import Decimal

from pydantic import BaseModel, Field

from app.schemas.common import ListMeta
from app.schemas.order import OrderResponse, OrderStatus
from app.schemas.user import UserResponse


class AdminDashboardResponse(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: Decimal


class AdminUserListResponse(BaseModel):
    items: list[UserResponse]
    meta: ListMeta


class AdminOrderListResponse(BaseModel):
    items: list[OrderResponse]
    meta: ListMeta


class AdminProductStockUpdate(BaseModel):
    stock_quantity: int = Field(ge=0)


class AdminProductActiveUpdate(BaseModel):
    is_active: bool


class AdminOrderStatusUpdate(BaseModel):
    status: OrderStatus
