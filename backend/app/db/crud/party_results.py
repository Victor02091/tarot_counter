from sqlalchemy.orm import Session
from app.models.party_results import PartyResult
from app.models.party_scores import PartyScore
from app.schemas.party_results import PartyResultCreate
from app.services.scoring import compute_party_result_scores

def create_party_result(
    db: Session, party_result: PartyResultCreate
) -> PartyResult:
    # Create and persist the party result
    db_result = PartyResult(**party_result.model_dump())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)

    # Compute the scores
    scores=compute_party_result_scores(party=db_result)

    # Persist scores in PartyScore table
    for player_id, score in scores.items():
        db_score = PartyScore(
            party_result_id=db_result.id,
            player_id=player_id,
            score=score
        )
        db.add(db_score)
    db.commit()
    db.refresh(db_result)

    return db_result

def get_all_party_results(db: Session):
    return db.query(PartyResult).all()
