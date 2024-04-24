from typing import List

from db.core import NotFoundError, get_db
from db.played_games import (PlayedGame, PlayedGameCreate, PlayedGameUpdate,
                             create_db_played_game, delete_db_played_game,
                             read_db_played_game, read_db_played_games,
                             update_db_played_game)
from fastapi import APIRouter, HTTPException, Request
from fastapi.params import Depends
from routers.limiter import limiter
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/played_games",
)

@router.get("/")
@limiter.limit("10/second")
def read_played_games(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> List[PlayedGame]:
    try:
        db_played_games = read_db_played_games(skip, limit, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    played_games = []
    for played_game in db_played_games:
        played_games.append(PlayedGame(**played_game.__dict__))
    return played_games

@router.post("/")
@limiter.limit("10/second")
def create_played_game(
    request: Request, played_game: PlayedGameCreate, db: Session = Depends(get_db)
) -> PlayedGame:
    db_played_game = create_db_played_game(played_game, db)
    return PlayedGame(**db_played_game.__dict__)


@router.get("/{played_game_id}")
@limiter.limit("10/second")
def read_played_game(request: Request, played_game_id: int, db: Session = Depends(get_db)) -> PlayedGame:
    try:
        db_played_game = read_db_played_game(played_game_id, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return PlayedGame(**db_played_game.__dict__)


@router.put("/{played_game_id}")
@limiter.limit("10/second")
def update_played_game(
    request: Request, played_game_id: int, played_game: PlayedGameUpdate, db: Session = Depends(get_db)
) -> PlayedGame:
    try:
        db_played_game = update_db_played_game(played_game_id, played_game, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return PlayedGame(**db_played_game.__dict__)


@router.delete("/{played_game_id}")
@limiter.limit("10/second")
def delete_played_game(request: Request, played_game_id: int, db: Session = Depends(get_db)) -> PlayedGame:
    try:
        db_played_game = delete_db_played_game(played_game_id, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return PlayedGame(**db_played_game.__dict__)