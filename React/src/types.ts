export type PlayerData = {
  session_id: number;
  session_name: string | null;
  player_name: string;
  start_balance: string;
  end_balance: string;
  closed_time: Date | null;
};

export type PlayersData = PlayerData[];

export type Callback<T> = (arg: T) => T;

export type SessionResponse = {
  id: number;
  session_name: string | null;
  player_name: string;
  balance: number;
  closed_time: Date | null;
  settled: boolean;
};

export type Session = Omit<SessionResponse, "id">;

export type Balance = Omit<
  Session,
  "session_name" | "closed_time" | "settled"
>[];
