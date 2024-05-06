from typing import List, Optional

from db.core import DBLiveGame, NotFoundError
from pydantic import BaseModel
from sqlalchemy.orm import Session


class LiveGame(BaseModel):
    id: int
    player_id: int
    start_balance: float
    end_balance: float

class LiveGameCreate(BaseModel):
    player_id: int
    start_balance: float
    end_balance: float

class LiveGameUpdate(BaseModel):
    player_id: Optional[int] = None
    start_balance: Optional[float] = None
    end_balance: Optional[float] = None


def read_db_live_games(skip: int, limit: int, session: Session) -> List[DBLiveGame]:
    db_live_games = session.query(DBLiveGame).offset(skip).limit(limit).all()
    return db_live_games

def read_db_live_game(live_game_id: int, session: Session) -> DBLiveGame:
    db_live_game = session.query(DBLiveGame).filter(DBLiveGame.id == live_game_id).first()
    if db_live_game is None:
        raise NotFoundError(f"LiveGame with id {live_game_id} not found.")
    
    return db_live_game

def create_db_live_game(live_game: LiveGameCreate, session: Session) -> DBLiveGame:
    db_live_game = DBLiveGame(**live_game.model_dump(exclude_none=True))
    session.add(db_live_game)
    session.commit()
    session.refresh(db_live_game)

    return db_live_game


def update_db_live_game(live_game_id: int, live_game: LiveGameUpdate, session: Session) -> DBLiveGame:
    db_live_game = read_db_live_game(live_game_id, session)
    for key, value in live_game.model_dump(exclude_none=True).items():
        setattr(db_live_game, key, value)
    session.commit()
    session.refresh(db_live_game)

    return db_live_game


def delete_db_live_game(live_game_id: int, session: Session) -> DBLiveGame:
    db_live_game = read_db_live_game(live_game_id, session)
    session.delete(db_live_game)
    session.commit()

    return db_live_game
