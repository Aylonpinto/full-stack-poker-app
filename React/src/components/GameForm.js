import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import PlayerBalance from './PlayerBalance';
import GameName from './GameName';



export default function GameForm({handleSubmit, gameName, setGameName, playersData, setPlayersData}) {
  const [open, setOpen] = useState(false);



  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        New Game
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Create new game</DialogTitle>
          <DialogContent>Fill in the name, start and end balance of the players</DialogContent>
          <form
            onSubmit={(event) => {
              handleSubmit(event)
              setOpen(false);
            }}
          >
            <Stack spacing={3}>
              <FormControl>
               <PlayerBalance playersData={playersData} setPlayersData={setPlayersData}/>
              </FormControl>
              <GameName gameName={gameName} setGameName={setGameName}/>
              <Button type='submit' variant="soft" color="primary">
               Add game
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}