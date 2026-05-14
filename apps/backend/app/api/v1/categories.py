from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import AdminUser
from app.core.database import get_db
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import (
    CategoryCreate,
    CategoryListResponse,
    CategoryResponse,
    CategoryUpdate,
)
from app.services.category_service import CategoryService

router = APIRouter()


def get_category_service(db: Annotated[Session, Depends(get_db)]) -> CategoryService:
    return CategoryService(CategoryRepository(db))


@router.get("", response_model=CategoryListResponse)
def list_categories(
    service: Annotated[CategoryService, Depends(get_category_service)],
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> CategoryListResponse:
    return service.list_categories(limit=limit, offset=offset)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: int,
    service: Annotated[CategoryService, Depends(get_category_service)],
) -> CategoryResponse:
    return service.get_category(category_id)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    service: Annotated[CategoryService, Depends(get_category_service)],
    admin: AdminUser,
) -> CategoryResponse:
    return service.create_category(payload)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    service: Annotated[CategoryService, Depends(get_category_service)],
    admin: AdminUser,
) -> CategoryResponse:
    return service.update_category(category_id, payload)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    service: Annotated[CategoryService, Depends(get_category_service)],
    admin: AdminUser,
) -> Response:
    service.delete_category(category_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

