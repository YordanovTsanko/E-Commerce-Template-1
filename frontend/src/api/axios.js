import axios from "axios";
import { translateError } from "../utils/translateError";

/*
 * Единственото място с адреса на бекенда.
 * Задава се с REACT_APP_API_URL в .env (локално) или в Environment Variables във Vercel.
 * withCredentials: true — браузърът праща сесийната бисквитка към бекенда на другия адрес.
 * Бекендът трябва да има cors({ credentials: true }) и този адрес в CLIENT_URL.
 */
export const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5555").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  withCredentials: true,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;
    if (error.code === "ECONNABORTED") {
      message = "Заявката отне твърде много време. Опитайте отново.";
    } else if (!error.response) {
      message = "Няма връзка със сървъра. Проверете интернет връзката си.";
    } else {
      message = translateError(
        error.response.data?.errMessage || error.response.data?.message
      );
    }
    error.userMessage = message;
    error.status = error.response?.status;
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error) =>
  error?.userMessage || translateError(error?.message);

export default api;
