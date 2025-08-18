from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import Base


class PartyResult(Base):
    __tablename__ = "party_results"

    id = Column(Integer, primary_key=True, index=True)

    # Define foreign keys
    taker_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    called_player_id = Column(Integer, ForeignKey("players.id"), nullable=False)

    # Optional: define ORM relationships
    taker = relationship("Player", foreign_keys=[taker_id])
    called = relationship("Player", foreign_keys=[called_player_id])
      
    contract = Column(String, nullable=False)
    oudlers = Column(Integer, nullable=False)
    points = Column(Integer, nullable=False)
    petit = Column(JSONB, nullable=True)           # {"player": int, "result": str}
    poignees = Column(JSONB, nullable=False)        # {"simple": [int], "double": [], ...}
    miseres = Column(JSONB, nullable=False)         # {"atout": [int], "tete": []}
    chlem = Column(String, nullable=True)
