"""create catalog lookup tables

Revision ID: 202605150002
Revises: 202605150001
Create Date: 2026-05-15
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "202605150002"
down_revision: str | None = "202605150001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_categories_id"), "categories", ["id"], unique=False)
    op.create_index(op.f("ix_categories_name"), "categories", ["name"], unique=True)
    op.create_index(op.f("ix_categories_slug"), "categories", ["slug"], unique=True)

    op.create_table(
        "brands",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_brands_id"), "brands", ["id"], unique=False)
    op.create_index(op.f("ix_brands_name"), "brands", ["name"], unique=True)
    op.create_index(op.f("ix_brands_slug"), "brands", ["slug"], unique=True)

    op.create_table(
        "car_models",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("brand_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("year_start", sa.Integer(), nullable=True),
        sa.Column("year_end", sa.Integer(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["brand_id"], ["brands.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("brand_id", "slug", name="uq_car_models_brand_id_slug"),
    )
    op.create_index(op.f("ix_car_models_brand_id"), "car_models", ["brand_id"], unique=False)
    op.create_index(op.f("ix_car_models_id"), "car_models", ["id"], unique=False)
    op.create_index(op.f("ix_car_models_name"), "car_models", ["name"], unique=False)
    op.create_index(op.f("ix_car_models_slug"), "car_models", ["slug"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_car_models_slug"), table_name="car_models")
    op.drop_index(op.f("ix_car_models_name"), table_name="car_models")
    op.drop_index(op.f("ix_car_models_id"), table_name="car_models")
    op.drop_index(op.f("ix_car_models_brand_id"), table_name="car_models")
    op.drop_table("car_models")

    op.drop_index(op.f("ix_brands_slug"), table_name="brands")
    op.drop_index(op.f("ix_brands_name"), table_name="brands")
    op.drop_index(op.f("ix_brands_id"), table_name="brands")
    op.drop_table("brands")

    op.drop_index(op.f("ix_categories_slug"), table_name="categories")
    op.drop_index(op.f("ix_categories_name"), table_name="categories")
    op.drop_index(op.f("ix_categories_id"), table_name="categories")
    op.drop_table("categories")
