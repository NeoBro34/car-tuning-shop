from fastapi import HTTPException, status

from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.repositories.admin_repository import AdminRepository
from app.schemas.admin import (
    AdminDashboardResponse,
    AdminOrderListResponse,
    AdminOrderStatusUpdate,
    AdminProductActiveUpdate,
    AdminProductStockUpdate,
    AdminUserListResponse,
)
from app.schemas.common import ListMeta
from app.schemas.user import UserRole


class AdminService:
    def __init__(self, admin: AdminRepository) -> None:
        self.admin = admin

    def dashboard(self) -> AdminDashboardResponse:
        return AdminDashboardResponse(
            total_users=self.admin.total_users(),
            total_products=self.admin.total_products(),
            total_orders=self.admin.total_orders(),
            total_revenue=self.admin.total_revenue(),
        )

    def list_users(self, limit: int, offset: int) -> AdminUserListResponse:
        items = self.admin.list_users(limit=limit, offset=offset)
        total = self.admin.count_users()
        return AdminUserListResponse(
            items=items,
            meta=ListMeta(total=total, limit=limit, offset=offset),
        )

    def get_user(self, user_id: int) -> User:
        user = self.admin.get_user(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    def block_user(self, user_id: int, current_admin: User) -> User:
        user = self.get_user(user_id)
        if user.id == current_admin.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Admin cannot block their own account",
            )
        if user.role == UserRole.SUPER_ADMIN.value and current_admin.role != UserRole.SUPER_ADMIN.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only super admin can block a super admin",
            )
        return self.admin.set_user_active(user, False)

    def unblock_user(self, user_id: int) -> User:
        user = self.get_user(user_id)
        return self.admin.set_user_active(user, True)

    def list_orders(self, limit: int, offset: int) -> AdminOrderListResponse:
        items = self.admin.list_orders(limit=limit, offset=offset)
        total = self.admin.count_orders()
        return AdminOrderListResponse(
            items=items,
            meta=ListMeta(total=total, limit=limit, offset=offset),
        )

    def update_order_status(
        self,
        order_id: int,
        payload: AdminOrderStatusUpdate,
    ) -> Order:
        order = self.admin.get_order(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )
        return self.admin.update_order_status(order, payload.status)

    def update_product_stock(
        self,
        product_id: int,
        payload: AdminProductStockUpdate,
    ) -> Product:
        product = self._get_product(product_id)
        return self.admin.update_product_stock(product, payload.stock_quantity)

    def set_product_active(
        self,
        product_id: int,
        payload: AdminProductActiveUpdate,
    ) -> Product:
        product = self._get_product(product_id)
        return self.admin.set_product_active(product, payload.is_active)

    def delete_product(self, product_id: int) -> None:
        product = self._get_product(product_id)
        self.admin.delete_product(product)

    def _get_product(self, product_id: int) -> Product:
        product = self.admin.get_product(product_id)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        return product
