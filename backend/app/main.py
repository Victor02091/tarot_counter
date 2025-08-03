from fastapi import FastAPI
from app.api import questionary
from app.api import party_results

app = FastAPI()

app.include_router(questionary.router, prefix="/api")
app.include_router(party_results.router, prefix="/api")