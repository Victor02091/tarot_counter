from sqlalchemy.orm import Session
from app.models.questionary import Questionnaire
from app.schemas.questionary import QuestionnaireCreate

def create_questionnaire(db: Session, data: QuestionnaireCreate) -> Questionnaire:
    entry = Questionnaire(**data.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry