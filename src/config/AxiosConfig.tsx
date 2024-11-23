// import axios from "axios";

//  const axiosInstance = axios.create({
//     baseURL: 'http://localhost:56952', // Buraya base urlimiz gelicek.
//   });

//   export default axiosInstance;


  import axios from "axios";

// Axios instance oluştur
const api = axios.create({
  baseURL: "http://localhost:56952", // API base URL'nizi yazın
});

// Interceptor ile Authorization başlığı ekleyin
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  
  // Token varsa başlığı ekle
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;


