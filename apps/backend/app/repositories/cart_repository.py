from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.cart_item import CartItem


class CartRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_user_cart(self, user_id: int) -> list[CartItem]:
        statement = (
            select(CartItem)
            .options(selectinload(CartItem.product))
            .where(CartItem.user_id == user_id)
            .order_by(CartItem.id)
        )
        return list(self.db.scalars(statement))

    def get_by_id_for_user(self, item_id: int, user_id: int) -> CartItem | None:
        statement = (
            select(CartItem)
            .options(selectinload(CartItem.product))
            .where(CartItem.id == item_id, CartItem.user_id == user_id)
        )
        return self.db.scalar(statement)

    def get_by_product_for_user(
        self,
        product_id: int,
        user_id: int,
    ) -> CartItem | None:
        statement = (
            select(CartItem)
            .options(selectinload(CartItem.product))
            .where(CartItem.product_id == product_id, CartItem.user_id == user_id)
        )
        return self.db.scalar(statement)

    def create(self, user_id: int, product_id: int, quantity: int) -> CartItem:
        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_quantity(self, item: CartItem, quantity: int) -> CartItem:
        item.quantity = quantity
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item: CartItem) -> None:
        self.db.delete(item)
        self.db.commit()
