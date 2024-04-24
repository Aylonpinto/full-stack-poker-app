from typing import Optional

from db.core import DBPlayer, NotFoundError
from pydantic import BaseModel
from sqlalchemy.orm import Session


class Player(BaseModel):
    id: int
    name: str
    balance: float

class PlayerCreate(BaseModel):
    name: str
    balance: float

class PlayerUpdate(BaseModel):
    balance: Optional[float] = None
    name: Optional[str] = None

def read_db_player(player_id: int, session: Session) -> DBPlayer:
    db_player = session.query(DBPlayer).filter(DBPlayer.id == player_id).first()
    if db_player is None:
        raise NotFoundError(f"Player with id {player_id} not found.")
    
    return db_player

def create_db_player(player: PlayerCreate, session: Session) -> DBPlayer:
    db_player = DBPlayer(**player.model_dump(exclude_none=True))
    session.add(db_player)
    session.commit()
    session.refresh(db_player)

    return db_player


def update_db_player(player_id: int, player: PlayerUpdate, session: Session) -> DBPlayer:
    db_player = read_db_player(player_id, session)
    for key, value in player.model_dump(exclude_none=True).items():
        setattr(db_player, key, value)
    session.commit()
    session.refresh(db_player)

    return db_player


def delete_db_player(player_id: int, session: Session) -> DBPlayer:
    db_player = read_db_player(player_id, session)
    session.delete(db_player)
    session.commit()

    return db_player
