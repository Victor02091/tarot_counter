from pydantic import BaseModel
from typing import List, Optional, Dict

class PartyResultBase(BaseModel):
    taker_id: int  
    called_player_id: int  
    contract: str
    oudlers: int
    points: int
    petit_au_bout_player_id: Optional[int] = None
    petit_au_bout_won: Optional[bool] = None
    poignee_simple_players_ids: List[int]
    poignee_double_players_ids: List[int]
    poignee_triple_players_ids: List[int]
    misere_tete_players_ids: List[int]
    misere_atout_players_ids: List[int]
    chlem: Optional[str] = None


class PartyResultCreate(PartyResultBase):
    pass


class PartyResultRead(PartyResultBase):
    id: int

    class Config:
        from_attributes = True
