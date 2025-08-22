from sqlalchemy.orm import Session
from app.schemas.game_session import GameSessionCreate, GameSessionSummary, PlayerScoreSummary
from sqlalchemy import func
from app.models.game_sessions import GameSession
from app.models.party_results import PartyResult
from app.models.party_scores import PartyScore
from app.models.player import Player


def create_game_session(db: Session, session: GameSessionCreate):
    new_session = GameSession(**session.model_dump())
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def get_sessions_with_scores(db: Session, skip: int = 0, limit: int = 20) -> list[GameSessionSummary]:
    sessions = (
        db.query(GameSession)
        .order_by(GameSession.create_timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    results: list[GameSessionSummary] = []
    for session in sessions:
        # Count parties
        nb_parties = (
            db.query(func.count(PartyResult.id))
            .filter(PartyResult.game_session_id == session.id)
            .scalar()
        )

        # Aggregate scores with concatenated firstname + lastname
        scores_raw = (
            db.query(
                func.concat(Player.first_name, ' ', Player.last_name).label('player_name'),
                func.sum(PartyScore.score)
            )
            .join(PartyScore, PartyScore.player_id == Player.id)
            .join(PartyResult, PartyResult.id == PartyScore.party_result_id)
            .filter(PartyResult.game_session_id == session.id)
            .group_by(Player.id, Player.first_name, Player.last_name)
            .all()
        )

        scores: list[PlayerScoreSummary] = [
            PlayerScoreSummary(player=s[0], score=s[1]) for s in scores_raw
        ]

        results.append(
            GameSessionSummary(
                id=session.id,
                name=session.name,
                create_timestamp=session.create_timestamp,
                nb_parties=nb_parties,
                scores=scores,
            )
        )

    return results