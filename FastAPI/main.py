# main.py
from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, Coroutine, List
from sqlalchemy.orm import Session
import sqlalchemy as sql
from pydantic import BaseModel
from database import SessionLocal, engine
import models
import calculations as calc
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://192.168.1.120:3000",
    "http://192.168.1.239:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


@app.post("/games/", response_model=PokerGameModel)
async def create_game(game: PokerGameBase, db: db_dependency):
    db_poker_game = models.PokerGame(**game.dict())
    db.add(db_poker_game)
    db.commit()
    db.refresh(db_poker_game)
    current_balance = db.query(models.PlayerBalance).all()
    print(current_balance, "cur")
    players = (
        db.query(models.PlayerGames)
        .filter(models.PlayerGames.game_id == db_poker_game.id)
        .all()
    )
    print(players, "play")
    balance = {}
    for player in current_balance:
        balance[player.id] = player.balance
    start_balance = {}
    end_balance = {}
    for player in players:
        start_balance[player.player_id] = player.start_balance
        end_balance[player.player_id] = player.end_balance
    balance = add_balances(calc.Game(start_balance, end_balance).balance, balance)
    for player_id, value in balance.items():
        db.query(models.PlayerBalance).filter(
            models.PlayerBalance.id == player_id
        ).update({"balance": value})
    db.commit()

    return db_poker_game


@app.get("/games/", response_model=List[PokerGameModel])
async def read_games(db: db_dependency, skip: int = 0, limit: int = 100):
    games = db.query(models.PokerGame).offset(skip).limit(limit).all()
    return games


@app.delete("/games/{game_id}")
def delete_game(
    game_id: int,
    db: db_dependency,
):
    with db:
        game = db.get(models.PokerGame, game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        db.delete(game)
        db.commit()
        return {"ok": True}


@app.post("/players/", response_model=PlayerBalanceModel)
async def insert_player(player: PlayerBalanceBase, db: db_dependency):
    db_player = models.PlayerBalance(**player.dict())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player


@app.get("/players/", response_model=List[PlayerBalanceModel])
async def read_players(db: db_dependency, skip: int = 0, limit: int = 100):
    players = (
        db.query(models.PlayerBalance)
        .order_by(sql.desc(models.PlayerBalance.balance))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return players


@app.delete("/players/{player_id}")
def delete_player(
    player_id: int,
    db: db_dependency,
):
    with db:
        player = db.get(models.PlayerBalance, player_id)
        if not player:
            raise HTTPException(status_code=404, detail="Player not found")
        db.delete(player)
        db.commit()
        return {"ok": True}


@app.post("/player_games/", response_model=PlayerGamesModel)
async def insert_player_game(player: PlayerGamesBase, db: db_dependency):
    db_player = models.PlayerGames(**player.dict())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player


@app.get("/players_games/", response_model=List[PlayerGamesModel])
async def read_player_games(db: db_dependency, skip: int = 0, limit: int = 100):
    players = db.query(models.PlayerGames).offset(skip).limit(limit).all()
    return players


@app.get("/settle_balance/")
async def get_transactions(db: db_dependency):
    players = db.query(models.PlayerBalance).all()
    balance = {}
    for player in players:
        balance[player.player_name] = player.balance
    transactions = settle_balance(balance)
    return transactions


def add_balances(balance1, balance2):
    for player_id, value in balance2.items():
        try:
            balance1[player_id] = balance1[player_id] + value
        except KeyError:
            balance1[player_id] = value
    return balance1


def settle_balance(balance: dict):
    sorted_balance = sorted(balance.items(), key=lambda player: player[1])
    print(sorted_balance)
    transactions = []
    player = sorted_balance[0]
    total = sum(balance.values())
    while player[1] < 0:
        other_player = sorted_balance[-1]
        if -player[1] == other_player[1]:
            transactions.append(
                f"{player[0]} pays €{round(-player[1], 2)} to {other_player[0]}"
            )
            sorted_balance = sorted_balance[1:-1]
        elif -player[1] < other_player[1]:
            transactions.append(
                f"{player[0]} pays €{round(-player[1], 2)} to {other_player[0]}"
            )
            sorted_balance = sorted_balance[1:]
            sorted_balance[-1] = (other_player[0], other_player[1] + player[1])
        else:
            transactions.append(
                f"{player[0]} pays €{round(other_player[1], 2)} to {other_player[0]}"
            )
            sorted_balance = sorted_balance[:-1]
            sorted_balance[0] = (player[0], player[1] + other_player[1])
        if len(sorted_balance) <= 1:
            break
        player = sorted_balance[0]
        print(sorted_balance)
    transactions.append(f"Amount not accounted for: €{round(total, 2)}")
    for transation in transactions:
        print(transation)
    return transactions


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
