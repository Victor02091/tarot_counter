from sqlalchemy import Column, Integer, String, Boolean, UniqueConstraint
from app.db.base import Base

class Player(Base):
    __tablename__ = "players"
    __table_args__ = (UniqueConstraint("first_name", "last_name", name="uq_player_name"),)

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    visible = Column(Boolean, default=True, nullable=False)