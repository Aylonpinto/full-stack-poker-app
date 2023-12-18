import React from 'react';
import Button from '@mui/joy/Button';
import Balance from './Balance';
import { Container } from '@mui/material';

const TotalBalance = ({ balanceData, handleSettleBalance }) => {

  return (
    <Container>
          <h2>Total Balance:</h2>
          <Balance data={balanceData}/>
          <Button onClick = {handleSettleBalance} variant='soft' sx={{
                    display: 'inline-block',
                    width: '100%',
                    margin: '10px 0px'}}>Settle Balance</Button>
    </Container>
  );
};

export default TotalBalance;
