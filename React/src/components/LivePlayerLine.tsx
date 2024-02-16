import { Add, ExitToApp } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  Sheet,
} from "@mui/joy";
import Input from "@mui/joy/Input";
import { useState } from "react";
import { PlayerData } from "../types";
import PlayerStartInput from "./PlayerStartInput";

type Props = {
  playerData: PlayerData;
  setPlayerData: (data: PlayerData) => void;
  buyin: number;
  playerNames: string[];
};

export default function LivePlayerLine({
  playerData,
  setPlayerData,
  buyin,
  playerNames,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [endValue, setEndValue] = useState<string | number>("");

  const handleExtraBuyin = () => {
    const amount =
      playerData.start_balance === ""
        ? buyin
        : Number(playerData.start_balance) + buyin;
    setPlayerData({ ...playerData, start_balance: amount });
  };

  const handleFormSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setPlayerData({ ...playerData, end_balance: endValue });
    setOpen(false);
  };

  return (
    <>
      <PlayerStartInput
        setPlayerData={setPlayerData}
        playerData={playerData}
        playerNames={playerNames}
        extraProps={{
          name: { size: "sm", sx: { flex: "0 2 auto" } },
          start: { size: "sm", sx: { flex: "0 3 auto" } },
        }}
      />
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add />}
        sx={{ flex: "0 0 auto" }}
        onClick={() => {
          handleExtraBuyin();
        }}
        size="sm"
      >
        Buy-In
      </Button>
      <IconButton
        variant="soft"
        color="danger"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <ExitToApp />
      </IconButton>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={(e) => handleFormSubmit()}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 500,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <FormControl>
              <FormLabel>
                What is the end balance of {`${playerData.name}?`}
              </FormLabel>
              <Input
                placeholder="Exit amount"
                variant="soft"
                type="number"
                startDecorator={"€"}
                value={endValue}
                onChange={(e) => setEndValue(e.target.value)}
              />
              <Button
                variant="soft"
                color="danger"
                startDecorator={<ExitToApp />}
                type="submit"
                sx={{ margin: "10px 0px" }}
              >
                Exit player
              </Button>
            </FormControl>
          </Sheet>
        </form>
      </Modal>
    </>
  );
}
