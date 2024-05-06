import axios from "axios";

const url =
  process.env.NODE_ENV === "production"
    ? "https://homegame-api.onrender.com"
    : `http://${window.location.hostname}:8000`;

const api = axios.create({
  baseURL: url,
});

export default api;
