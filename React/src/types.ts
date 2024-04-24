export type PlayerData = {
  name: string;
  end_balance: number | string;
  start_balance: number | string;
};

export type PlayersData = PlayerData[];

export type Callback<T> = (arg: T) => T;

export type PlayerResponse = {
  name: string;
  balance: number;
  id: number;
};
export type GameResponse = {
  name: string;
  id: number;
};

export type LivePlayer = {
  id: number;
  player_id: number;
  start_balance: number;
  end_balance: number;
};

export type PlayedGame = {
  id: number;
  game_id: number;
  player_id: number;
  start_balance: number;
  end_balance: number;
};

export type Games = {
  id: number;
  name: string;
}[];
