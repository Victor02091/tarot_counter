from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class GameSessionBase(BaseModel):
    name: Optional[str] = None

class GameSessionCreate(GameSessionBase):
    pass

class GameSessionRead(GameSessionBase):
    id: int
    create_timestamp: datetime

    class Config:
        from_attributes = True
