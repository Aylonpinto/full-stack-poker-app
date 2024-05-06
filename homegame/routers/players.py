from typing import List

from db.core import NotFoundError, get_db
from db.players import (Player, PlayerCreate, PlayerUpdate, create_db_player,
                        delete_db_player, read_db_player, read_db_players,
                        update_db_player)
from fastapi import APIRouter, HTTPException, Request
from fastapi.params import Depends
from routers.limiter import limiter
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/players",
)

@router.get("/")
@limiter.limit("10/second")
def read_players(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> List[Player]:
    try:
        db_players = read_db_players(skip, limit, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    players = []
    for player in db_players:
        players.append(Player(**player.__dict__))
    return players

@router.post("/")
@limiter.limit("10/second")
def create_player(
    request: Request, player: PlayerCreate, db: Session = Depends(get_db)
) -> Player:
    db_player = create_db_player(player, db)
    return Player(**db_player.__dict__)


@router.get("/{player_id}")
@limiter.limit("10/second")
def read_player(request: Request, player_id: int, db: Session = Depends(get_db)) -> Player:
    try:
        db_player = read_db_player(player_id, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return Player(**db_player.__dict__)


@router.put("/{player_id}")
@limiter.limit("10/second")
def update_player(
    request: Request, player_id: int, player: PlayerUpdate, db: Session = Depends(get_db)
) -> Player:
    try:
        db_player = update_db_player(player_id, player, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return Player(**db_player.__dict__)


@router.delete("/{player_id}")
@limiter.limit("10/second")
def delete_player(request: Request, player_id: int, db: Session = Depends(get_db)) -> Player:
    try:
        db_player = delete_db_player(player_id, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return Player(**db_player.__dict__)