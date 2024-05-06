# main.py
import os

from db.core import Base, get_db, get_old_db
from db.games import GameCreate, create_db_game
from db.played_games import PlayedGameCreate, create_db_played_game
from db.players import PlayerCreate, create_db_player
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Depends
from routers.games import router as games_router
from routers.limiter import limiter
from routers.live_games import router as live_games_router
from routers.played_games import router as played_games_router
from routers.players import router as players_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Session

app = FastAPI()  # FastAPI(lifespan=lifespan)

app.include_router(games_router)
app.include_router(players_router)
app.include_router(live_games_router)
app.include_router(played_games_router)

app.state.limiter = limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


class PokerGame(Base):
    __tablename__ = "poker_games"
    id = Column(Integer, primary_key=True, index=True)
    game_name = Column(String, index=True)
    # Add more fields as needed

    def __repr__(self):
        return str(self.__dict__)


class PlayerBalance(Base):
    __tablename__ = "player_balances"
    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String, index=True)
    balance = Column(Float)

    def __repr__(self) -> str:
        return str(
            {"id": self.id, "player_name": self.player_name, "balance": self.balance}
        )


class PlayerGames(Base):
    __tablename__ = "player_games"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("poker_games.id"))
    player_id = Column(Integer, ForeignKey("player_balances.id"))
    start_balance = Column(Float)
    end_balance = Column(Float)

    def __repr__(self):
        return str(self.__dict__)

class LiveGame(Base):
    __tablename__ = 'live'
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("player_balances.id"))
    start_balance = Column(Float)
    end_balance = Column(Float)

    def __repr__(self):
        return str(self.__dict__)

@app.get("/")
def read_root():
    return "Server is running."

@app.get("/migrate_data")
def migrate_db(db: Session = Depends(get_db), old_db: Session = Depends(get_old_db)):
    old_games = old_db.query(PokerGame).all()
    for game in old_games:
        new_game = GameCreate(name=game.game_name)
        create_db_game(new_game, db)
    old_players = old_db.query(PlayerBalance).all()
    for player in old_players:
        new_player = PlayerCreate(name=player.player_name, balance=player.balance)
        create_db_player(new_player, db)
    old_played_games = old_db.query(PlayerGames).all()
    for played in old_played_games:
        new_played = PlayedGameCreate(game_id=played.game_id, player_id=played.player_id, start_balance=played.start_balance, end_balance=played.end_balance)
        create_db_played_game(new_played, db)
        



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
