from decimal import Decimal

from fastapi import HTTPException, status

from app.models.cart_item import CartItem
from app.models.product import Product
from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.cart import CartItemAdd, CartItemResponse, CartResponse, CartItemUpdate


class CartService:
    def __init__(
        self,
        cart_items: CartRepository,
        products: ProductRepository,
    ) -> None:
        self.cart_items = cart_items
        self.products = products

    def get_cart(self, user_id: int) -> CartResponse:
        items = self.cart_items.get_user_cart(user_id)
        return self._build_cart_response(items)

    def add_to_cart(self, user_id: int, payload: CartItemAdd) -> CartResponse:
        product = self._get_product(payload.product_id)
        existing_item = self.cart_items.get_by_product_for_user(product.id, user_id)
        new_quantity = payload.quantity

        if existing_item is not None:
            new_quantity += existing_item.quantity

        self._validate_stock(product, new_quantity)

        if existing_item is None:
            self.cart_items.create(user_id, product.id, payload.quantity)
        else:
            self.cart_items.update_quantity(existing_item, new_quantity)

        return self.get_cart(user_id)

    def update_item(
        self,
        user_id: int,
        item_id: int,
        payload: CartItemUpdate,
    ) -> CartResponse:
        item = self._get_cart_item(user_id, item_id)
        self._validate_stock(item.product, payload.quantity)
        self.cart_items.update_quantity(item, payload.quantity)
        return self.get_cart(user_id)

    def remove_item(self, user_id: int, item_id: int) -> CartResponse:
        item = self._get_cart_item(user_id, item_id)
        self.cart_items.delete(item)
        return self.get_cart(user_id)

    def _get_product(self, product_id: int) -> Product:
        product = self.products.get_by_id(product_id)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        return product

    def _get_cart_item(self, user_id: int, item_id: int) -> CartItem:
        item = self.cart_items.get_by_id_for_user(item_id, user_id)
        if item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cart item not found",
            )
        return item

    def _validate_stock(self, product: Product, quantity: int) -> None:
        if quantity > product.stock_quantity:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Requested quantity exceeds product stock",
            )

    def _build_cart_response(self, items: list[CartItem]) -> CartResponse:
        response_items: list[CartItemResponse] = []
        subtotal = Decimal("0.00")
        total_items = 0

        for item in items:
            unit_price = item.product.discount_price or item.product.price
            line_subtotal = unit_price * item.quantity
            subtotal += line_subtotal
            total_items += item.quantity
            response_items.append(
                CartItemResponse(
                    id=item.id,
                    user_id=item.user_id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    created_at=item.created_at,
                    product=item.product,
                    line_subtotal=line_subtotal,
                )
            )

        return CartResponse(
            items=response_items,
            subtotal=subtotal,
            total_items=total_items,
        )
