from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.crud import game_session as crud
from app.schemas.game_session import GameSessionRead,GameSessionCreate
from app.schemas.game_session import GameSessionSummary
from app.db.crud.game_session import get_sessions_with_scores

router = APIRouter(prefix="/game-sessions", tags=["Game Sessions"])

@router.post("/", response_model=GameSessionRead)
def create_game_session(session: GameSessionCreate, db: Session = Depends(get_db)):
    return crud.create_game_session(db, session)


@router.get("/", response_model=list[GameSessionSummary])
def list_sessions(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return get_sessions_with_scores(db, skip, limit)