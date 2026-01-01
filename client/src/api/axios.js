import axios from "axios";
import { triggerAuth } from "../utils/authEvents";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to every request automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      triggerAuth(); // 👈 OPEN LOGIN MODAL
    }

    return Promise.reject(error);
  }
);

export default instance;
