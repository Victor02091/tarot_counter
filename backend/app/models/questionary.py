from sqlalchemy import Column, Integer, String
from app.db.session import Base

class Questionnaire(Base):
    __tablename__ = "questionnaires"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    feedback = Column(String, nullable=False)