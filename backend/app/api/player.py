from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.player import PlayerCreate, PlayerRead
from app.db.crud.player import create_player, get_players

router = APIRouter(prefix="/players", tags=["players"])

@router.post("/", response_model=PlayerRead)
def add_player(player: PlayerCreate, db: Session = Depends(get_db)):
    return create_player(db, player)

@router.get("/", response_model=list[PlayerRead])
def list_players(db: Session = Depends(get_db)):
    return get_players(db)
