from pydantic import BaseModel

class PlayerScoreSummary(BaseModel):
    player_id: int
    score: int
    player: str
