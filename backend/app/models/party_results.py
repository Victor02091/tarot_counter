from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import Base


class PartyResult(Base):
    __tablename__ = "party_results"

    id = Column(Integer, primary_key=True, index=True)
    taker = Column(String, nullable=False)
    called = Column(String, nullable=False)
    contract = Column(String, nullable=False)
    oudlers = Column(Integer, nullable=False)
    points = Column(Integer, nullable=False)
    petit = Column(JSONB, nullable=False)
    poignees = Column(JSONB, nullable=False)
    miseres = Column(JSONB, nullable=False)
    chlem = Column(String, nullable=True)
