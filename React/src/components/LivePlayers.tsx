import { default as Add } from "@mui/icons-material/Add";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { Button, Sheet } from "@mui/joy";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import _ from "lodash";
import { useEffect } from "react";
import { Callback, PlayersData } from "../types";
import { setPlayerData } from "../utils";
import LivePlayerLine from "./LivePlayerLine";

type Props = {
  playersData: PlayersData;
  setPlayersData(callback: Callback<PlayersData> | PlayersData): void;
  buyin: number | string;
  playerNames: string[];
  handleClearPlayers(): void;
};

export default function LivePlayers({
  playersData,
  setPlayersData,
  buyin,
  playerNames,
  handleClearPlayers,
}: Props) {
  const addPlayer = () => {
    setPlayersData((prev) => [
      ...prev,
      { name: "", start_balance: buyin === "" ? "" : buyin, end_balance: "" },
    ]);
  };

  useEffect(() => {
    for (const player of playersData) {
      if (typeof player.start_balance === "string") {
        const index = _.indexOf(playersData, player);

        setPlayersData((prev) => {
          return [
            ...prev.slice(0, index),
            {
              name: player.name,
              start_balance: buyin,
              end_balance: player.end_balance,
            },
            ...prev.slice(index + 1),
          ];
        });
      }
    }
  }, [buyin]);

  return (
    <Sheet color="primary">
      <List>
        {playersData.map((player, i) => {
          if (player.end_balance !== "") return <></>;
          return (
            <ListItem>
              <LivePlayerLine
                playerData={player}
                setPlayerData={setPlayerData(i, setPlayersData)}
                buyin={buyin === "" ? 0 : Number(buyin)}
                playerNames={playerNames}
              />
            </ListItem>
          );
        })}
      </List>
      <Button
        variant="soft"
        color="primary"
        onClick={() => addPlayer()}
        startDecorator={<Add />}
        size="sm"
      >
        Add Player
      </Button>
      <Button
        variant="soft"
        color="danger"
        onClick={() => handleClearPlayers()}
        startDecorator={<NotInterestedIcon />}
        size="sm"
        sx={{ float: "right" }}
      >
        Clear
      </Button>
    </Sheet>
  );
}
