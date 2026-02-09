import axios from "axios";
import { API_URL } from "../config/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Aquí puedes adjuntar token: config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log o manejo global de errores
    return Promise.reject(error);
  }
);
