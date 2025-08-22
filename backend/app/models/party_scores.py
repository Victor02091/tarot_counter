from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class PartyScore(Base):
    __tablename__ = "party_scores"

    id = Column(Integer, primary_key=True, index=True)
    party_result_id = Column(Integer, ForeignKey("party_results.id"), nullable=False)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    score = Column(Integer, nullable=False)

    # Relationships
    player = relationship("Player")