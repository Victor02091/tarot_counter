from pydantic import BaseModel
from typing import List, Literal, Optional, Dict


class Petit(BaseModel):
    player_id: int 
    result: Literal["gagne", "perdu", ""]


class PartyResultBase(BaseModel):
    taker_id: int  
    called_player_id: int  
    contract: str
    oudlers: int
    points: int
    petit_au_bout_player_id: Optional[int] = None
    petit_au_bout_won: Optional[bool] = None
    poignees: Dict[str, List[int]]  # e.g., { "simple": [1], "double": [], "triple": [] }
    miseres: Dict[str, List[int]]   # e.g., { "atout": [2], "tete": [] }
    chlem: Optional[str] = None


class PartyResultCreate(PartyResultBase):
    pass


class PartyResultRead(PartyResultBase):
    id: int

    class Config:
        from_attributes = True
