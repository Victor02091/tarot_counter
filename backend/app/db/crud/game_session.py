from sqlalchemy.orm import Session
from app.models.game_session import GameSession
from app.schemas.game_session import GameSessionCreate

def create_game_session(db: Session, session: GameSessionCreate):
    new_session = GameSession(**session.model_dump())
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session
