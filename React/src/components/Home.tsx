import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../api/Api";

import { getNamedSessions } from "../api/ApiUtils";
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
  }, []);

  const fetchBalanceData = async () => {
    const sessions = [
      await getNamedSessions(api, false),
      await getNamedSessions(api, true),
    ];
    const [openBalance, historyBalance] = sessions.map((s) =>
      balanceFromSessions(s),
    );
    setBalanceData(openBalance);
    setHistoryData(historyBalance);
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
    const unSettled = (await getNamedSessions(api, false)).map((s) => s.id);
    for (const id of unSettled) {
      await api.put(`/sessions/${id}`, { settled: true });
    }
    fetchBalanceData();
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
      <SettleBalanceModal settleBalanceData={settleBalanceData} />
      <Container maxWidth="md" sx={{ m: "10px auto" }}>
        <h2>History balance of all games:</h2>
        <BalanceTable data={historyData} showZero={true} />
      </Container>
    </div>
  );
}

export default Home;
