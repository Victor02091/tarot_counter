from fastapi import FastAPI
from app.api import questionary
from app.api import party_results
from app.api import player
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix="/api"
app.include_router(questionary.router, prefix=prefix)
app.include_router(party_results.router, prefix=prefix)
app.include_router(player.router, prefix=prefix)
