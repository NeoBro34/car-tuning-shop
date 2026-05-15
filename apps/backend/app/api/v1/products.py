from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, Response, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import AdminUser
from app.core.database import get_db
from app.repositories.brand_repository import BrandRepository
from app.repositories.car_model_repository import CarModelRepository
from app.repositories.category_repository import CategoryRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.product import (
    ProductCreate,
    ProductImageResponse,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)
from app.services.product_service import ProductService

router = APIRouter()


def get_product_service(db: Annotated[Session, Depends(get_db)]) -> ProductService:
    return ProductService(
        ProductRepository(db),
        CategoryRepository(db),
        BrandRepository(db),
        CarModelRepository(db),
    )


@router.get("", response_model=ProductListResponse)
def list_products(
    service: Annotated[ProductService, Depends(get_product_service)],
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
    search: Annotated[str | None, Query(min_length=1, max_length=120)] = None,
    category_id: Annotated[int | None, Query(gt=0)] = None,
    brand_id: Annotated[int | None, Query(gt=0)] = None,
    car_model_id: Annotated[int | None, Query(gt=0)] = None,
    min_price: Annotated[Decimal | None, Query(ge=0)] = None,
    max_price: Annotated[Decimal | None, Query(ge=0)] = None,
) -> ProductListResponse:
    return service.list_products(
        limit=limit,
        offset=offset,
        search=search,
        category_id=category_id,
        brand_id=brand_id,
        car_model_id=car_model_id,
        min_price=min_price,
        max_price=max_price,
    )


@router.get("/slug/{slug}", response_model=ProductResponse)
def get_product_by_slug(
    slug: str,
    service: Annotated[ProductService, Depends(get_product_service)],
) -> ProductResponse:
    return service.get_product_by_slug(slug)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    service: Annotated[ProductService, Depends(get_product_service)],
) -> ProductResponse:
    return service.get_product(product_id)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    service: Annotated[ProductService, Depends(get_product_service)],
    admin: AdminUser,
) -> ProductResponse:
    return service.create_product(payload)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    service: Annotated[ProductService, Depends(get_product_service)],
    admin: AdminUser,
) -> ProductResponse:
    return service.update_product(product_id, payload)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    service: Annotated[ProductService, Depends(get_product_service)],
    admin: AdminUser,
) -> Response:
    service.delete_product(product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{product_id}/images", response_model=ProductResponse)
def upload_product_images(
    product_id: int,
    service: Annotated[ProductService, Depends(get_product_service)],
    admin: AdminUser,
    files: Annotated[list[UploadFile], File()],
    main_index: Annotated[int | None, Query(ge=0)] = None,
) -> ProductResponse:
    return service.upload_images(product_id, files, main_index)


@router.put(
    "/{product_id}/images/{image_id}/main",
    response_model=ProductImageResponse,
)
def set_main_product_image(
    product_id: int,
    image_id: int,
    service: Annotated[ProductService, Depends(get_product_service)],
    admin: AdminUser,
) -> ProductImageResponse:
    return service.set_main_image(product_id, image_id)


@router.delete("/{product_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_image(
    product_id: int,
    image_id: int,
    service: Annotated[ProductService, Depends(get_product_service)],
    admin: AdminUser,
) -> Response:
    service.delete_image(product_id, image_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
