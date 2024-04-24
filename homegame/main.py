# main.py
from typing import Annotated, Coroutine, List

import calculations as calc
import models as models
import sqlalchemy as sql
from database import SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from routers.games import router as games_router
from routers.limiter import limiter
from routers.live_games import router as live_games_router
from routers.played_games import router as played_games_router
from routers.players import router as players_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session

app = FastAPI()  # FastAPI(lifespan=lifespan)



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
   " https://full-stack-poker-app.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PokerGameBase(BaseModel):
    game_name: str


class PokerGameModel(PokerGameBase):
    id: int

    class Config:
        orm_mode = True


class PlayerBalanceBase(BaseModel):
    player_name: str
    balance: float


class PlayerBalanceModel(PlayerBalanceBase):
    id: int

    class Config:
        orm_mode = True


class PlayerGamesBase(BaseModel):
    game_id: int
    player_id: int
    start_balance: float
    end_balance: float


class PlayerGamesModel(PlayerGamesBase):
    id: int

    class Config:
        orm_mode = True

class LiveGameBase(BaseModel):
    player_id: int
    start_balance: float
    end_balance: float


class LiveGameModel(LiveGameBase):
    id: int

    class Config:
        orm_mode = True



# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# db_dependency = Annotated[Session, Depends(get_db)]

# models.Base.metadata.create_all(bind=engine)



# @app.post("/games/", response_model=PokerGameModel)
# async def create_game(game: PokerGameBase, db: db_dependency):
#     db_poker_game = models.PokerGame(**game.dict())
#     db.add(db_poker_game)
#     db.commit()
#     db.refresh(db_poker_game)
#     current_balance = db.query(models.PlayerBalance).all()
#     players = (
#         db.query(models.PlayerGames)
#         .filter(models.PlayerGames.game_id == db_poker_game.id)
#         .all()
#     )
#     balance = {}
#     for player in current_balance:
#         balance[player.id] = player.balance
#     start_balance = {}
#     end_balance = {}
#     for player in players:
#         start_balance[player.player_id] = player.start_balance
#         end_balance[player.player_id] = player.end_balance
#     balance = calc.add_balances(calc.Game(start_balance, end_balance).balance, balance)
#     for player_id, value in balance.items():
#         db.query(models.PlayerBalance).filter(
#             models.PlayerBalance.id == player_id
#         ).update({"balance": value})
#     db.commit()

#     return db_poker_game


# @app.get("/games/", response_model=List[PokerGameModel])
# async def read_games(db: db_dependency, skip: int = 0, limit: int = 100):
#     games = db.query(models.PokerGame).offset(skip).limit(limit).all()
#     return games


# @app.delete("/games/{game_id}")
# def delete_game(
#     game_id: int,
#     db: db_dependency,
# ):
#     with db:
#         game = db.get(models.PokerGame, game_id)
#         if not game:
#             raise HTTPException(status_code=404, detail="Game not found")
#         db.delete(game)
#         db.commit()
#         return {"ok": True}


# @app.post("/players/", response_model=PlayerBalanceModel)
# async def insert_player(player: PlayerBalanceBase, db: db_dependency):
#     db_player = models.PlayerBalance(**player.dict())
#     db.add(db_player)
#     db.commit()
#     db.refresh(db_player)
#     return db_player


# @app.post("/reset_player/{id}", response_model=PlayerBalanceModel)
# async def reset_player(id: int, db: db_dependency):
#     player = db.query(models.PlayerBalance).filter(
#         models.PlayerBalance.id == id
#     ).first()

#     if not player:
#         raise HTTPException(status_code=404, detail="Player not found")

#     player.balance = 0
#     db.commit()
    
#     return player


# @app.get("/players/", response_model=List[PlayerBalanceModel])
# async def read_players(db: db_dependency, skip: int = 0, limit: int = 100):
#     players = (
#         db.query(models.PlayerBalance)
#         .order_by(sql.desc(models.PlayerBalance.balance))
#         .offset(skip)
#         .limit(limit)
#         .all()
#     )
#     return players


# @app.delete("/players/{player_id}")
# def delete_player(
#     player_id: int,
#     db: db_dependency,
# ):
#     with db:
#         player = db.get(models.PlayerBalance, player_id)
#         if not player:
#             raise HTTPException(status_code=404, detail="Player not found")
#         db.delete(player)
#         db.commit()
#         return {"ok": True}


# @app.post("/player_games/", response_model=PlayerGamesModel)
# async def insert_player_game(player: PlayerGamesBase, db: db_dependency):
#     db_player = models.PlayerGames(**player.dict())
#     db.add(db_player)
#     db.commit()
#     db.refresh(db_player)
#     return db_player

 
# @app.get("/player_games/", response_model=List[PlayerGamesModel])
# async def read_player_games(db: db_dependency, skip: int = 0, limit: int = 100):
#     players = db.query(models.PlayerGames).offset(skip).limit(limit).all()
#     return players


# @app.get("/settle_balance/")
# async def get_transactions(db: db_dependency):
#     players = db.query(models.PlayerBalance).all()
#     if not players:
#         return []
#     balance = {}
#     for player in players:
#         balance[player.player_name] = player.balance
#     transactions = calc.settle_balance(balance)
#     return transactions

# @app.post('/live/', response_model=LiveGameModel)
# async def insert_live_player(player: LiveGameBase, db: db_dependency):
#     exists = db.query(models.LiveGame).filter(
#         models.LiveGame.player_id == player.player_id
#     ).first()
#     if exists:
#         exists.start_balance = player.start_balance
#         exists.end_balance = player.end_balance
#         db.commit()
#         db.refresh(exists)
#         return exists
#     new_player = models.LiveGame(**player.dict())
#     db.add(new_player)
#     db.commit()
#     db.refresh(new_player)
#     return new_player

# @app.get('/live/', response_model=List[LiveGameModel])
# async def get_live_players(db: db_dependency, skip: int = 0, limit: int = 100):
#     players = (
#         db.query(models.LiveGame)
#         .offset(skip)
#         .limit(limit)
#         .all()
#     )
#     return players

# @app.delete('/live/')
# async def delete_live(db: db_dependency):
#     players = await get_live_players(db)
#     for player in players:
#         db.delete(player)
#     db.commit()
#     return {"ok": True}




# @app.delete("/games/")
# async def delete_game(db: db_dependency, game_id: int):
#     game = db.query(models.PokerGame).filter(models.PokerGame.id == game_id).first()

#     if not game:
#         raise HTTPException(status_code=404, detail="Game not found")

#     db.delete(game)
#     db.commit()
#     return game


# @app.post("/balances/")
# def create_balance(
#     balance_data: models.PlayerBalance, db: Session = Depends(database.get_db)
# ):
#     # Implement balance creation logic
#     pass


# Implement endpoints for updating, deleting, and retrieving data as needed.
