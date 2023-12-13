import React, { useState } from 'react';
import Input from '@mui/joy/Input';


export default function PlayerLine({playerData, setPlayerData, index}) {
    const handleNameChange = async (event, i) => {
        return setPlayerData(prev => 
            [...prev.slice(0, i), 
            {name: event.target.value, 
            start_balance: playerData.start_balance,
            end_balance: playerData.end_balance}, 
            ...prev.slice(i + 1)])
    }
    const handleStartChange = async (event, i) => {
        return setPlayerData(prev => 
            [...prev.slice(0, i), 
            {name: playerData.name, 
            start_balance: event.target.value,
            end_balance: playerData.end_balance}, 
            ...prev.slice(i + 1)])
    }
    const handleEndChange = async (event, i) => {
        return setPlayerData(prev => 
            [...prev.slice(0, i), 
            {name: playerData.name, 
            start_balance: playerData.start_balance,
            end_balance: event.target.value}, 
            ...prev.slice(i + 1)])
    }


    return( <>
        <Input  
            placeholder="Name"
            variant="soft"
            value={playerData.name}
            onChange={(e) => handleNameChange(e, index)}
            />
            <Input
            placeholder="Start Balance"
            variant="soft"
            type="number"
            value={playerData.start_balance}
            onChange={(e) => handleStartChange(e, index)}
            />
            <Input
            placeholder="End Balance"
            variant="soft"
            type="number"
            value={playerData.end_balance}
            onChange={(e) => handleEndChange(e, index)}
            />

        </>)
            
}
