from sqlalchemy.orm import Session
from app.schemas.game_session import GameSessionCreate, GameSessionSummary, PlayerScoreSummary, GameSessionDetail
from app.schemas.party_results import PartyResultSummary
from sqlalchemy import func
from app.models.game_sessions import GameSession
from app.models.party_results import PartyResult
from app.models.party_scores import PartyScore
from app.models.player import Player
from fastapi import HTTPException


def create_game_session(db: Session, session: GameSessionCreate):
    new_session = GameSession(**session.model_dump())
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def get_game_session(session_id: int, db: Session) -> GameSessionDetail:
    session: GameSessionDetail = db.query(GameSession).filter(GameSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")


    # Players in order
    players = [session.player_1, session.player_2, session.player_3, session.player_4]
    if session.player_5:
        players.append(session.player_5)
    player_names = [f"{p.first_name} {p.last_name}" for p in players]

    # Party results
    party_results = [
        PartyResultSummary(
            id=pr.id,
            taker=f"{pr.taker.first_name} {pr.taker.last_name}",
            called=f"{pr.called.first_name} {pr.called.last_name}",
            points=pr.points,
            create_timestamp=pr.create_timestamp
        )
        for pr in session.party_results
    ]

    # Total scores
    scores = []
    for p in players:
        total_score = sum(score.score for pr in session.party_results for score in pr.scores if score.player_id == p.id)
        scores.append(PlayerScoreSummary(player=f"{p.first_name} {p.last_name}", score=total_score))

    return GameSessionDetail(
        id=session.id,
        name=session.name,
        create_timestamp=session.create_timestamp,
        players=player_names,
        party_results=party_results,
        scores=scores
    )

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