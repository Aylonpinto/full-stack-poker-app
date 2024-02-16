import Input from "@mui/joy/Input";
import { PlayerData } from "../types";
import PlayerNameInput from "./PlayerStartInput";

type Props = {
  playerData: PlayerData;
  setPlayerData(data: PlayerData): void;
  playerNames: string[];
};

export default function PlayerLine({
  playerData,
  setPlayerData,
  playerNames,
}: Props) {
  return (
    <>
      <PlayerNameInput
        playerData={playerData}
        setPlayerData={setPlayerData}
        playerNames={playerNames}
      />
      <Input
        placeholder="End Balance"
        variant="soft"
        type="number"
        value={playerData.end_balance}
        startDecorator={"€"}
        onChange={(e) =>
          setPlayerData({ ...playerData, end_balance: e.target.value })
        }
        size="sm"
      />
    </>
  );
}
