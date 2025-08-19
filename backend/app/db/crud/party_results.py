from sqlalchemy.orm import Session
from app.models.party_results import PartyResult
from app.schemas.party_results import PartyResultCreate


def create_party_result(
    db: Session, party_result: PartyResultCreate
) -> PartyResult:
    db_result = PartyResult(**party_result.model_dump())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result


def get_all_party_results(db: Session):
    return db.query(PartyResult).all()
