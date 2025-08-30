from sqlalchemy import Column, Integer, ForeignKey, Boolean, Enum, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.base import Base
import enum

# French Tarot contract
class ContractType(enum.Enum):
    petite = "Petite"
    garde = "Garde"
    garde_sans = "Garde sans"
    garde_contre = "Garde contre"

class ChlemType(enum.Enum):
    announced_and_won = "Annoncé et passé"
    non_announced_and_won = "Non annoncé et passé"
    announced_and_failed = "Annoncé et chuté"

class PartyResult(Base):
    __tablename__ = "party_results"

    id = Column(Integer, primary_key=True, index=True)
    game_session_id = Column(Integer, ForeignKey("game_sessions.id"), nullable=False)
    taker_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    called_player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    contract = Column(Enum(ContractType, name="contract_type", create_type=True
                           ,values_callable=lambda x: [e.value for e in x]), nullable=False)
    oudlers = Column(Integer, nullable=False)
    points = Column(Integer, nullable=False)
    petit_au_bout_player_id = Column(Integer, ForeignKey("players.id"), nullable=True)
    petit_au_bout_won = Column(Boolean, nullable=True)
    poignee_simple_players_ids= Column(ARRAY(Integer), nullable=False)
    poignee_double_players_ids = Column(ARRAY(Integer), nullable=False)
    poignee_triple_players_ids = Column(ARRAY(Integer), nullable=False)
    misere_tete_players_ids = Column(ARRAY(Integer), nullable=False)
    misere_atout_players_ids = Column(ARRAY(Integer), nullable=False)
    chlem = Column(Enum(ChlemType, name="chlem_type", create_type=True
                        , values_callable=lambda x: [e.value for e in x]), nullable=True)
    create_timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


    # Relationships
    taker = relationship("Player", foreign_keys=[taker_id])
    called = relationship("Player", foreign_keys=[called_player_id])
    petit_au_bout_player = relationship("Player", foreign_keys=[petit_au_bout_player_id])
    game_session = relationship("GameSession", back_populates="party_results")
    scores = relationship("PartyScore", backref="party_result", cascade="all, delete-orphan")