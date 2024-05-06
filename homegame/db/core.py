from typing import Optional

from sqlalchemy import (Column, Float, ForeignKey, Integer, String,
                        create_engine)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

URL_DATBASE = "sqlite:///./poker.db"

OLD_DATABASE = "sqlite:///../FastAPI/poker.db"

engine = create_engine(URL_DATBASE, connect_args={"check_same_thread": False})
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

old_engine = create_engine(OLD_DATABASE, connect_args={"check_same_thread": False})
old_session_local = sessionmaker(autocommit=False, autoflush=False, bind=old_engine)

class NotFoundError(Exception):
    pass


class Base(DeclarativeBase):
    pass

class DBGame(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]

    def __repr__(self):
        return str(self.__dict__)
    
class DBPlayer(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    balance: Mapped[float]
    name: Mapped[str]

    def __repr__(self):
        return str(self.__dict__)
    
class DBLiveGame(Base):
    __tablename__ = "live_games"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"))
    start_balance: Mapped[float]
    end_balance: Mapped[float]

    def __repr__(self):
        return str(self.__dict__)

class DBPlayedGame(Base):
    __tablename__ = "played_games"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"))
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"))
    start_balance: Mapped[float]
    end_balance: Mapped[float]

    def __repr__(self):
        return str(self.__dict__)

Base.metadata.create_all(bind=engine)



# Dependency to get the database session
def get_db():
    database = session_local()
    try:
        yield database
    finally:
        database.close()


def get_old_db():
    database = old_session_local()
    try:
        yield database
    finally:
        database.close()