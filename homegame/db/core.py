import os
from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

URL_DATBASE = "sqlite:///./poker.db"
PSQL_DATABASE = (
    os.environ.get("DB_URL")
    if os.environ.get("PYTHON_ENV") == "production"
    else "postgresql://aylonpinto:Pintoay1@localhost/postgres"
)

engine = create_engine(URL_DATBASE, connect_args={"check_same_thread": False})
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

psql_engine = create_engine(PSQL_DATABASE)
psql_session = sessionmaker(autocommit=False, autoflush=False, bind=psql_engine)


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


Base.metadata.create_all(bind=engine)
Base.metadata.create_all(bind=psql_engine)


# Dependency to get the database session
def get_db():
    database = session_local()
    try:
        yield database
    finally:
        database.close()


def get_psql_db():
    db = psql_session()
    try:
        yield db
    finally:
        db.close()
