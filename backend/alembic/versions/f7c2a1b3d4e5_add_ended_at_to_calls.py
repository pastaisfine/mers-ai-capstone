"""add ended_at to calls

Revision ID: f7c2a1b3d4e5
Revises: e32452956aa3
Create Date: 2026-07-20 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'f7c2a1b3d4e5'
down_revision: Union[str, Sequence[str], None] = '0b87cccd01d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('calls', sa.Column('ended_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('calls', 'ended_at')
