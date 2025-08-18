"""Use player ids instead of names in results

Revision ID: bb7a98aa93bc
Revises: 958f7267c95a
Create Date: 2025-08-18 20:22:39.294937

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bb7a98aa93bc'
down_revision: Union[str, Sequence[str], None] = '958f7267c95a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    """Upgrade schema."""
    # Convert taker and called to integer using explicit cast
    op.execute("ALTER TABLE party_results ALTER COLUMN taker TYPE INTEGER USING taker::integer;")
    op.execute("ALTER TABLE party_results ALTER COLUMN called TYPE INTEGER USING called::integer;")

def downgrade() -> None:
    """Downgrade schema."""
    # Revert back to string
    op.execute("ALTER TABLE party_results ALTER COLUMN taker TYPE VARCHAR;")
    op.execute("ALTER TABLE party_results ALTER COLUMN called TYPE VARCHAR;")
