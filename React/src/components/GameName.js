import React, { useState } from 'react';
import Input from '@mui/joy/Input';
import DialogContent from '@mui/joy/DialogContent';



export default function GameName({gameName, setGameName}) {

    return( <>
        <DialogContent>What is the name of your game?</DialogContent>
        <Input  
            placeholder="Game name"
            variant="soft"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            />
        </>)
            
}