# main.py
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.games import router as games_router
from routers.limiter import limiter
from routers.live_games import router as live_games_router
from routers.played_games import router as played_games_router
from routers.players import router as players_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI()  # FastAPI(lifespan=lifespan)

os.environ.get('PYTHON_ENV') == 'production'


app.include_router(games_router)
app.include_router(players_router)
app.include_router(live_games_router)
app.include_router(played_games_router)

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
