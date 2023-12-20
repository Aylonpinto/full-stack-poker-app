import { useState } from "react";
import Input from "@mui/joy/Input";
import { PlayerData, Callback, PlayersData } from "../types";

type Props = {
  playerData: PlayerData;
  setPlayerData(callback: Callback<PlayersData>): void;
  index: number;
};

export default function PlayerLine({
  playerData,
  setPlayerData,
  index,
}: Props) {
  const [name, setName] = useState(playerData.name);

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
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

    setPlayerData((prev) => [
      ...prev.slice(0, i),
      {
        name: updatedName,
        start_balance: playerData.start_balance,
        end_balance: playerData.end_balance,
      },
      ...prev.slice(i + 1),
    ]);
  };

  const handleStartChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    setPlayerData((prev) => [
      ...prev.slice(0, i),
      {
        name: playerData.name,
        start_balance: event.target.value,
        end_balance: playerData.end_balance,
      },
      ...prev.slice(i + 1),
    ]);
  };

  const handleEndChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    setPlayerData((prev) => [
      ...prev.slice(0, i),
      {
        name: playerData.name,
        start_balance: playerData.start_balance,
        end_balance: event.target.value,
      },
      ...prev.slice(i + 1),
    ]);
  };

  return (
    <>
      <Input
        placeholder="Name"
        variant="soft"
        value={name}
        onChange={(e) => handleNameChange(e, index)}
        required
      />
      <Input
        placeholder="Start Balance"
        variant="soft"
        type="number"
        value={playerData.start_balance}
        onChange={(e) => handleStartChange(e, index)}
        startDecorator={"€"}
        required
      />
      <Input
        placeholder="End Balance"
        variant="soft"
        type="number"
        value={playerData.end_balance}
        startDecorator={"€"}
        onChange={(e) => handleEndChange(e, index)}
      />
    </>
  );
}
