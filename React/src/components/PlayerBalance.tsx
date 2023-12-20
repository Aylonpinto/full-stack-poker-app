import AddIcon from "@mui/icons-material/Add";
import { IconButton, Sheet } from "@mui/joy";
import FormHelperText from "@mui/joy/FormHelperText";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import { Callback, PlayersData } from "../types";
import PlayerLine from "./PlayerLine";

type Props = {
  playersData: PlayersData;
  setPlayersData(callback: Callback<PlayersData> | PlayersData): void;
};

export default function PlayerBalance({ playersData, setPlayersData }: Props) {
  const addPlayer = () => {
    setPlayersData((prev) => [
      ...prev,
      { name: "", start_balance: "", end_balance: "" },
    ]);
  };

  return (
    <Sheet color="primary">
      <List>
        {playersData.map((player, i) => {
          return i === playersData.length - 1 ? (
            <ListItem>
              <PlayerLine
                playerData={player}
                setPlayerData={setPlayersData}
                index={i}
              />
              <IconButton
                variant="soft"
                color="primary"
                onClick={() => addPlayer()}
              >
                <AddIcon />
              </IconButton>
            </ListItem>
          ) : (
            <ListItem>
              <PlayerLine
                playerData={player}
                setPlayerData={setPlayersData}
                index={i}
              />
            </ListItem>
          );
        })}
      </List>
      <FormHelperText id="my-helper-text">
        Leave the end balance blank if it is 0.
      </FormHelperText>
    </Sheet>
  );
}
