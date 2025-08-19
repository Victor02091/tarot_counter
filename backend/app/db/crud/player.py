from sqlalchemy.orm import Session
from app.models.player import Player
from app.schemas.player import PlayerCreate

def create_player(db: Session, player: PlayerCreate) -> Player:
    db_player = Player(**player.model_dump())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def get_players(db: Session):
    return db.query(Player).all()
