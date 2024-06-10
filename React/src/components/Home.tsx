import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../api/Api";
import { getOpenBalance } from "../api/ApiUtils";
import { balanceFromSessions, getTransactions } from "../utils";
import { Balance, PlayersData, SessionResponse } from "./../types";
import BalanceTable from "./BalanceTable";
import GameForm from "./GameForm";
import SettleBalanceModal from "./SettleBalanceModal";
import TotalBalance from "./TotalBalance";

function Home() {
  const [gameName, setGameName] = useState("");
  const [playersData, setPlayersData] = useState<PlayersData>([]);
  const [balanceData, setBalanceData] = useState<Balance>([]);
  const [settleBalanceData, setSettleBalanceData] = useState<string[]>([]);
  const [historyData, setHistoryData] = useState<Balance>([]);

  useEffect(() => {
    fetchBalanceData();
    fetchHistoryData();
  }, []);

  const fetchBalanceData = async () => {
    setBalanceData(await getOpenBalance(api));
  };

  const fetchHistoryData = async () => {
    const sessions = (
      await api.get<SessionResponse[]>("/sessions/")
    ).data.filter((s) => s.session_name);
    const data = balanceFromSessions(sessions);

    setHistoryData(data);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    for (const player of playersData) {
      const sessionData = {
        session_name: gameName,
        player_name: player.player_name,
        balance: Number(player.end_balance) - Number(player.start_balance),
        closed_time: new Date(),
        settled: 0,
      };
      await api.post<Omit<SessionResponse, "id">>("/sessions/", sessionData);
    }

    fetchBalanceData();
    setPlayersData([
      {
        player_name: "",
        start_balance: "",
        end_balance: "",
        session_id: 0,
        closed_time: null,
        session_name: "",
      },
    ]);
  };

  const handleSettleBalance = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const transactions = getTransactions(balanceData);
    setSettleBalanceData(transactions);
    markAsSettled();
  };

  const markAsSettled = async () => {
    const response = await api.get<SessionResponse[]>("/sessions/");
    const data = response.data;
    const notSettled = data.filter((s) => !s.settled).map((s) => s.id);
    for (const id of notSettled) {
      await api.put(`/sessions/${id}`, { settled: 1 });
    }
    fetchBalanceData();
    fetchHistoryData();
  };

  return (
    <div className="App">
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
        playerNames={historyData.map((p) => p.player_name)}
      />
      <br />
      <br />
      <SettleBalanceModal settleBalanceData={settleBalanceData} />
      <h2>History balance of all games:</h2>
      <Container maxWidth="md" sx={{ m: "10px auto" }}>
        <BalanceTable data={historyData} showZero={true} />
      </Container>
    </div>
  );
}

export default Home;
