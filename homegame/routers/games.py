from typing import List

from db.core import NotFoundError, get_db
from db.games import (Game, GameCreate, GameUpdate, create_db_game,
                      delete_db_game, read_db_game, read_db_games,
                      update_db_game)
from fastapi import APIRouter, HTTPException, Request
from fastapi.params import Depends
from routers.limiter import limiter
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/games",
)


@router.get("/")
@limiter.limit("10/second")
def read_games(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> List[Game]:
    try:
        db_games = read_db_games(skip, limit, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    games = []
    for game in db_games:
        games.append(Game(**game.__dict__))
    return games


@router.post("/")
@limiter.limit("10/second")
def create_game(
    request: Request, game: GameCreate, db: Session = Depends(get_db)
) -> Game:
    db_game = create_db_game(game, db)
    return Game(**db_game.__dict__)


@router.get("/{game_id}")
@limiter.limit("10/second")
def read_game(request: Request, game_id: int, db: Session = Depends(get_db)) -> Game:
    try:
        db_game = read_db_game(game_id, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return Game(**db_game.__dict__)


@router.put("/{game_id}")
@limiter.limit("10/second")
def update_game(
    request: Request, game_id: int, game: GameUpdate, db: Session = Depends(get_db)
) -> Game:
    try:
        db_game = update_db_game(game_id, game, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return Game(**db_game.__dict__)


@router.delete("/{game_id}")
@limiter.limit("10/second")
def delete_game(request: Request, game_id: int, db: Session = Depends(get_db)) -> Game:
    try:
        db_game = delete_db_game(game_id, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return Game(**db_game.__dict__)