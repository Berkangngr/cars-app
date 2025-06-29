// import axios from "axios";

//  const axiosInstance = axios.create({
//     baseURL: 'http://localhost:56952', // Buraya base urlimiz gelicek.
//   });

//   export default axiosInstance;


import axios from "axios";
import Cookies from "js-cookie";

// Axios instance oluştur
const api = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:56952" : "https://api.aracimhakkinda.com", // API URL'si
  withCredentials: true, // Cookie gönderimi için
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

