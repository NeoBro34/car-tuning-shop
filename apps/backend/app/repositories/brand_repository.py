from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.brand import Brand
from app.schemas.brand import BrandCreate


class BrandRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, brand_id: int) -> Brand | None:
        return self.db.get(Brand, brand_id)

    def get_by_name(self, name: str) -> Brand | None:
        statement = select(Brand).where(func.lower(Brand.name) == name.lower())
        return self.db.scalar(statement)

    def get_by_slug(self, slug: str) -> Brand | None:
        statement = select(Brand).where(Brand.slug == slug)
        return self.db.scalar(statement)

    def list(self, limit: int, offset: int) -> list[Brand]:
        statement = select(Brand).order_by(Brand.id).limit(limit).offset(offset)
        return list(self.db.scalars(statement))

    def count(self) -> int:
        return self.db.scalar(select(func.count()).select_from(Brand)) or 0

    def create(self, payload: BrandCreate, slug: str) -> Brand:
        brand = Brand(
            name=payload.name,
            slug=slug,
            description=payload.description,
            is_active=payload.is_active,
        )
        self.db.add(brand)
        self.db.commit()
        self.db.refresh(brand)
        return brand

    def update(self, brand: Brand, data: dict[str, object]) -> Brand:
        for field, value in data.items():
            setattr(brand, field, value)
        self.db.commit()
        self.db.refresh(brand)
        return brand

    def delete(self, brand: Brand) -> None:
        self.db.delete(brand)
        self.db.commit()

