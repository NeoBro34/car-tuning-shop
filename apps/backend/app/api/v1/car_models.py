from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import AdminUser
from app.core.database import get_db
from app.repositories.brand_repository import BrandRepository
from app.repositories.car_model_repository import CarModelRepository
from app.schemas.car_model import (
    CarModelCreate,
    CarModelListResponse,
    CarModelResponse,
    CarModelUpdate,
)
from app.services.car_model_service import CarModelService

router = APIRouter()


def get_car_model_service(db: Annotated[Session, Depends(get_db)]) -> CarModelService:
    return CarModelService(CarModelRepository(db), BrandRepository(db))


@router.get("", response_model=CarModelListResponse)
def list_car_models(
    service: Annotated[CarModelService, Depends(get_car_model_service)],
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
    brand_id: Annotated[int | None, Query(gt=0)] = None,
) -> CarModelListResponse:
    return service.list_car_models(limit=limit, offset=offset, brand_id=brand_id)


@router.get("/{car_model_id}", response_model=CarModelResponse)
def get_car_model(
    car_model_id: int,
    service: Annotated[CarModelService, Depends(get_car_model_service)],
) -> CarModelResponse:
    return service.get_car_model(car_model_id)


@router.post("", response_model=CarModelResponse, status_code=status.HTTP_201_CREATED)
def create_car_model(
    payload: CarModelCreate,
    service: Annotated[CarModelService, Depends(get_car_model_service)],
    admin: AdminUser,
) -> CarModelResponse:
    return service.create_car_model(payload)


@router.put("/{car_model_id}", response_model=CarModelResponse)
def update_car_model(
    car_model_id: int,
    payload: CarModelUpdate,
    service: Annotated[CarModelService, Depends(get_car_model_service)],
    admin: AdminUser,
) -> CarModelResponse:
    return service.update_car_model(car_model_id, payload)


@router.delete("/{car_model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car_model(
    car_model_id: int,
    service: Annotated[CarModelService, Depends(get_car_model_service)],
    admin: AdminUser,
) -> Response:
    service.delete_car_model(car_model_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

