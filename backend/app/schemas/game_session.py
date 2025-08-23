from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional, List
from app.schemas.player_score import PlayerScoreSummary
from app.schemas.party_results import PartyResultSummary

class GameSessionBase(BaseModel):
    name: Optional[str] = None
    player_1_id: int
    player_2_id: int
    player_3_id: int
    player_4_id: int
    player_5_id: Optional[int] = None

    # Normalize fields
    @field_validator("name")
    def normalize_name(cls, v: str) -> str:
        if v:
            return v.strip().capitalize()

class GameSessionCreate(GameSessionBase):
    pass

class GameSessionRead(GameSessionBase):
    id: int
    create_timestamp: datetime

    class Config:
        from_attributes = True

# Extended with scores
class GameSessionSummary(BaseModel):
    id: int
    name: str | None
    create_timestamp: datetime
    nb_parties: int
    scores: List[PlayerScoreSummary]

class GameSessionDetail(BaseModel):
    id: int
    name: Optional[str]
    create_timestamp: datetime
    players: List[str]  # list of player names in order
    party_results: List[PartyResultSummary]
    scores: List[PlayerScoreSummary]

    class Config:
        from_attributes = True