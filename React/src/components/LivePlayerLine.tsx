import { Add, Close } from "@mui/icons-material";
import {
  Button,
  FormLabel,
  IconButton,
  Modal,
  Sheet,
  Typography,
} from "@mui/joy";
import Input from "@mui/joy/Input";
import { useState } from "react";
import { PlayerData } from "../types";

type Props = {
  playerData: PlayerData;
  setPlayerData: (data: PlayerData) => void;
  buyin: number;
};

export default function LivePlayerLine({
  playerData,
  setPlayerData,
  buyin,
}: Props) {
  const [name, setName] = useState(playerData.name);
  const [open, setOpen] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedName = event.target.value;
    while (updatedName[0] === " " || updatedName.slice(-1) === " ") {
      updatedName =
        updatedName[0] === " "
          ? updatedName.slice(1)
          : updatedName.slice(0, -1);
    }
    if (updatedName.length) {
      updatedName = updatedName[0].toUpperCase() + updatedName.slice(1);
    }
    setName(updatedName);

    setPlayerData({ ...playerData, name: updatedName });
  };

  const handleExtraBuyin = () => {
    const amount =
      playerData.start_balance === ""
        ? buyin
        : Number(playerData.start_balance) + buyin;
    setPlayerData({ ...playerData, start_balance: amount });
  };

  return (
    <>
      <Input
        placeholder="Name"
        variant="soft"
        value={name}
        onChange={(e) => handleNameChange(e)}
        sx={{ flex: "0 2 auto" }}
        size="sm"
        required
      />
      <Input
        placeholder="Start Balance"
        variant="soft"
        type="number"
        value={playerData.start_balance}
        onChange={(e) =>
          setPlayerData({ ...playerData, start_balance: e.target.value })
        }
        startDecorator={"€"}
        sx={{ flex: "0 3 auto" }}
        size="sm"
        required
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
        <Close />
      </IconButton>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <FormLabel>
            What is the end balance of {`${playerData.name}?`}
          </FormLabel>
          <Input
            placeholder="Exit amount"
            variant="soft"
            type="number"
            startDecorator={"€"}
            value={playerData.end_balance}
            onChange={(e) =>
              setPlayerData({ ...playerData, end_balance: e.target.value })
            }
          />

          <Typography id="modal-desc" textColor="text.tertiary"></Typography>
        </Sheet>
      </Modal>
    </>
  );
}
