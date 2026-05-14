"""add admin role checks and product active flag

Revision ID: 202605150006
Revises: 202605150005
Create Date: 2026-05-15
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "202605150006"
down_revision: str | None = "202605150005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE users
        SET role = CASE
            WHEN lower(role) IN ('admin') THEN 'ADMIN'
            WHEN lower(role) IN ('super_admin', 'super-admin') THEN 'SUPER_ADMIN'
            ELSE 'USER'
        END
        """
    )
    if op.get_context().dialect.name != "sqlite":
        op.alter_column(
            "users",
            "role",
            server_default="USER",
            existing_type=sa.String(50),
        )
        op.create_check_constraint(
            "ck_users_role",
            "users",
            "role IN ('USER', 'ADMIN', 'SUPER_ADMIN')",
        )
    op.add_column(
        "products",
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=sa.text("true"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("products", "is_active")
    if op.get_context().dialect.name != "sqlite":
        op.drop_constraint("ck_users_role", "users", type_="check")
        op.alter_column("users", "role", server_default=None, existing_type=sa.String(50))
