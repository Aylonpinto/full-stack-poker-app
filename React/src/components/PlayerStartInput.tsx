import { Autocomplete, Input } from "@mui/joy";
import { PlayerData } from "../types";

type Props = {
  playerData: PlayerData;
  setPlayerData: (data: PlayerData) => void;
  playerNames: string[];
};

export default function PlayerStartInput({
  playerData,
  setPlayerData,
  playerNames,
}: Props) {
  const handleNameChange = (newValue: string | null) => {
    if (newValue == null) return;
    let updatedName = newValue;
    while (updatedName[0] === " " || updatedName.slice(-1) === " ") {
      updatedName =
        updatedName[0] === " "
          ? updatedName.slice(1)
          : updatedName.slice(0, -1);
    }
    if (updatedName.length) {
      updatedName = updatedName[0].toUpperCase() + updatedName.slice(1);
    }

    setPlayerData({ ...playerData, name: updatedName });
  };

  return (
    <>
      <Autocomplete
        placeholder="Name"
        variant="soft"
        freeSolo
        value={playerData.name}
        options={playerNames}
        onChange={(e, nv) => handleNameChange(nv)}
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
    </>
  );
}
