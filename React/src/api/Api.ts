import axios from "axios";

const url = process.env.BE_URL

const api = axios.create({
  baseURL: url,
});

export default api;
