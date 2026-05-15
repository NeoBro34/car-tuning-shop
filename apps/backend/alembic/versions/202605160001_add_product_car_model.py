"""add product car model

Revision ID: 202605160001
Revises: 202605150006
Create Date: 2026-05-16
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "202605160001"
down_revision: str | None = "202605150006"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("products", sa.Column("car_model_id", sa.Integer(), nullable=True))
    op.create_index(
        op.f("ix_products_car_model_id"),
        "products",
        ["car_model_id"],
        unique=False,
    )
    op.create_foreign_key(
        "fk_products_car_model_id_car_models",
        "products",
        "car_models",
        ["car_model_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_products_car_model_id_car_models",
        "products",
        type_="foreignkey",
    )
    op.drop_index(op.f("ix_products_car_model_id"), table_name="products")
    op.drop_column("products", "car_model_id")
