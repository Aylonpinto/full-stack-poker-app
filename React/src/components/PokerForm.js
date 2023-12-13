import React, { useState } from 'react';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Calculator from './Calculator';
import Balance from './Balance';
import GameForm from './GameForm'
import PlayerBalance from './PlayerBalance';
import { IconButton, Sheet } from '@mui/joy';
import { Container } from '@mui/material';

const PokerForm = ({ balanceData ,onAddBalance, onCreateGame, gameData, setGameDate, handleSubmit }) => {
  const [playerName, setPlayerName] = useState('');
  const [startBalance, setStartBalance] = useState('');
  const [endBalance, setEndBalance] = useState('');
  const [gameName, setGameName] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);

  const handleAddBalance = () => {
    const playerData = { playerName, startBalance: parseFloat(startBalance), endBalance: parseFloat(endBalance) };
    onAddBalance(playerData);
    setPlayerName('');
    setStartBalance('');
    setEndBalance('');
  };

  const handleCreateGame = () => {
    onCreateGame(gameName);
    setGameName('');
  };

  const handleCalculate = (amount) => {
    setTotalBalance(totalBalance + amount);
  };

  return (
    <Container>
        <div>
          <h2>Total Balance:</h2>
          <Balance data={balanceData}/>
          <Button variant='soft' sx={{
                    display: 'inline-block',
                    width: '100%'}}>Settle Balance</Button>
        </div>
      <h2>Create Poker Game</h2>
      <GameForm gameData={gameData} setGameData={setGameDate} handleSubmit={handleSubmit}/>
    </Container>
  );
};

export default PokerForm;
