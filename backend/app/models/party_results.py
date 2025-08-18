from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
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
    poignee_simple_players_ids= Column(ARRAY(Integer), nullable=False)
    poignee_double_players_ids = Column(ARRAY(Integer), nullable=False)
    poignee_triple_players_ids = Column(ARRAY(Integer), nullable=False)
    misere_tete_players_ids = Column(ARRAY(Integer), nullable=False)
    misere_atout_players_ids = Column(ARRAY(Integer), nullable=False)
    chlem = Column(String, nullable=True)

    # Relationships
    taker = relationship("Player", foreign_keys=[taker_id])
    called = relationship("Player", foreign_keys=[called_player_id])
    petit_au_bout_player = relationship("Player", foreign_keys=[petit_au_bout_player_id])