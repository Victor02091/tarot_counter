from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.questionary import QuestionnaireCreate
from app.db.session import get_db
from app.db.crud.questionary import create_questionnaire

router = APIRouter(prefix="/questionnaire", tags=["questionnaire"])


@router.post("/")
def submit_questionnaire(
    data: QuestionnaireCreate, db: Session = Depends(get_db)
):
    return create_questionnaire(db, data)
