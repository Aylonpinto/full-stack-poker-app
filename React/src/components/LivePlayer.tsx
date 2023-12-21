import { default as Add } from "@mui/icons-material/Add";
import { Button, Sheet } from "@mui/joy";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import _ from "lodash";
import { useEffect } from "react";
import { Callback, PlayerData, PlayersData } from "../types";
import LivePlayerLine from "./LivePlayerLine";

type Props = {
  playersData: PlayersData;
  setPlayersData(callback: Callback<PlayersData> | PlayersData): void;
  buyin: number | string;
};

export default function LivePlayer({
  playersData,
  setPlayersData,
  buyin,
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

  const setPlayerData = (index: number) => {
    return (data: PlayerData) => {
      setPlayersData((prev) => [
        ...prev.slice(0, index),
        { ...data },
        ...prev.slice(index + 1),
      ]);
    };
  };

  return (
    <Sheet color="primary">
      <List>
        {playersData.map((player, i) => {
          if (player.end_balance !== "") return <></>;
          return i === playersData.length - 1 ? (
            <>
              <ListItem>
                <LivePlayerLine
                  playerData={player}
                  setPlayerData={setPlayerData(i)}
                  buyin={buyin === "" ? 0 : Number(buyin)}
                />
              </ListItem>
              <ListItem>
                <Button
                  variant="soft"
                  color="primary"
                  onClick={() => addPlayer()}
                  startDecorator={<Add />}
                  size="sm"
                >
                  Add Player
                </Button>
              </ListItem>
            </>
          ) : (
            <ListItem>
              <LivePlayerLine
                playerData={player}
                setPlayerData={setPlayerData(i)}
                buyin={buyin === "" ? 0 : Number(buyin)}
              />
            </ListItem>
          );
        })}
      </List>
    </Sheet>
  );
}
