from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import Base


class PartyResult(Base):
    __tablename__ = "party_results"

    id = Column(Integer, primary_key=True, index=True)
    taker_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    called_player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    contract = Column(String, nullable=False)
    oudlers = Column(Integer, nullable=False)
    points = Column(Integer, nullable=False)
    petit_au_bout_player_id = Column(Integer, ForeignKey("players.id"), nullable=True)
    petit_au_bout_won = Column(Boolean, nullable=True)
    poignees = Column(JSONB, nullable=False)        # {"simple": [int], "double": [], ...}
    miseres = Column(JSONB, nullable=False)         # {"atout": [int], "tete": []}
    chlem = Column(String, nullable=True)

    # relationships
    taker = relationship("Player", foreign_keys=[taker_id])
    called = relationship("Player", foreign_keys=[called_player_id])
    petit_au_bout_player = relationship("Player", foreign_keys=[petit_au_bout_player_id])