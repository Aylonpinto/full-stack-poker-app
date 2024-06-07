import { AxiosInstance } from "axios";
import _ from "lodash";
import { SessionResponse } from "../types";
import { balanceFromSessions } from "../utils";

export const deleteLiveData = async (api: AxiosInstance) => {
  const liveData = await getLiveSessions(api);
  const ids = liveData.map((lp) => lp.id);
  for (const id of ids) {
    await api.delete(`/sessions/${id}`);
  }
};

export const getLiveSessions = async (api: AxiosInstance) => {
  const response = await api.get<SessionResponse[]>("/sessions/");
  const data = response.data;
  return data.filter((s) => !s.session_name);
};

export const getPlayers = async (api: AxiosInstance) => {
  const response = await api.get<SessionResponse[]>("/sessions/");
  const data = response.data;
  return _.uniq(data.map((s) => s.player_name));
};

export const getOpenBalance = async (api: AxiosInstance) => {
  const response = await api.get<SessionResponse[]>("/sessions/");
  const data = response.data;
  const notSettled = data.filter((s) => !s.settled && s.session_name);
  return balanceFromSessions(notSettled);
};
