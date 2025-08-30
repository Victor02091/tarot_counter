from sqlalchemy import Column, Integer, String, DateTime,ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base

class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    player_1_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    player_2_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    player_3_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    player_4_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    player_5_id = Column(Integer, ForeignKey("players.id"), nullable=True)
    nb_players = Column(Integer, nullable=False, default=5)
    create_timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    player_1 = relationship("Player", foreign_keys=[player_1_id])
    player_2 = relationship("Player", foreign_keys=[player_2_id])
    player_3 = relationship("Player", foreign_keys=[player_3_id])
    player_4 = relationship("Player", foreign_keys=[player_4_id])
    player_5 = relationship("Player", foreign_keys=[player_5_id])

    # Cascade delete: delete all party_results when session is deleted
    party_results = relationship(
        "PartyResult",
        back_populates="game_session",
        cascade="all, delete-orphan"
    )