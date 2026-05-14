from __future__ import annotations

from decimal import Decimal

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.product import Product, ProductImage
from app.schemas.product import ProductCreate


class ProductRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, product_id: int) -> Product | None:
        statement = (
            select(Product)
            .options(selectinload(Product.images))
            .where(Product.id == product_id)
        )
        return self.db.scalar(statement)

    def get_by_slug(self, slug: str) -> Product | None:
        statement = (
            select(Product)
            .options(selectinload(Product.images))
            .where(Product.slug == slug)
        )
        return self.db.scalar(statement)

    def get_by_sku(self, sku: str) -> Product | None:
        statement = select(Product).where(func.lower(Product.sku) == sku.lower())
        return self.db.scalar(statement)

    def list(
        self,
        limit: int,
        offset: int,
        search: str | None = None,
        category_id: int | None = None,
        brand_id: int | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
    ) -> list[Product]:
        statement = self._filtered_statement(
            search=search,
            category_id=category_id,
            brand_id=brand_id,
            min_price=min_price,
            max_price=max_price,
        )
        statement = (
            statement.options(selectinload(Product.images))
            .order_by(Product.id)
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(statement))

    def count(
        self,
        search: str | None = None,
        category_id: int | None = None,
        brand_id: int | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
    ) -> int:
        statement = select(func.count()).select_from(Product)
        statement = self._apply_filters(
            statement,
            search=search,
            category_id=category_id,
            brand_id=brand_id,
            min_price=min_price,
            max_price=max_price,
        )
        return self.db.scalar(statement) or 0

    def create(self, payload: ProductCreate, slug: str) -> Product:
        product = Product(
            name=payload.name,
            slug=slug,
            description=payload.description,
            price=payload.price,
            discount_price=payload.discount_price,
            stock_quantity=payload.stock_quantity,
            sku=payload.sku,
            category_id=payload.category_id,
            brand_id=payload.brand_id,
        )
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update(self, product: Product, data: dict[str, object]) -> Product:
        for field, value in data.items():
            setattr(product, field, value)
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete(self, product: Product) -> None:
        self.db.delete(product)
        self.db.commit()

    def add_images(
        self,
        product: Product,
        image_urls: list[str],
        main_index: int | None = None,
    ) -> Product:
        if main_index is not None:
            for image in product.images:
                image.is_main = False

        for index, image_url in enumerate(image_urls):
            self.db.add(
                ProductImage(
                    product_id=product.id,
                    image_url=image_url,
                    is_main=main_index == index,
                )
            )

        self.db.commit()
        self.db.refresh(product)
        return self.get_by_id(product.id) or product

    def set_main_image(self, product: Product, image_id: int) -> ProductImage | None:
        image = self._get_product_image(product.id, image_id)
        if image is None:
            return None

        for product_image in product.images:
            product_image.is_main = product_image.id == image_id

        self.db.commit()
        self.db.refresh(image)
        return image

    def delete_image(self, product: Product, image_id: int) -> ProductImage | None:
        image = self._get_product_image(product.id, image_id)
        if image is None:
            return None

        self.db.delete(image)
        self.db.commit()
        return image

    def _get_product_image(self, product_id: int, image_id: int) -> ProductImage | None:
        statement = select(ProductImage).where(
            ProductImage.id == image_id,
            ProductImage.product_id == product_id,
        )
        return self.db.scalar(statement)

    def _filtered_statement(
        self,
        search: str | None,
        category_id: int | None,
        brand_id: int | None,
        min_price: Decimal | None,
        max_price: Decimal | None,
    ):
        statement = select(Product)
        return self._apply_filters(
            statement,
            search=search,
            category_id=category_id,
            brand_id=brand_id,
            min_price=min_price,
            max_price=max_price,
        )

    def _apply_filters(
        self,
        statement,
        search: str | None,
        category_id: int | None,
        brand_id: int | None,
        min_price: Decimal | None,
        max_price: Decimal | None,
    ):
        if search:
            pattern = f"%{search.strip().lower()}%"
            statement = statement.where(
                or_(
                    func.lower(Product.name).like(pattern),
                    func.lower(Product.description).like(pattern),
                    func.lower(Product.sku).like(pattern),
                )
            )
        if category_id is not None:
            statement = statement.where(Product.category_id == category_id)
        if brand_id is not None:
            statement = statement.where(Product.brand_id == brand_id)
        if min_price is not None:
            statement = statement.where(Product.price >= min_price)
        if max_price is not None:
            statement = statement.where(Product.price <= max_price)
        return statement
