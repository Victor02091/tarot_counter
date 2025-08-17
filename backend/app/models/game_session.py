from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.base import Base

class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    create_timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
