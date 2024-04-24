from db.core import NotFoundError, get_db
from db.live_games import (LiveGame, LiveGameCreate, LiveGameUpdate,
                           create_db_live_game, delete_db_live_game,
                           read_db_live_game, update_db_live_game)
from fastapi import APIRouter, HTTPException, Request
from fastapi.params import Depends
from routers.limiter import limiter
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/live_games",
)


@router.post("/")
@limiter.limit("1/second")
def create_live_game(
    request: Request, live_game: LiveGameCreate, db: Session = Depends(get_db)
) -> LiveGame:
    db_live_game = create_db_live_game(live_game, db)
    return LiveGame(**db_live_game.__dict__)


@router.get("/{live_game_id}")
@limiter.limit("1/second")
def read_live_game(request: Request, live_game_id: int, db: Session = Depends(get_db)) -> LiveGame:
    try:
        db_live_game = read_db_live_game(live_game_id, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return LiveGame(**db_live_game.__dict__)


@router.put("/{live_game_id}")
@limiter.limit("1/second")
def update_live_game(
    request: Request, live_game_id: int, live_game: LiveGameUpdate, db: Session = Depends(get_db)
) -> LiveGame:
    try:
        db_live_game = update_db_live_game(live_game_id, live_game, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return LiveGame(**db_live_game.__dict__)


@router.delete("/{live_game_id}")
@limiter.limit("1/second")
def delete_live_game(request: Request, live_game_id: int, db: Session = Depends(get_db)) -> LiveGame:
    try:
        db_live_game = delete_db_live_game(live_game_id, db)
    except NotFoundError as e:
        raise HTTPException(status_code=404) from e
    return LiveGame(**db_live_game.__dict__)