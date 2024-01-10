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

export type LivePlayer = {
  id: number;
  player_id: number;
  start_balance: number;
  end_balance: number;
};

export type PlayerGame = {
  id: number;
  game_id: number;
  player_id: number;
  start_balance: number;
  end_balance: number;
};

export type Games = {
  id: number;
  game_name: string;
}[];
