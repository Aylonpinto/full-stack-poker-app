# main.py
import os

from db.core import DBGame, DBLiveGame, DBPlayedGame, DBPlayer, DBSession
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.limiter import limiter
from routers.router import create_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI()  # FastAPI(lifespan=lifespan)

games_router = create_router(DBGame)
app.include_router(games_router)

players_router = create_router(DBPlayer)
app.include_router(players_router)

live_games_router = create_router(DBLiveGame)
app.include_router(live_games_router)

played_games_router = create_router(DBPlayedGame)
app.include_router(played_games_router)

sessions_router = create_router(DBSession)
app.include_router(sessions_router)

app.state.limiter = limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/")
def read_root():
    return "Server is running."

origins = [
   "https://homegame.onrender.com"
] if os.environ.get('PYTHON_ENV') == 'production' else ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
