// src/api.js
import axios from "axios";

const isProduction = window.location.hostname !== "localhost";

const api = axios.create({
  baseURL: isProduction
    ? "https://fitness-back-uyee.onrender.com/api"
    : "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
