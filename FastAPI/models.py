# models.py
from database import Base
from sqlalchemy import Column, Float, ForeignKey, Integer, String


class PokerGame(Base):
    __tablename__ = "poker_games"
    id = Column(Integer, primary_key=True, index=True)
    game_name = Column(String, index=True)
    # Add more fields as needed

    def __repr__(self):
        return str(self.__dict__)


class PlayerBalance(Base):
    __tablename__ = "player_balances"
    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String, index=True)
    balance = Column(Float)

    def __repr__(self) -> str:
        return str(
            {"id": self.id, "player_name": self.player_name, "balance": self.balance}
        )


class PlayerGames(Base):
    __tablename__ = "player_games"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("poker_games.id"))
    player_id = Column(Integer, ForeignKey("player_balances.id"))
    start_balance = Column(Float)
    end_balance = Column(Float)

    def __repr__(self):
        return str(self.__dict__)

class LiveGame(Base):
    __tablename__ = 'live'
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("player_balances.id"))
    start_balance = Column(Float)
    end_balance = Column(Float)

    def __repr__(self):
        return str(self.__dict__)
