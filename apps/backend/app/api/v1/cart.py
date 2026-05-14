from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser
from app.core.database import get_db
from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartResponse
from app.services.cart_service import CartService

router = APIRouter()


def get_cart_service(db: Annotated[Session, Depends(get_db)]) -> CartService:
    return CartService(CartRepository(db), ProductRepository(db))


@router.post("/add", response_model=CartResponse)
def add_to_cart(
    payload: CartItemAdd,
    service: Annotated[CartService, Depends(get_cart_service)],
    current_user: CurrentUser,
) -> CartResponse:
    return service.add_to_cart(current_user.id, payload)


@router.get("/", response_model=CartResponse)
def get_current_user_cart(
    service: Annotated[CartService, Depends(get_cart_service)],
    current_user: CurrentUser,
) -> CartResponse:
    return service.get_cart(current_user.id)


@router.put("/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    service: Annotated[CartService, Depends(get_cart_service)],
    current_user: CurrentUser,
) -> CartResponse:
    return service.update_item(current_user.id, item_id, payload)


@router.delete("/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: int,
    service: Annotated[CartService, Depends(get_cart_service)],
    current_user: CurrentUser,
) -> CartResponse:
    return service.remove_item(current_user.id, item_id)
