import React, { useEffect, useState, useRef } from 'react';
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



export default function SettleBalanceModal({settleBalanceData}) {
  const [open, setOpen] = useState(false);

  const firstUpdate = useRef(true);    
  useEffect(() => {
    if (!settleBalanceData.length) {
        return;
      };
    setOpen(true)
    }, [settleBalanceData])
  


  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          {settleBalanceData.map(str => <p>{str}</p>)}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}