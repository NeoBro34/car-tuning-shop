from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.schemas.category import validate_slug
from app.schemas.common import ListMeta


class CarModelBase(BaseModel):
    brand_id: int = Field(gt=0)
    name: str = Field(min_length=1, max_length=120)
    slug: str | None = Field(default=None, min_length=1, max_length=140)
    year_start: int | None = Field(default=None, ge=1886, le=2100)
    year_end: int | None = Field(default=None, ge=1886, le=2100)
    is_active: bool = True

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        return " ".join(value.strip().split())

    @field_validator("slug")
    @classmethod
    def normalize_slug(cls, value: str | None) -> str | None:
        return validate_slug(value)

    @model_validator(mode="after")
    def validate_year_range(self) -> "CarModelBase":
        if (
            self.year_start is not None
            and self.year_end is not None
            and self.year_end < self.year_start
        ):
            raise ValueError("year_end must be greater than or equal to year_start")
        return self


class CarModelCreate(CarModelBase):
    pass


class CarModelUpdate(BaseModel):
    brand_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, min_length=1, max_length=120)
    slug: str | None = Field(default=None, min_length=1, max_length=140)
    year_start: int | None = Field(default=None, ge=1886, le=2100)
    year_end: int | None = Field(default=None, ge=1886, le=2100)
    is_active: bool | None = None

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return " ".join(value.strip().split())

    @field_validator("slug")
    @classmethod
    def normalize_slug(cls, value: str | None) -> str | None:
        return validate_slug(value)

    @model_validator(mode="after")
    def validate_year_range(self) -> "CarModelUpdate":
        if (
            self.year_start is not None
            and self.year_end is not None
            and self.year_end < self.year_start
        ):
            raise ValueError("year_end must be greater than or equal to year_start")
        return self


class CarModelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    brand_id: int
    name: str
    slug: str
    year_start: int | None
    year_end: int | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CarModelListResponse(BaseModel):
    items: list[CarModelResponse]
    meta: ListMeta

