from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.crud import game_session as crud
from app.schemas.game_session import GameSessionRead,GameSessionCreate
from app.schemas.game_session import GameSessionSummary, GameSessionDetail

router = APIRouter(prefix="/game-sessions", tags=["Game Sessions"])

@router.post("/", response_model=GameSessionRead)
def create_game_session(session: GameSessionCreate, db: Session = Depends(get_db)):
    return crud.create_game_session(db, session)


@router.get("/", response_model=list[GameSessionSummary])
def get_sessions_with_scores(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return crud.get_sessions_with_scores(db, skip, limit)


@router.get("/{session_id}", response_model=GameSessionDetail)
def get_game_session(session_id: int, db: Session = Depends(get_db)):
    return crud.get_game_session(session_id, db)

@router.delete("/{session_id}", status_code=204)
def delete_game_session(session_id: int, db: Session = Depends(get_db)):
    from app.db.crud import game_session as crud
    success = crud.delete_game_session(db, session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")