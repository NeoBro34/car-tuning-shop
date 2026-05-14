from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.car_model import CarModel
from app.schemas.car_model import CarModelCreate


class CarModelRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, car_model_id: int) -> CarModel | None:
        return self.db.get(CarModel, car_model_id)

    def get_by_brand_and_slug(self, brand_id: int, slug: str) -> CarModel | None:
        statement = select(CarModel).where(
            CarModel.brand_id == brand_id,
            CarModel.slug == slug,
        )
        return self.db.scalar(statement)

    def list(self, limit: int, offset: int, brand_id: int | None = None) -> list[CarModel]:
        statement = select(CarModel).order_by(CarModel.id)
        if brand_id is not None:
            statement = statement.where(CarModel.brand_id == brand_id)
        statement = statement.limit(limit).offset(offset)
        return list(self.db.scalars(statement))

    def count(self, brand_id: int | None = None) -> int:
        statement = select(func.count()).select_from(CarModel)
        if brand_id is not None:
            statement = statement.where(CarModel.brand_id == brand_id)
        return self.db.scalar(statement) or 0

    def create(self, payload: CarModelCreate, slug: str) -> CarModel:
        car_model = CarModel(
            brand_id=payload.brand_id,
            name=payload.name,
            slug=slug,
            year_start=payload.year_start,
            year_end=payload.year_end,
            is_active=payload.is_active,
        )
        self.db.add(car_model)
        self.db.commit()
        self.db.refresh(car_model)
        return car_model

    def update(self, car_model: CarModel, data: dict[str, object]) -> CarModel:
        for field, value in data.items():
            setattr(car_model, field, value)
        self.db.commit()
        self.db.refresh(car_model)
        return car_model

    def delete(self, car_model: CarModel) -> None:
        self.db.delete(car_model)
        self.db.commit()

