import _ from "lodash";
import React, { useEffect, useState } from "react";
import api from "./../Api";
import {
  GameResponse,
  PlayerGame,
  PlayerResponse,
  PlayersData,
} from "./../types";
import Balance from "./Balance";
import GameForm from "./GameForm";
import SettleBalanceModal from "./SettleBalanceModal";
import TotalBalance from "./TotalBalance";

function Home() {
  const [games, setGames] = useState<GameResponse[]>([]);
  const [gameName, setGameName] = useState("");
  const [playersData, setPlayersData] = useState<PlayersData>([
    { name: "", start_balance: "", end_balance: "" },
  ]);
  const [balanceData, setBalanceData] = useState<Record<string, number>>({});
  const [totalBalance, setTotalBalance] = useState(0);
  const [settleBalanceData, setSettleBalanceData] = useState<string[]>([]);
  const [historyData, setHistoryData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchGames();
    fetchBalanceData();
    fetchHistoryData();
  }, []);

  const fetchGames = async () => {
    const response = await api.get<GameResponse[]>("/games/");
    setGames(response.data ?? []);
  };

  const fetchBalanceData = async () => {
    const response = await api.get<PlayerResponse[]>("/players/");
    const data: Record<string, number> = {};
    let total = 0;
    for (const player of response.data) {
      data[player.player_name] = player.balance;
      total += player.balance;
    }
    setTotalBalance(total);
    setBalanceData(data);
  };

  const fetchHistoryData = async () => {
    const playerGames = (await api.get<PlayerGame[]>("/player_games/")).data;
    const players = (await api.get<PlayerResponse[]>("/players/")).data;
    const data: Record<string, number> = {};
    let total = 0;
    for (const pg of playerGames) {
      const playerName = _.find(players, (p) => p.id === pg.player_id)
        ?.player_name;
      if (!playerName) continue;
      const balance = pg.end_balance - pg.start_balance;
      data[playerName] = data[playerName] | 0;
      data[playerName] += balance;
      total += balance;
    }
    const histItems = Object.keys(data).map(
      (player) => [player, data[player]] as [string, number],
    );
    histItems.sort((a, b) => b[1] - a[1]);

    const sortAndRounded: Record<string, number> = {};
    _.each(histItems, (item) => {
      sortAndRounded[item[0]] = _.round(item[1], 2);
    });

    setHistoryData(sortAndRounded);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const gameId = (games?.length ? _.maxBy(games, (g) => g.id)!.id : 0) + 1;
    for (const player of playersData) {
      if (typeof balanceData[player.name] === "undefined") {
        await api.post("/players/", { player_name: player.name, balance: 0 });
      }

      // Fetch players and wait for the response before proceeding
      const playersResponse = await api.get("/players/");
      const playerId = _.find(playersResponse.data, (p) => {
        return p.player_name === player.name;
      })?.id;

      const playerGameData = {
        game_id: gameId,
        player_id: playerId ?? 0,
        start_balance: player.start_balance,
        end_balance: Number(player.end_balance),
      };
      await api.post("/player_games/", playerGameData);
    }
    await api.post("/games/", { game_name: gameName });

    // Use the updatedGames array
    fetchGames();
    fetchBalanceData();
    setGameName("");
    setPlayersData([{ name: "", start_balance: "", end_balance: "" }]);
  };

  const handleSettleBalance = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const transactions = await api.get("/settle_balance/");
    setSettleBalanceData(transactions.data);
    clearPlayers();
  };

  const clearPlayers = async () => {
    const response = await api.get<PlayerResponse[]>("/players/");
    const ids = response.data.map((p) => p.id);

    for (const id of ids) {
      await api.post(`/reset_player/${id}`);
    }
    fetchBalanceData();
  };

  return (
    <div className="App">
      <h2>Open balance:</h2>

      <TotalBalance
        balanceData={balanceData}
        totalBalance={totalBalance}
        handleSettleBalance={handleSettleBalance}
      />
      <GameForm
        gameName={gameName}
        setGameName={setGameName}
        playersData={playersData}
        setPlayersData={setPlayersData}
        handleSubmit={handleFormSubmit}
        playerNames={Object.keys(balanceData)}
      />
      <br />
      <br />
      <SettleBalanceModal settleBalanceData={settleBalanceData} />
      <h2>History balance of all games:</h2>

      <Balance data={historyData} />
    </div>
  );
}

export default Home;
