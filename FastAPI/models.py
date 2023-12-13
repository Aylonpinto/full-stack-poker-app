# models.py
from database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey


class PokerGame(Base):
    __tablename__ = "poker_games"
    id = Column(Integer, primary_key=True, index=True)
    game_name = Column(String, index=True)
    # Add more fields as needed


class PlayerBalance(Base):
    __tablename__ = "player_balances"
    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String, index=True)
    balance = Column(Float)


class PlayerGames(Base):
    __tablename__ = "player_games"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("poker_games.id"))
    player_id = Column(Integer, ForeignKey("player_balances.id"))
    start_balance = Column(Float)
    end_balance = Column(Float)