from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ContractType(str, Enum):  
    petite = "Petite"
    garde = "Garde"
    garde_sans = "Garde sans"
    garde_contre = "Garde contre"


class ChlemType(str, Enum):
    announced_and_won = "Annoncé et passé"
    non_announced_and_won = "Non annoncé et passé"
    announced_and_failed = "Annoncé et chuté"

class PartyResultBase(BaseModel):
    taker_id: int
    game_session_id : int
    called_player_id: int  
    contract: ContractType
    oudlers: int
    points: int
    petit_au_bout_player_id: Optional[int] = None
    petit_au_bout_won: Optional[bool] = None
    poignee_simple_players_ids: List[int]
    poignee_double_players_ids: List[int]
    poignee_triple_players_ids: List[int]
    misere_tete_players_ids: List[int]
    misere_atout_players_ids: List[int]
    chlem: Optional[ChlemType] = None


class PartyResultCreate(PartyResultBase):
    pass


class PartyResultRead(PartyResultBase):
    id: int
    create_timestamp: datetime

    class Config:
        from_attributes = True

class PartyResultSummary(BaseModel):
    id: int
    taker: str
    called: str
    points: int
    create_timestamp: datetime

    class Config:
        from_attributes = True

