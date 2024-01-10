import Add from "@mui/icons-material/Add";
import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import React, { useEffect, useState } from "react";
import { PlayersData } from "../types";
import GameName from "./GameName";
import PlayerBalance from "./PlayerBalance";
import SumBalance from "./SumBalance";

type Props = {
  handleSubmit(event: React.FormEvent<HTMLFormElement>): void;
  gameName: string;
  setGameName(name: string): void;
  playersData: PlayersData;
  setPlayersData(players: PlayersData): void;
};

export default function GameForm({
  handleSubmit,
  gameName,
  setGameName,
  playersData,
  setPlayersData,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setGameName("");
    setPlayersData([{ name: "", start_balance: "", end_balance: "" }]);
  }, [open]);

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
          <DialogContent>
            Fill in the name, start and end balance of the players
          </DialogContent>
          <form
            onSubmit={(event) => {
              handleSubmit(event);
              setOpen(false);
            }}
          >
            <Stack spacing={3}>
              <PlayerBalance
                playersData={playersData}
                setPlayersData={setPlayersData}
              />
              <SumBalance playersData={playersData} />

              <GameName gameName={gameName} setGameName={setGameName} />
              <Button type="submit" variant="soft" color="primary">
                Add game
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
