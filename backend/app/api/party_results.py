from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.party_results import PartyResultCreate, PartyResultRead
from app.db.crud.party_results import (
    create_party_result,
    get_all_party_results,
)
from app.db.session import get_db
from typing import List

router = APIRouter(prefix="/party-results", tags=["party_results"])


@router.post("/", response_model=PartyResultRead)
def submit_party_result(
    party_result: PartyResultCreate, db: Session = Depends(get_db)
):
    return create_party_result(db, party_result)


@router.get("/", response_model=List[PartyResultRead])
def list_party_results(db: Session = Depends(get_db)):
    return get_all_party_results(db)
