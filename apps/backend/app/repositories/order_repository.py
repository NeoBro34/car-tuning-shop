from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.cart_item import CartItem
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderStatus


class OrderRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_for_user(self, user_id: int, limit: int, offset: int) -> list[Order]:
        statement = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.user_id == user_id)
            .order_by(Order.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(statement))

    def count_for_user(self, user_id: int) -> int:
        statement = select(func.count()).select_from(Order).where(Order.user_id == user_id)
        return self.db.scalar(statement) or 0

    def get_by_id(self, order_id: int) -> Order | None:
        statement = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id)
        )
        return self.db.scalar(statement)

    def create_from_cart(
        self,
        user_id: int,
        payload: OrderCreate,
        cart_items: list[CartItem],
        total_price: Decimal,
    ) -> Order:
        order = Order(
            user_id=user_id,
            status=OrderStatus.PENDING.value,
            total_price=total_price,
            customer_name=payload.customer_name,
            phone_number=payload.phone_number,
            address=payload.address,
        )
        self.db.add(order)
        self.db.flush()

        for cart_item in cart_items:
            product = cart_item.product
            price = product.discount_price or product.price
            subtotal = price * cart_item.quantity
            product.stock_quantity -= cart_item.quantity
            self.db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=cart_item.product_id,
                    quantity=cart_item.quantity,
                    price=price,
                    subtotal=subtotal,
                )
            )
            self.db.delete(cart_item)

        self.db.commit()
        return self.get_by_id(order.id) or order

    def update_status(self, order: Order, status: OrderStatus) -> Order:
        order.status = status.value
        self.db.commit()
        self.db.refresh(order)
        return self.get_by_id(order.id) or order
