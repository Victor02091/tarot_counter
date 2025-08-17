from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.crud import game_session as crud
from app.schemas.game_session import GameSessionRead,GameSessionCreate

router = APIRouter(prefix="/game-sessions", tags=["Game Sessions"])

@router.post("/", response_model=GameSessionRead)
def create_game_session(session: GameSessionCreate, db: Session = Depends(get_db)):
    return crud.create_game_session(db, session)
