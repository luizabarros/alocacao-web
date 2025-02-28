import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token: string | null = localStorage.getItem("@ALOCACAO:token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;


