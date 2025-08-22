from fastapi import FastAPI
from app.api import party_results, players, game_sessions

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
app.include_router(game_sessions.router, prefix=prefix)
