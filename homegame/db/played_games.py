from typing import List, Optional

from db.core import DBPlayedGame, NotFoundError
from numpy import nbytes
from pydantic import BaseModel
from sqlalchemy.orm import Session


class PlayedGame(BaseModel):
    game_id: int
    id: int
    player_id: int
    start_balance: float
    end_balance: float

class PlayedGameCreate(BaseModel):
    game_id: int
    player_id: int
    start_balance: float
    end_balance: float

class PlayedGameUpdate(BaseModel):
    game_id: Optional[int] = None
    player_id: Optional[int] = None
    start_balance: Optional[float] = None
    end_balance: Optional[float] = None
    
def read_db_played_games(skip: int, limit: int, session: Session) -> List[DBPlayedGame]:
    db_played_games = session.query(DBPlayedGame).offset(skip).limit(limit).all()
    return db_played_games

def read_db_played_game(played_game_id: int, session: Session) -> DBPlayedGame:
    db_played_game = session.query(DBPlayedGame).filter(DBPlayedGame.id == played_game_id).first()
    if db_played_game is None:
        raise NotFoundError(f"PlayedGame with id {played_game_id} not found.")
    
    return db_played_game

def create_db_played_game(played_game: PlayedGameCreate, session: Session) -> DBPlayedGame:
    db_played_game = DBPlayedGame(**played_game.model_dump(exclude_none=True))
    session.add(db_played_game)
    session.commit()
    session.refresh(db_played_game)

    return db_played_game


def update_db_played_game(played_game_id: int, played_game: PlayedGameUpdate, session: Session) -> DBPlayedGame:
    db_played_game = read_db_played_game(played_game_id, session)
    for key, value in played_game.model_dump(exclude_none=True).items():
        setattr(db_played_game, key, value)
    session.commit()
    session.refresh(db_played_game)

    return db_played_game


def delete_db_played_game(played_game_id: int, session: Session) -> DBPlayedGame:
    db_played_game = read_db_played_game(played_game_id, session)
    session.delete(db_played_game)
    session.commit()

    return db_played_game
