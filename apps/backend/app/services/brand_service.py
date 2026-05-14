from fastapi import HTTPException, status

from app.models.brand import Brand
from app.repositories.brand_repository import BrandRepository
from app.schemas.brand import BrandCreate, BrandListResponse, BrandUpdate
from app.schemas.common import ListMeta
from app.services.slug import slugify


class BrandService:
    def __init__(self, brands: BrandRepository) -> None:
        self.brands = brands

    def list_brands(self, limit: int, offset: int) -> BrandListResponse:
        items = self.brands.list(limit=limit, offset=offset)
        total = self.brands.count()
        return BrandListResponse(
            items=items,
            meta=ListMeta(total=total, limit=limit, offset=offset),
        )

    def get_brand(self, brand_id: int) -> Brand:
        brand = self.brands.get_by_id(brand_id)
        if brand is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Brand not found",
            )
        return brand

    def create_brand(self, payload: BrandCreate) -> Brand:
        slug = payload.slug or slugify(payload.name)
        self._ensure_unique(name=payload.name, slug=slug)
        return self.brands.create(payload, slug)

    def update_brand(self, brand_id: int, payload: BrandUpdate) -> Brand:
        brand = self.get_brand(brand_id)
        data = payload.model_dump(exclude_unset=True)

        if "name" in data or "slug" in data:
            candidate_name = str(data.get("name", brand.name))
            candidate_slug = data.get("slug") or slugify(candidate_name)
            data["slug"] = candidate_slug
            self._ensure_unique(
                name=candidate_name,
                slug=str(candidate_slug),
                current_id=brand.id,
            )

        return self.brands.update(brand, data)

    def delete_brand(self, brand_id: int) -> None:
        brand = self.get_brand(brand_id)
        self.brands.delete(brand)

    def _ensure_unique(
        self,
        name: str,
        slug: str,
        current_id: int | None = None,
    ) -> None:
        existing_name = self.brands.get_by_name(name)
        if existing_name is not None and existing_name.id != current_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Brand with this name already exists",
            )

        existing_slug = self.brands.get_by_slug(slug)
        if existing_slug is not None and existing_slug.id != current_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Brand with this slug already exists",
            )

