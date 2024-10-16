import axios from "axios";

const url = 'https://homegame-api.pintopi.nl';

const api = axios.create({
  baseURL: url,
});

export default api;
