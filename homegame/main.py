import asyncio
import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

from db.core import DBGame, DBLiveGame, DBPlayedGame, DBPlayer, DBSession
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient
from routers.limiter import limiter
from routers.router import create_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI()  # FastAPI(lifespan=lifespan)
routers = {}

for table in [DBGame, DBLiveGame, DBPlayedGame, DBPlayer, DBSession]:
    router = create_router(table)
    routers[table.__tablename__] = router
    app.include_router(router)

app.state.limiter = limiter
print(routers)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/")
def read_root():
    return "Server is running."

@app.get("/insert_sessions")
async def insert_sessions():
    def fetch_and_post():
        with TestClient(app) as client:
            response = client.get("/played_games/")
            for item in response.json():
                game_id = item['game_id']
                game_response = client.get(f'/games/{game_id}')
                game_name = game_response.json()['name']
                player_id = item['player_id']
                player_response = client.get(f'/players/{player_id}')
                player_name = player_response.json()['name']
                balance = item['end_balance'] - item['start_balance']
                session = {
                    "balance": balance,
                    "session_name": game_name,
                    "player_name": player_name,
                    "closed_time": datetime.now().isoformat(),
                    "settled": True
                }
                client.post('/sessions/', json=session)

    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, fetch_and_post)
    
    return result


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
