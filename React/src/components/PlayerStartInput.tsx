import { Autocomplete, Input } from "@mui/joy";
import { PlayerData } from "../types";

type Props = {
  playerData: PlayerData;
  setPlayerData: (data: PlayerData) => void;
  playerNames: string[];
  extraProps: { name?: any; start?: any };
};

export default function PlayerStartInput({
  playerData,
  setPlayerData,
  playerNames,
  extraProps,
}: Props) {
  const handleNameChange = (
    newValue: string | null,
    event: React.SyntheticEvent<Element, Event>,
  ) => {
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

    setPlayerData({ ...playerData, player_name: updatedName });
  };

  return (
    <>
      <Autocomplete
        onInputChange={(e, nv) => handleNameChange(nv as string | null, e)}
        placeholder="Name"
        variant="soft"
        freeSolo
        value={playerData.player_name}
        options={playerNames}
        required
        {...extraProps?.name}
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
        required
        {...extraProps?.start}
      />
    </>
  );
}
