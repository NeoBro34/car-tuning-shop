from fastapi import HTTPException, status

from app.models.car_model import CarModel
from app.repositories.brand_repository import BrandRepository
from app.repositories.car_model_repository import CarModelRepository
from app.schemas.car_model import (
    CarModelCreate,
    CarModelListResponse,
    CarModelUpdate,
)
from app.schemas.common import ListMeta
from app.services.slug import slugify


class CarModelService:
    def __init__(
        self,
        car_models: CarModelRepository,
        brands: BrandRepository,
    ) -> None:
        self.car_models = car_models
        self.brands = brands

    def list_car_models(
        self,
        limit: int,
        offset: int,
        brand_id: int | None = None,
        search: str | None = None,
    ) -> CarModelListResponse:
        items = self.car_models.list(
            limit=limit,
            offset=offset,
            brand_id=brand_id,
            search=search,
        )
        total = self.car_models.count(brand_id=brand_id, search=search)
        return CarModelListResponse(
            items=items,
            meta=ListMeta(total=total, limit=limit, offset=offset),
        )

    def get_car_model(self, car_model_id: int) -> CarModel:
        car_model = self.car_models.get_by_id(car_model_id)
        if car_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Car model not found",
            )
        return car_model

    def create_car_model(self, payload: CarModelCreate) -> CarModel:
        self._ensure_brand_exists(payload.brand_id)
        slug = payload.slug or slugify(payload.name)
        self._ensure_unique(brand_id=payload.brand_id, slug=slug)
        return self.car_models.create(payload, slug)

    def update_car_model(
        self,
        car_model_id: int,
        payload: CarModelUpdate,
    ) -> CarModel:
        car_model = self.get_car_model(car_model_id)
        data = payload.model_dump(exclude_unset=True)

        candidate_brand_id = int(data.get("brand_id", car_model.brand_id))
        if "brand_id" in data:
            self._ensure_brand_exists(candidate_brand_id)

        if "name" in data or "slug" in data or "brand_id" in data:
            candidate_name = str(data.get("name", car_model.name))
            candidate_slug = data.get("slug") or slugify(candidate_name)
            data["slug"] = candidate_slug
            self._ensure_unique(
                brand_id=candidate_brand_id,
                slug=str(candidate_slug),
                current_id=car_model.id,
            )

        candidate_year_start = data.get("year_start", car_model.year_start)
        candidate_year_end = data.get("year_end", car_model.year_end)
        if (
            candidate_year_start is not None
            and candidate_year_end is not None
            and int(candidate_year_end) < int(candidate_year_start)
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="year_end must be greater than or equal to year_start",
            )

        return self.car_models.update(car_model, data)

    def delete_car_model(self, car_model_id: int) -> None:
        car_model = self.get_car_model(car_model_id)
        self.car_models.delete(car_model)

    def _ensure_brand_exists(self, brand_id: int) -> None:
        if self.brands.get_by_id(brand_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Brand not found",
            )

    def _ensure_unique(
        self,
        brand_id: int,
        slug: str,
        current_id: int | None = None,
    ) -> None:
        existing = self.car_models.get_by_brand_and_slug(brand_id, slug)
        if existing is not None and existing.id != current_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Car model with this slug already exists for this brand",
            )
