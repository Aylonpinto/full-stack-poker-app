import os
from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker, Session


URL_DATBASE = (
    os.environ.get("DATABASE_URL")
    if os.environ.get("DATABASE_URL")
    else "sqlite:///./poker.db"
)

USE_PSQL = os.environ.get("USE_PSQL") == "true"


engine = create_engine(URL_DATBASE, connect_args={"check_same_thread": False})
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class NotFoundError(Exception):
    pass


class Base(DeclarativeBase):
    pass


class DBSession(Base):
    __tablename__ = "sessions"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    player_name: Mapped[str]
    session_name: Mapped[Optional[str]] = mapped_column(nullable=True)
    balance: Mapped[float]
    closed_time: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    settled: Mapped[bool]

    def __repr__(self):
        return str(self.__dict__)


# Dependency to get the database session
def get_db():
    database = session_local()
    try:
        yield database
    finally:
        database.close()


Base.metadata.create_all(bind=engine)
if USE_PSQL:
    PSQL_DATABASE = (
        os.environ.get("DATABASE_URL")
        if os.environ.get("DATABASE_URL")
        else "postgresql://aylonpinto:Pintoay1@localhost/postgres"
    )

    psql_engine = create_engine(PSQL_DATABASE)
    psql_session = sessionmaker(autocommit=False, autoflush=False, bind=psql_engine)

    Base.metadata.create_all(bind=psql_engine)

    def get_psql_db():
        db = psql_session()
        try:
            yield db
        finally:
            db.close()
