import axios from "axios";

const url = process.env.REACT_APP_BE_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: url,
});

export default api;
