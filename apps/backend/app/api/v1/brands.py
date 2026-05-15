from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import AdminUser
from app.core.database import get_db
from app.repositories.brand_repository import BrandRepository
from app.schemas.brand import (
    BrandCreate,
    BrandListResponse,
    BrandResponse,
    BrandUpdate,
)
from app.services.brand_service import BrandService

router = APIRouter()


def get_brand_service(db: Annotated[Session, Depends(get_db)]) -> BrandService:
    return BrandService(BrandRepository(db))


@router.get("", response_model=BrandListResponse)
def list_brands(
    service: Annotated[BrandService, Depends(get_brand_service)],
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
    search: Annotated[str | None, Query(min_length=1, max_length=120)] = None,
) -> BrandListResponse:
    return service.list_brands(limit=limit, offset=offset, search=search)


@router.get("/{brand_id}", response_model=BrandResponse)
def get_brand(
    brand_id: int,
    service: Annotated[BrandService, Depends(get_brand_service)],
) -> BrandResponse:
    return service.get_brand(brand_id)


@router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand(
    payload: BrandCreate,
    service: Annotated[BrandService, Depends(get_brand_service)],
    admin: AdminUser,
) -> BrandResponse:
    return service.create_brand(payload)


@router.put("/{brand_id}", response_model=BrandResponse)
def update_brand(
    brand_id: int,
    payload: BrandUpdate,
    service: Annotated[BrandService, Depends(get_brand_service)],
    admin: AdminUser,
) -> BrandResponse:
    return service.update_brand(brand_id, payload)


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brand(
    brand_id: int,
    service: Annotated[BrandService, Depends(get_brand_service)],
    admin: AdminUser,
) -> Response:
    service.delete_brand(brand_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
