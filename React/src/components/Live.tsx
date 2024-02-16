import { Save } from "@mui/icons-material";
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import Bluebird from "bluebird";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../Api";
import {
  GameResponse,
  LivePlayer,
  PlayerResponse,
  PlayersData,
} from "../types";
import ExitedPlayers from "./ExitedPlayers";
import GameName from "./GameName";
import LivePlayers from "./LivePlayers";

export default function Live() {
  const [livePlayersData, setLivePlayersData] = useState<PlayersData>([
    {
      name: "",
      start_balance: "",
      end_balance: "",
    },
  ]);
  const [buyin, setBuyin] = useState<number | string>("");
  const [gameName, setGameName] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const navigate = useNavigate();

  const syncTimeDB = 5000;
  // Sync with live DB
  useEffect(() => {
    // Function to be called when the state remains unchanged after the specified time
    const handleUnchangedState = async () => {
      console.log(
        "State unchanged for",
        syncTimeDB,
        "milliseconds. Calling your async action...",
      );

      try {
        // Your async function call
        await asyncDBSync();

        // If the async function completes successfully, you can update the state or perform other actions
        // Example: setYourState('newState');
      } catch (error) {
        console.error("Error in async action:", error);
      }
    };

    // Set up a timer when the component mounts or when the state changes
    const timerId = setTimeout(() => {
      handleUnchangedState();
      // Update the previous state
    }, syncTimeDB);

    // Cleanup the timer when the component unmounts or when the state changes
    return () => clearTimeout(timerId);
  }, [livePlayersData]);

  // Enable saving
  useEffect(() => {
    if (
      _.every(livePlayersData, (pl) => pl.end_balance !== "") &&
      gameName !== ""
    ) {
      setDisabled(false);
    }
  }, [livePlayersData, gameName]);

  // calculate money on the table
  useEffect(() => {
    console.log(livePlayersData);
    const total = _.sum(
      livePlayersData.map(
        (p) => Number(p.start_balance) - Number(p.end_balance),
      ),
    );

    setTotalAmount(total);
  }, [livePlayersData]);

  // Fetch live data from DB
  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = async () => {
    const response = await api.get<LivePlayer[]>("/live/");
    const players = (await api.get<PlayerResponse[]>("/players/")).data;
    const playersData: PlayersData = [];

    _.each(response.data, (live) => {
      const player = {
        name: players.find((p) => p.id === live.player_id)?.player_name ?? "",
        start_balance: live.start_balance,
        end_balance: live.end_balance ? live.end_balance : "",
      };
      playersData.push(player);
    });
    if (playersData.length) {
      setLivePlayersData(playersData);
    }
    setPlayerNames(players.map((p) => p.player_name));
  };

  const asyncDBSync = async () => {
    const players = (await api.get<PlayerResponse[]>("/players/")).data;

    Bluebird.each(livePlayersData, async (plData) => {
      if (plData.name === "") return;
      const post: Omit<LivePlayer, "id"> = {
        player_id: 0,
        start_balance: Number(plData.start_balance),
        end_balance: Number(plData.end_balance),
      };
      const player = players.find((p) => p.player_name === plData.name);

      if (player) {
        post.player_id = player.id;
      } else {
        const newPlayer = (
          await api.post("/players/", {
            player_name: plData.name,
            balance: 0,
          })
        ).data;
        post.player_id = newPlayer.id;
      }

      await api.post("/live/", post);
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyin(event.target.value);
  };

  const handleGameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const games = (await api.get<GameResponse[]>("/games/")).data;
    const gameId = (games?.length ? _.maxBy(games, (g) => g.id)!.id : 0) + 1;
    for (const currentPlayer of livePlayersData) {
      const players = (await api.get<PlayerResponse[]>("/players/")).data;
      let playerId = undefined;
      const dbPlayer = players.find(
        (p) => p.player_name === currentPlayer?.name,
      );

      if (!dbPlayer) {
        await api.post("/players/", {
          player_name: currentPlayer.name,
          balance: 0,
        });
        playerId = (await api.get<PlayerResponse[]>("/players/")).data.find(
          (p) => p.player_name === currentPlayer.name,
        )?.id;
      } else {
        playerId = dbPlayer.id;
      }

      if (!gameId || !playerId) {
        throw new Error(
          `Invalid player id ${playerId} or game id ${gameId}. Not able to post player ${currentPlayer.name}`,
        );
      }
      const start = Number(currentPlayer.start_balance);
      const end = Number(currentPlayer.end_balance);

      const playerGameData = {
        game_id: gameId,
        player_id: playerId ?? 0,
        start_balance: start,
        end_balance: end,
      };
      await api.post("/player_games/", playerGameData);
    }

    await api.post("/games/", { game_name: gameName });
    await api.delete("/live");
    navigate("/home");
  };

  const handleClearPlayers = async () => {
    await api.delete("/live");
    setLivePlayersData([
      {
        name: "",
        start_balance: "",
        end_balance: "",
      },
    ]);
  };

  return (
    <Container>
      <Typography level="h4">Welcome to live mode!</Typography>
      <Typography level="body-md">
        Here you can keep track of a live cash game while you are playing!
      </Typography>
      <br />
      <FormControl>
        <FormLabel>Please fill in the buy-in amout:</FormLabel>
        <Input
          placeholder="Buy-in amount"
          variant="soft"
          type="number"
          value={buyin}
          startDecorator={"€"}
          onChange={(e) => handleChange(e)}
        />
        <FormHelperText>
          This will be used as a unit to add extra buy-ins to players.
        </FormHelperText>
      </FormControl>
      <br />
      <Stack spacing={3}>
        <LivePlayers
          playersData={livePlayersData}
          setPlayersData={setLivePlayersData}
          buyin={buyin}
          playerNames={playerNames}
          handleClearPlayers={handleClearPlayers}
        />
      </Stack>
      <Typography level="body-md">
        The total money on the table is: €{totalAmount}
      </Typography>
      <ExitedPlayers
        playersData={livePlayersData.filter((p) => p.end_balance !== "")}
      />
      <br />
      <form onSubmit={handleGameSubmit}>
        <FormControl>
          <GameName
            gameName={gameName}
            setGameName={setGameName}
            endDecorator={
              <Button
                type="submit"
                variant="soft"
                color="success"
                startDecorator={<Save />}
                onClick={() => {}}
                disabled={disabled}
              >
                Save Game
              </Button>
            }
          />
        </FormControl>
      </form>
    </Container>
  );
}
