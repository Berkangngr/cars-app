
import axios from "axios";
import Cookies from "js-cookie";

export const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:56952" : "https://api.aracimhakkinda.com";

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor ile Authorization başlığı ekle
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Token bulunamadı, Authorization başlığı eklenmedi.");
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Hatası:", error);
    return Promise.reject(error);
  }
);

export default api;

