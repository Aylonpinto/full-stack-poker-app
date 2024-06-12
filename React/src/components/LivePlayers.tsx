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
  setNewLivePlayer(): void;
  buyin: string;
  playerNames: string[];
  handleClearPlayers(): void;
};

export default function LivePlayers({
  playersData,
  setPlayersData,
  setNewLivePlayer,
  buyin,
  playerNames,
  handleClearPlayers,
}: Props) {
  useEffect(() => {
    for (const player of playersData) {
      if (Number(player.start_balance) < Number(buyin) && !player.closed_time) {
        const index = _.indexOf(playersData, player);

        setPlayersData((prev: PlayersData) => {
          return [
            ...prev.slice(0, index),
            {
              player_name: player.player_name,
              start_balance: `${buyin}`,
              end_balance: player.end_balance,
              closed_time: player.closed_time,
              session_id: player.session_id,
              session_name: player.session_name,
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
          if (player.closed_time) return <></>;
          return (
            <ListItem>
              <LivePlayerLine
                playerData={player}
                setPlayerData={setPlayerData(i, setPlayersData)}
                buyin={buyin}
                playerNames={playerNames}
              />
            </ListItem>
          );
        })}
      </List>
      <Button
        variant="soft"
        color="primary"
        onClick={() => setNewLivePlayer()}
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
