from pydantic import BaseModel

class PlayerBase(BaseModel):
    first_name: str
    last_name: str

class PlayerCreate(PlayerBase):
    pass

class PlayerRead(PlayerBase):
    id: int
    visible: bool

    class Config:
        orm_mode = True
