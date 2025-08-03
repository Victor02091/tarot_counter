from pydantic import BaseModel
from typing import List, Literal, Optional, Dict


class Petit(BaseModel):
    player: str
    result: Literal["gagne", "perdu", ""]


class PartyResultBase(BaseModel):
    taker: str
    called: str
    contract: str
    oudlers: int
    points: int
    petit: Petit
    poignees: Dict[str, List[str]]  # e.g., { "simple": ["Alice"], "double": [], "triple": [] }
    miseres: Dict[str, List[str]]   # e.g., { "atout": ["Bob"], "tete": [] }
    chlem: Optional[str] = None


class PartyResultCreate(PartyResultBase):
    pass


class PartyResultInDB(PartyResultBase):
    id: int

    class Config:
        orm_mode = True
