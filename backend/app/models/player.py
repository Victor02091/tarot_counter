from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    visible = Column(Boolean, default=True, nullable=False)