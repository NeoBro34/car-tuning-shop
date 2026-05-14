from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderStatus


class AdminRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def total_users(self) -> int:
        return self.db.scalar(select(func.count()).select_from(User)) or 0

    def total_products(self) -> int:
        return self.db.scalar(select(func.count()).select_from(Product)) or 0

    def total_orders(self) -> int:
        return self.db.scalar(select(func.count()).select_from(Order)) or 0

    def total_revenue(self) -> Decimal:
        statement = select(func.coalesce(func.sum(Order.total_price), 0)).where(
            Order.status != OrderStatus.CANCELLED.value
        )
        return self.db.scalar(statement) or Decimal("0.00")

    def list_users(self, limit: int, offset: int) -> list[User]:
        statement = select(User).order_by(User.id).limit(limit).offset(offset)
        return list(self.db.scalars(statement))

    def count_users(self) -> int:
        return self.total_users()

    def get_user(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def set_user_active(self, user: User, is_active: bool) -> User:
        user.is_active = is_active
        self.db.commit()
        self.db.refresh(user)
        return user

    def list_orders(self, limit: int, offset: int) -> list[Order]:
        statement = (
            select(Order)
            .options(selectinload(Order.items))
            .order_by(Order.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(statement))

    def count_orders(self) -> int:
        return self.total_orders()

    def get_order(self, order_id: int) -> Order | None:
        statement = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id)
        )
        return self.db.scalar(statement)

    def update_order_status(self, order: Order, status: OrderStatus) -> Order:
        order.status = status.value
        self.db.commit()
        self.db.refresh(order)
        return self.get_order(order.id) or order

    def get_product(self, product_id: int) -> Product | None:
        return self.db.get(Product, product_id)

    def update_product_stock(self, product: Product, stock_quantity: int) -> Product:
        product.stock_quantity = stock_quantity
        self.db.commit()
        self.db.refresh(product)
        return product

    def set_product_active(self, product: Product, is_active: bool) -> Product:
        product.is_active = is_active
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete_product(self, product: Product) -> None:
        self.db.delete(product)
        self.db.commit()
