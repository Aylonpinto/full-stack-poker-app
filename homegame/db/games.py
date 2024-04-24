
from typing import Optional

from db.core import DBGame, NotFoundError
from pydantic import BaseModel
from sqlalchemy.orm import Session


class Game(BaseModel):
    id: int
    name: str

class GameCreate(BaseModel):
    name: str

class GameUpdate(BaseModel):
    name: Optional[str] = None

def read_db_game(game_id: int, session: Session) -> DBGame:
    db_game = session.query(DBGame).filter(DBGame.id == game_id).first()
    if db_game is None:
        raise NotFoundError(f"Game with id {game_id} not found.")
    
    return db_game

def create_db_game(game: GameCreate, session: Session) -> DBGame:
    db_game = DBGame(**game.model_dump(exclude_none=True))
    session.add(db_game)
    session.commit()
    session.refresh(db_game)

    return db_game


def update_db_game(game_id: int, game: GameUpdate, session: Session) -> DBGame:
    db_game = read_db_game(game_id, session)
    for key, value in game.model_dump(exclude_none=True).items():
        setattr(db_game, key, value)
    session.commit()
    session.refresh(db_game)

    return db_game


def delete_db_game(game_id: int, session: Session) -> DBGame:
    db_game = read_db_game(game_id, session)
    session.delete(db_game)
    session.commit()

    return db_game
