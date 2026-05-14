from decimal import Decimal

from fastapi import HTTPException, status

from app.models.cart_item import CartItem
from app.models.order import Order
from app.models.user import User
from app.repositories.cart_repository import CartRepository
from app.repositories.order_repository import OrderRepository
from app.schemas.common import ListMeta
from app.schemas.order import (
    OrderCreate,
    OrderListResponse,
    OrderStatusUpdate,
)
from app.schemas.user import UserRole


class OrderService:
    def __init__(
        self,
        orders: OrderRepository,
        cart_items: CartRepository,
    ) -> None:
        self.orders = orders
        self.cart_items = cart_items

    def create_order(self, user_id: int, payload: OrderCreate) -> Order:
        cart_items = self.cart_items.get_user_cart(user_id)
        if not cart_items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cart is empty",
            )

        self._validate_stock(cart_items)
        total_price = self._calculate_total(cart_items)
        return self.orders.create_from_cart(user_id, payload, cart_items, total_price)

    def list_orders(self, user_id: int, limit: int, offset: int) -> OrderListResponse:
        items = self.orders.list_for_user(user_id, limit=limit, offset=offset)
        total = self.orders.count_for_user(user_id)
        return OrderListResponse(
            items=items,
            meta=ListMeta(total=total, limit=limit, offset=offset),
        )

    def get_order(self, order_id: int, current_user: User) -> Order:
        order = self.orders.get_by_id(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )
        admin_roles = {UserRole.ADMIN.value, UserRole.SUPER_ADMIN.value, "admin"}
        if order.user_id != current_user.id and current_user.role not in admin_roles:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )
        return order

    def update_status(self, order_id: int, payload: OrderStatusUpdate) -> Order:
        order = self.orders.get_by_id(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )
        return self.orders.update_status(order, payload.status)

    def _validate_stock(self, cart_items: list[CartItem]) -> None:
        for item in cart_items:
            if item.quantity > item.product.stock_quantity:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Insufficient stock for product {item.product_id}",
                )

    def _calculate_total(self, cart_items: list[CartItem]) -> Decimal:
        total = Decimal("0.00")
        for item in cart_items:
            price = item.product.discount_price or item.product.price
            total += price * item.quantity
        return total
