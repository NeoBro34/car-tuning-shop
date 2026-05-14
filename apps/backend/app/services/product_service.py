import shutil
from decimal import Decimal
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings
from app.models.product import Product, ProductImage
from app.repositories.brand_repository import BrandRepository
from app.repositories.category_repository import CategoryRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.common import ListMeta
from app.schemas.product import ProductCreate, ProductListResponse, ProductUpdate
from app.services.slug import slugify


class ProductService:
    def __init__(
        self,
        products: ProductRepository,
        categories: CategoryRepository,
        brands: BrandRepository,
    ) -> None:
        self.products = products
        self.categories = categories
        self.brands = brands

    def list_products(
        self,
        limit: int,
        offset: int,
        search: str | None,
        category_id: int | None,
        brand_id: int | None,
        min_price: Decimal | None,
        max_price: Decimal | None,
    ) -> ProductListResponse:
        if min_price is not None and max_price is not None and min_price > max_price:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="min_price must be less than or equal to max_price",
            )

        items = self.products.list(
            limit=limit,
            offset=offset,
            search=search,
            category_id=category_id,
            brand_id=brand_id,
            min_price=min_price,
            max_price=max_price,
        )
        total = self.products.count(
            search=search,
            category_id=category_id,
            brand_id=brand_id,
            min_price=min_price,
            max_price=max_price,
        )
        return ProductListResponse(
            items=items,
            meta=ListMeta(total=total, limit=limit, offset=offset),
        )

    def get_product(self, product_id: int) -> Product:
        product = self.products.get_by_id(product_id)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        return product

    def get_product_by_slug(self, slug: str) -> Product:
        product = self.products.get_by_slug(slug)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        return product

    def create_product(self, payload: ProductCreate) -> Product:
        slug = payload.slug or slugify(payload.name)
        self._validate_references(payload.category_id, payload.brand_id)
        self._ensure_unique(slug=slug, sku=payload.sku)
        return self.products.create(payload, slug)

    def update_product(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_product(product_id)
        data = payload.model_dump(exclude_unset=True)

        category_id = data.get("category_id", product.category_id)
        brand_id = data.get("brand_id", product.brand_id)
        self._validate_references(int(category_id), int(brand_id))

        price = data.get("price", product.price)
        discount_price = data.get("discount_price", product.discount_price)
        if discount_price is not None and Decimal(discount_price) >= Decimal(price):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Discount price must be lower than price",
            )

        if "name" in data or "slug" in data:
            candidate_name = str(data.get("name", product.name))
            data["slug"] = data.get("slug") or slugify(candidate_name)

        self._ensure_unique(
            slug=str(data.get("slug", product.slug)),
            sku=str(data.get("sku", product.sku)),
            current_id=product.id,
        )
        return self.products.update(product, data)

    def delete_product(self, product_id: int) -> None:
        product = self.get_product(product_id)
        self.products.delete(product)

    def upload_images(
        self,
        product_id: int,
        files: list[UploadFile],
        main_index: int | None,
    ) -> Product:
        product = self.get_product(product_id)
        if not files:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="At least one image is required",
            )
        if main_index is not None and (main_index < 0 or main_index >= len(files)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="main_index is out of range",
            )
        if main_index is None and not product.images:
            main_index = 0

        image_urls = [self._save_upload(file) for file in files]
        return self.products.add_images(product, image_urls, main_index)

    def set_main_image(self, product_id: int, image_id: int) -> ProductImage:
        product = self.get_product(product_id)
        image = self.products.set_main_image(product, image_id)
        if image is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product image not found",
            )
        return image

    def delete_image(self, product_id: int, image_id: int) -> None:
        product = self.get_product(product_id)
        image = self.products.delete_image(product, image_id)
        if image is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product image not found",
            )
        self._delete_local_file(image.image_url)

    def _validate_references(self, category_id: int, brand_id: int) -> None:
        if self.categories.get_by_id(category_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        if self.brands.get_by_id(brand_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Brand not found",
            )

    def _ensure_unique(
        self,
        slug: str,
        sku: str,
        current_id: int | None = None,
    ) -> None:
        existing_slug = self.products.get_by_slug(slug)
        if existing_slug is not None and existing_slug.id != current_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product with this slug already exists",
            )

        existing_sku = self.products.get_by_sku(sku)
        if existing_sku is not None and existing_sku.id != current_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product with this SKU already exists",
            )

    def _save_upload(self, file: UploadFile) -> str:
        if file.content_type is None or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Only image uploads are allowed",
            )

        extension = Path(file.filename or "").suffix.lower()
        if extension not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Unsupported image file extension",
            )

        upload_dir = Path(settings.UPLOAD_DIR) / "products"
        upload_dir.mkdir(parents=True, exist_ok=True)
        filename = f"{uuid4().hex}{extension}"
        destination = upload_dir / filename

        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return f"/uploads/products/{filename}"

    def _delete_local_file(self, image_url: str) -> None:
        prefix = "/uploads/"
        if not image_url.startswith(prefix):
            return
        relative_path = image_url.removeprefix(prefix)
        path = Path(settings.UPLOAD_DIR) / relative_path
        if path.exists() and path.is_file():
            path.unlink()
