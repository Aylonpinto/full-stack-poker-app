import { PlayerData, PlayersData } from "./types";

export const setPlayerData = (
  index: number,
  setPlayersData: React.Dispatch<React.SetStateAction<PlayersData>>,
) => {
  return (data: PlayerData) => {
    setPlayersData((prev) => [
      ...prev.slice(0, index),
      { ...data },
      ...prev.slice(index + 1),
    ]);
  };
};
