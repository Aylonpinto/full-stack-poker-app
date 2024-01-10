import _ from "lodash";
import React, { useEffect, useState } from "react";
import api from "./../Api";
import { GameResponse, PlayerResponse, PlayersData } from "./../types";
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

  useEffect(() => {
    fetchGames();
    fetchBalanceData();
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
      <TotalBalance
        balanceData={balanceData}
        totalBalance={totalBalance}
        handleSettleBalance={handleSettleBalance}
      />
      <h2>Create Poker Game</h2>
      <GameForm
        gameName={gameName}
        setGameName={setGameName}
        playersData={playersData}
        setPlayersData={setPlayersData}
        handleSubmit={handleFormSubmit}
      />
      <SettleBalanceModal settleBalanceData={settleBalanceData} />
    </div>
  );
}

export default Home;
