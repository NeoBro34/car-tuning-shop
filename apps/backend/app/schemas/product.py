from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.schemas.category import validate_slug
from app.schemas.common import ListMeta


class ProductBase(BaseModel):
    name: str = Field(min_length=2, max_length=180)
    slug: str | None = Field(default=None, min_length=2, max_length=220)
    description: str = Field(min_length=1, max_length=5000)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    discount_price: Decimal | None = Field(
        default=None, gt=0, max_digits=10, decimal_places=2
    )
    stock_quantity: int = Field(ge=0)
    sku: str = Field(min_length=2, max_length=80)
    category_id: int = Field(gt=0)
    brand_id: int = Field(gt=0)
    car_model_id: int | None = Field(default=None, gt=0)

    @field_validator("name", "sku")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        return " ".join(value.strip().split())

    @field_validator("slug")
    @classmethod
    def normalize_slug(cls, value: str | None) -> str | None:
        return validate_slug(value)

    @model_validator(mode="after")
    def validate_discount(self) -> "ProductBase":
        if self.discount_price is not None and self.discount_price >= self.price:
            raise ValueError("Discount price must be lower than price")
        return self


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=180)
    slug: str | None = Field(default=None, min_length=2, max_length=220)
    description: str | None = Field(default=None, min_length=1, max_length=5000)
    price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    discount_price: Decimal | None = Field(
        default=None, gt=0, max_digits=10, decimal_places=2
    )
    stock_quantity: int | None = Field(default=None, ge=0)
    sku: str | None = Field(default=None, min_length=2, max_length=80)
    category_id: int | None = Field(default=None, gt=0)
    brand_id: int | None = Field(default=None, gt=0)
    car_model_id: int | None = Field(default=None, gt=0)

    @field_validator("name", "sku")
    @classmethod
    def normalize_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return " ".join(value.strip().split())

    @field_validator("slug")
    @classmethod
    def normalize_slug(cls, value: str | None) -> str | None:
        return validate_slug(value)


class ProductImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    image_url: str
    is_main: bool


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str
    price: Decimal
    discount_price: Decimal | None
    stock_quantity: int
    sku: str
    is_active: bool
    category_id: int
    brand_id: int
    car_model_id: int | None
    created_at: datetime
    updated_at: datetime
    images: list[ProductImageResponse] = []


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    meta: ListMeta
