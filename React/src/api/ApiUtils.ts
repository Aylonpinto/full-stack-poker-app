import { AxiosInstance } from "axios";
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
