from fastapi import FastAPI
from app.api import questionary

app = FastAPI()

app.include_router(questionary.router, prefix="/api")
