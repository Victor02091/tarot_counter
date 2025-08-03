from pydantic import BaseModel


class QuestionnaireCreate(BaseModel):
    name: str
    age: int
    feedback: str
