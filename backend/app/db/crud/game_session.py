from sqlalchemy.orm import Session, aliased
from app.schemas.game_session import GameSessionCreate, GameSessionSummary, PlayerScoreSummary, GameSessionDetail
from app.schemas.party_results import PartyResultSummary
from app.schemas.player_score import PlayerScoreSummary
from app.schemas.player import PlayerRead
from sqlalchemy import func, desc
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

    player_objs = [PlayerRead.model_validate(p) for p in players] 

    # Party results
    party_results = [
        PartyResultSummary(
            id=pr.id,
            taker=f"{pr.taker.first_name} {pr.taker.last_name}",
            called=f"{pr.called.first_name} {pr.called.last_name}",
            points=pr.points,
            create_timestamp=pr.create_timestamp,
            scores=[
                PlayerScoreSummary(
                    player_id=score.player_id,
                    score=score.score,
                    player=f"{score.player.first_name} {score.player.last_name}"
                )
                for score in pr.scores
            ]
        )
        for pr in session.party_results
    ]

    # Total scores
    scores = []
    for p in players:
        total_score = sum(
            score.score
            for pr in session.party_results
            for score in pr.scores
            if score.player_id == p.id
        )
        scores.append(
            PlayerScoreSummary(
                player_id=p.id,
                score=total_score,
                player=f"{p.first_name} {p.last_name}"
            )
        )


    return GameSessionDetail(
        id=session.id,
        name=session.name,
        create_timestamp=session.create_timestamp,
        players=player_objs, 
        party_results=party_results,
        scores=scores
    )

def get_sessions_with_scores(db: Session, skip: int = 0, limit: int = 20) -> list[GameSessionSummary]:
    # Alias PartyResult for latest result per session
    latest_pr = aliased(PartyResult)

    # Subquery to get latest party_result timestamp per session
    latest_subq = (
        db.query(
            PartyResult.game_session_id,
            func.max(PartyResult.create_timestamp).label("latest_ts")
        )
        .group_by(PartyResult.game_session_id)
        .subquery()
    )

    # Join sessions to latest timestamp subquery
    sessions = (
        db.query(GameSession)
        .join(latest_subq, GameSession.id == latest_subq.c.game_session_id)
        .order_by(desc(latest_subq.c.latest_ts))  # order by latest party_result
        .offset(skip)
        .limit(limit)
        .all()
    )

    summaries = []
    for session in sessions:
        # Players
        players = [session.player_1, session.player_2, session.player_3, session.player_4]
        if session.player_5:
            players.append(session.player_5)

        # Scores aggregated
        scores_raw = (
            db.query(
                PartyScore.player_id,
                func.sum(PartyScore.score),
                Player.first_name,
                Player.last_name
            )
            .join(PartyScore.party_result)
            .join(Player, Player.id == PartyScore.player_id)
            .filter(PartyResult.game_session_id == session.id)
            .group_by(PartyScore.player_id, Player.first_name, Player.last_name)
            .all()
        )

        scores: list[PlayerScoreSummary] = [
            PlayerScoreSummary(
                player_id=s[0],
                score=s[1] or 0,
                player=f"{s[2]} {s[3]}".strip()
            )
            for s in scores_raw
        ]

        summaries.append(
            GameSessionSummary(
                id=session.id,
                name=session.name,
                create_timestamp=session.create_timestamp,
                nb_parties=len(session.party_results),
                scores=scores,
            )
        )

    return summaries

def delete_game_session(db: Session, session_id: int) -> bool:
    session_obj = db.query(GameSession).filter(GameSession.id == session_id).first()
    if not session_obj:
        return False
    db.delete(session_obj)
    db.commit()
    return True