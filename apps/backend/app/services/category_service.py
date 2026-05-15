from fastapi import HTTPException, status

from app.models.category import Category
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryListResponse, CategoryUpdate
from app.schemas.common import ListMeta
from app.services.slug import slugify


class CategoryService:
    def __init__(self, categories: CategoryRepository) -> None:
        self.categories = categories

    def list_categories(
        self,
        limit: int,
        offset: int,
        search: str | None = None,
    ) -> CategoryListResponse:
        items = self.categories.list(limit=limit, offset=offset, search=search)
        total = self.categories.count(search=search)
        return CategoryListResponse(
            items=items,
            meta=ListMeta(total=total, limit=limit, offset=offset),
        )

    def get_category(self, category_id: int) -> Category:
        category = self.categories.get_by_id(category_id)
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        return category

    def create_category(self, payload: CategoryCreate) -> Category:
        slug = payload.slug or slugify(payload.name)
        self._ensure_unique(name=payload.name, slug=slug)
        return self.categories.create(payload, slug)

    def update_category(self, category_id: int, payload: CategoryUpdate) -> Category:
        category = self.get_category(category_id)
        data = payload.model_dump(exclude_unset=True)

        if "name" in data or "slug" in data:
            candidate_name = str(data.get("name", category.name))
            candidate_slug = data.get("slug") or slugify(candidate_name)
            data["slug"] = candidate_slug
            self._ensure_unique(
                name=candidate_name,
                slug=str(candidate_slug),
                current_id=category.id,
            )

        return self.categories.update(category, data)

    def delete_category(self, category_id: int) -> None:
        category = self.get_category(category_id)
        self.categories.delete(category)

    def _ensure_unique(
        self,
        name: str,
        slug: str,
        current_id: int | None = None,
    ) -> None:
        existing_name = self.categories.get_by_name(name)
        if existing_name is not None and existing_name.id != current_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category with this name already exists",
            )

        existing_slug = self.categories.get_by_slug(slug)
        if existing_slug is not None and existing_slug.id != current_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category with this slug already exists",
            )
