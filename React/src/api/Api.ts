import axios from "axios";

const api = axios.create({
  baseURL: `https://homegame-api.onrender.com`,
});

export default api;
