from pydantic import BaseModel

class PlayerScoreSummary(BaseModel):
    player: str
    score: int
