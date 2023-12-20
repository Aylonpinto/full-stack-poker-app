export type PlayerData = {
  name: string;
  end_balance: number | string;
  start_balance: number | string;
};

export type PlayersData = PlayerData[];

export type Callback<T> = (arg: T) => T;
