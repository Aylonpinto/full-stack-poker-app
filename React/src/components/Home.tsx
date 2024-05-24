import _ from "lodash";
import React, { useEffect, useState } from "react";
import api from "../api/Api";
import { insertGame } from "../api/ApiUtils";
import { getTransactions } from "../utils";
import {
  GameResponse,
  PlayedGame,
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
    const balance: Record<string, number> = {};
    const sortedData = _.orderBy(response.data, (pl) => pl.balance, "desc");
    let total = 0;
    for (const player of sortedData) {
      balance[player.name] = player.balance;
      total += player.balance;
    }
    setBalanceData(balance);
  };

  const fetchHistoryData = async () => {
    const playerGames = (await api.get<PlayedGame[]>("/played_games/")).data;
    const players = (await api.get<PlayerResponse[]>("/players/")).data;
    const data: Record<string, number> = {};

    for (const pg of playerGames) {
      const playerName = _.find(players, (p) => p.id === pg.player_id)?.name;
      if (!playerName) continue;
      const balance = _.round(pg.end_balance - pg.start_balance, 2);
      if (!(playerName in data)) {
        data[playerName] = 0;
      }
      data[playerName] += balance;
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
      let playerId = 0;

      // Fetch players and wait for the response before proceeding
      const playersResponse = _.find(
        (await api.get<PlayerResponse[]>("/players/")).data,
        (p) => p.name === player.name,
      );

      if (!playersResponse) {
        const newPlayer = (
          await api.post<PlayerResponse>("/players/", {
            name: player.name,
            balance: 0,
          })
        ).data;
        playerId = newPlayer.id;
      } else {
        playerId = playersResponse.id;
      }

      const playedGameData = {
        game_id: gameId,
        player_id: playerId,
        start_balance: player.start_balance,
        end_balance: Number(player.end_balance),
      };
      await api.post<PlayedGame>("/played_games/", playedGameData);
    }
    await insertGame(api, gameName);

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
    const transactions = getTransactions(balanceData);
    setSettleBalanceData(transactions);
    clearPlayers();
  };

  const clearPlayers = async () => {
    const response = await api.get<PlayerResponse[]>("/players/");
    const ids = response.data.map((p) => p.id);

    for (const id of ids) {
      await api.put(`/players/${id}`, { balance: 0 });
    }
    fetchBalanceData();
    fetchHistoryData();
  };

  return (
    <div className="App">
      <h2>Open balance:</h2>

      <TotalBalance
        balanceData={balanceData}
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
