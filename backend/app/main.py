from fastapi import FastAPI
from app.api import party_results
from app.api import players
from app.api import game_session
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
app.include_router(party_results.router, prefix=prefix)
app.include_router(players.router, prefix=prefix)
app.include_router(game_session.router, prefix=prefix)
