import { AxiosInstance } from "axios";
import _ from "lodash";
import { GameResponse, LivePlayer, PlayedGame, PlayerResponse } from "../types";

export const deleteLiveData = async (api: AxiosInstance) => {
  const liveData = (await api.get<LivePlayer[]>("/live_games/")).data;
  const ids = liveData.map((lp) => lp.id);
  for (const id of ids) {
    await api.delete(`/live_games/${id}`);
  }
};

export const insertGame = async (api: AxiosInstance, gameName: string) => {
  const response = await api.post<GameResponse>("/games/", { name: gameName });
  const gameId = response.data.id;
  const played_games = (
    await api.get<PlayedGame[]>("/played_games/")
  ).data.filter((pg) => pg.game_id === gameId);
  for (const played_game of played_games) {
    const player = (
      await api.get<PlayerResponse>(`/players/${played_game.player_id}`)
    ).data;
    await api.put<PlayerResponse>(`/players/${played_game.player_id}`, {
      balance:
        player.balance + played_game.end_balance - played_game.start_balance,
    });
  }
};

export const getSettleBalance = async (api: AxiosInstance) => {
  const response = await api.get<PlayerResponse[]>("/players/");
  const data = response.data;

  let sortedBalance = _.sortBy(data, (player) => player.balance);
  let transactions: string[] = [];
  let player = sortedBalance[0];
  let total = _.sumBy(data, (player) => player.balance);

  while (player.balance < 0) {
    let otherPlayer = sortedBalance[sortedBalance.length - 1];

    if (-player.balance === otherPlayer.balance) {
      let amount = "€" + Math.abs(-player.balance).toFixed(2);
      transactions.push(`${player.name} pays ${amount} to ${otherPlayer.name}`);
      sortedBalance = _.slice(sortedBalance, 1, -1);
    } else if (-player.balance < otherPlayer.balance) {
      let amount = "€" + Math.abs(-player.balance).toFixed(2);
      transactions.push(`${player.name} pays ${amount} to ${otherPlayer.name}`);
      sortedBalance = _.slice(sortedBalance, 1);
      sortedBalance[sortedBalance.length - 1] = {
        ...otherPlayer,
        balance: otherPlayer.balance + player.balance,
      };
    } else {
      let amount = "€" + Math.abs(otherPlayer.balance).toFixed(2);
      transactions.push(`${player.name} pays ${amount} to ${otherPlayer.name}`);
      sortedBalance = _.initial(sortedBalance);
      player = {
        ...player,
        balance: player.balance + otherPlayer.balance,
      };
    }

    if (sortedBalance.length <= 1) {
      break;
    }

    player = sortedBalance[0];
  }

  let amount = "€" + Math.abs(total).toFixed(2);
  transactions.push(`Amount not accounted for: ${amount}`);

  return transactions;
};
