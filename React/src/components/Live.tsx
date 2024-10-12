import {
  MonetizationOnRounded,
  MoneyOffRounded,
  Save,
} from "@mui/icons-material";

import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import Bluebird from "bluebird";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/Api";
import { deleteLiveData, getLiveSessions, getPlayers } from "../api/ApiUtils";
import { PlayersData, SessionResponse } from "../types";
import BalanceTable from "./BalanceTable";
import GameName from "./GameName";
import LivePlayers from "./LivePlayers";
import { getBuyInAmount } from "../utils";

export default function Live() {
  const [livePlayersData, setLivePlayersData] = useState<PlayersData>([]);
  const [buyin, setBuyin] = useState<string>("");
  const [gameName, setGameName] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [buyinDisabled, setBuyinDisabled] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const isInserting = useRef(false);

  const navigate = useNavigate();

  // Enable saving
  useEffect(() => {
    if (_.every(livePlayersData, (pl) => pl.closed_time) && gameName !== "") {
      setSaveDisabled(false);
    }
  }, [livePlayersData, gameName]);

  useEffect(() => {
    const startBalances = livePlayersData.map((p) => Number(p.start_balance));
    const newBuyin = getBuyInAmount(startBalances.filter((s) => !!s)) ?? 0;
    if (buyinDisabled) {
      setBuyin("");
    } else if (newBuyin) {
      setBuyin(`${newBuyin}`);
    }
  }, [buyinDisabled]);

  // calculate money on the table
  useEffect(() => {
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
    fetchPlayerNames();
  }, []);

  useEffect(() => {
    syncToDB();
  }, [livePlayersData]);

  const fetchLiveData = async () => {
    const liveSessions = await getLiveSessions(api);

    const playersData: PlayersData = [];

    _.each(liveSessions, (live) => {
      const player = {
        player_name: live.player_name,
        start_balance: live.balance ? `${-live.balance}` : "",
        end_balance: "",
        closed_time: live.closed_time,
        session_id: live.id,
        session_name: null,
      };
      playersData.push(player);
    });
    if (playersData.length) {
      setLivePlayersData(playersData);
    } else if (livePlayersData.length === 0 && isInserting.current === false) {
      await setNewLivePlayer();
    }
  };

  const fetchPlayerNames = async () => {
    setPlayerNames(await getPlayers(api));
  };

  const setNewLivePlayer = async () => {
    isInserting.current = true;
    try {
      const session: Omit<
        SessionResponse,
        "id" | "session_name" | "closed_time"
      > = {
        player_name: "",
        balance: buyin === "" ? 0 : Number(buyin),
        settled: false,
      };
      const id = (await api.post<SessionResponse>("/sessions/", session)).data
        .id;
      setLivePlayersData((prev: PlayersData) => {
        return [
          ...prev,
          {
            player_name: "",
            start_balance: buyin === "" ? "" : `${buyin}`,
            end_balance: "",
            session_id: id,
            closed_time: null,
            session_name: "",
          },
        ];
      });
    } finally {
      isInserting.current = false;
    }
  };

  const syncToDB = async () => {
    await Bluebird.each(livePlayersData, async (plData, index) => {
      const session = {
        player_name: plData.player_name,
        balance: Number(plData.end_balance) - Number(plData.start_balance),
        closed_time: plData.closed_time,
        session_name: plData.session_name,
      };
      await api.put(`/sessions/${plData.session_id}`, session);
    });
    if (
      livePlayersData.length &&
      _.every(livePlayersData, (pld) => pld.session_name)
    ) {
      navigate("/home");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyin(event.target.value);
  };

  const handleGameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await setLivePlayersData((prev: PlayersData) => {
      const newLivePlayerData = prev.map((pl) => ({
        ...pl,
        session_name: gameName,
      }));
      return newLivePlayerData;
    });
  };

  const handleClearPlayers = async () => {
    await deleteLiveData(api);
    setLivePlayersData([]);
    await setNewLivePlayer();
  };

  const getClosedPlayers = () => {
    const closedPlayers = livePlayersData.filter((p) => p.closed_time);
    return _.map(closedPlayers, (data) => {
      return {
        player_name: data.player_name,
        balance: Number(data.end_balance) - Number(data.start_balance),
      };
    });
  };

  return (
    <Container>
      <Typography level="h4">Welcome to live mode!</Typography>
      <Typography level="body-md">
        Here you can keep track of a live cash game while you are playing!
      </Typography>
      <Stack spacing={2}>
        <br />
        <FormControl>
          <FormLabel>Please fill in the buy-in amout:</FormLabel>
          <Container
            sx={{
              display: "flex",
              alignContent: "space-between",
            }}
          >
            <Input
              placeholder="Buy-in amount"
              variant="soft"
              type="number"
              value={buyin}
              startDecorator={"€"}
              onChange={(e) => handleChange(e)}
              sx={{ flex: "0 1 auto" }}
              disabled={buyinDisabled}
            />

            <IconButton
              type="submit"
              variant="soft"
              color={!buyinDisabled ? "danger" : "success"}
              sx={{ flex: "0 1 auto", margin: "0px 10px" }}
              onClick={() => {
                setBuyinDisabled(!buyinDisabled);
              }}
            >
              {buyinDisabled ? (
                <MonetizationOnRounded fontSize="small" />
              ) : (
                <MoneyOffRounded fontSize="small" />
              )}
            </IconButton>
          </Container>

          <FormHelperText>
            This will be used as a unit to add extra buy-ins to players.
          </FormHelperText>
        </FormControl>

        <LivePlayers
          playersData={livePlayersData}
          setPlayersData={setLivePlayersData}
          setNewLivePlayer={setNewLivePlayer}
          buyin={buyin}
          playerNames={playerNames}
          handleClearPlayers={handleClearPlayers}
        />
        <Typography level="body-md">
          The total money on the table is: €{totalAmount}
        </Typography>
        <BalanceTable data={getClosedPlayers()} showZero={true} />
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
                  disabled={saveDisabled}
                >
                  Save Game
                </Button>
              }
            />
          </FormControl>
        </form>
      </Stack>
    </Container>
  );
}
