import React, { useState } from 'react';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Calculator from './Calculator';
import Balance from './Balance';
import GameForm from './GameForm'
import PlayerBalance from './PlayerBalance';
import { IconButton, Sheet } from '@mui/joy';
import { Container } from '@mui/material';

const TotalBalance = ({ balanceData, handleSettleBalance }) => {

  return (
    <Container>
          <h2>Total Balance:</h2>
          <Balance data={balanceData}/>
          <Button onClick = {handleSettleBalance} variant='soft' sx={{
                    display: 'inline-block',
                    width: '100%'}}>Settle Balance</Button>
    </Container>
  );
};

export default TotalBalance;
