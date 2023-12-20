export type PlayerData = {
  name: string;
  end_balance: number | string;
  start_balance: number | string;
};

export type PlayersData = PlayerData[];

export type Callback<T> = (arg: T) => T;

export type PlayerResponse = {
  player_name: string;
  balance: number;
  id: number;
};
export type GameResponse = {
  game_name: string;
  id: number;
};
