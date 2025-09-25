import axios from "axios";
import { cookieUtils } from "./cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de autorização nas requisições
api.interceptors.request.use(
  (config) => {
    const token = cookieUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401, remover token inválido
    if (error.response?.status === 401) {
      cookieUtils.removeToken();
    }
    return Promise.reject(error);
  }
);

export default api;
