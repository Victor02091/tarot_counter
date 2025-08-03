from fastapi import FastAPI
from app.api import questionary
from app.api import party_results
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(questionary.router, prefix="/api")
app.include_router(party_results.router, prefix="/api")
