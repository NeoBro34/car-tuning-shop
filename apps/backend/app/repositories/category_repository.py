from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate


class CategoryRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, category_id: int) -> Category | None:
        return self.db.get(Category, category_id)

    def get_by_name(self, name: str) -> Category | None:
        statement = select(Category).where(func.lower(Category.name) == name.lower())
        return self.db.scalar(statement)

    def get_by_slug(self, slug: str) -> Category | None:
        statement = select(Category).where(Category.slug == slug)
        return self.db.scalar(statement)

    def list(self, limit: int, offset: int, search: str | None = None) -> list[Category]:
        statement = select(Category).order_by(Category.name)
        if search:
            pattern = f"%{search.strip().lower()}%"
            statement = statement.where(
                func.lower(Category.name).like(pattern)
                | func.lower(Category.slug).like(pattern)
            )
        statement = statement.limit(limit).offset(offset)
        return list(self.db.scalars(statement))

    def count(self, search: str | None = None) -> int:
        statement = select(func.count()).select_from(Category)
        if search:
            pattern = f"%{search.strip().lower()}%"
            statement = statement.where(
                func.lower(Category.name).like(pattern)
                | func.lower(Category.slug).like(pattern)
            )
        return self.db.scalar(statement) or 0

    def create(self, payload: CategoryCreate, slug: str) -> Category:
        category = Category(
            name=payload.name,
            slug=slug,
            description=payload.description,
            is_active=payload.is_active,
        )
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def update(self, category: Category, data: dict[str, object]) -> Category:
        for field, value in data.items():
            setattr(category, field, value)
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category: Category) -> None:
        self.db.delete(category)
        self.db.commit()
