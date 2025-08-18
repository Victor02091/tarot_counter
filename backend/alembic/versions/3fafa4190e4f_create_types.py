"""Create types

Revision ID: 3fafa4190e4f
Revises: 20eb703cd010
Create Date: 2025-08-18 22:56:52.873772

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '3fafa4190e4f'
down_revision: Union[str, Sequence[str], None] = '20eb703cd010'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enum types first
    contract_type = postgresql.ENUM('Petite', 'Garde', 'Garde sans', 'Garde contre', name='contract_type')
    contract_type.create(op.get_bind(), checkfirst=True)

    chlem_type = postgresql.ENUM("Annoncé et passé", "Non annoncé et passé", "Annoncé et chuté", name='chlem_type')
    chlem_type.create(op.get_bind(), checkfirst=True)

    # Alter column with USING cast
    op.execute("""
        ALTER TABLE party_results
        ALTER COLUMN contract TYPE contract_type
        USING contract::contract_type
    """)

    op.execute("""
        ALTER TABLE party_results
        ALTER COLUMN chlem TYPE chlem_type
        USING chlem::chlem_type
    """)


def downgrade() -> None:
    # Revert columns to VARCHAR first
    op.execute("""
        ALTER TABLE party_results
        ALTER COLUMN chlem TYPE VARCHAR
        USING chlem::VARCHAR
    """)
    op.execute("""
        ALTER TABLE party_results
        ALTER COLUMN contract TYPE VARCHAR
        USING contract::VARCHAR
    """)

    # Then drop enum types
    postgresql.ENUM(name='contract_type').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name='chlem_type').drop(op.get_bind(), checkfirst=True)