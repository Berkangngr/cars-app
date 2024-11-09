import axios from "axios";

 const axiosInstance = axios.create({
    baseURL: 'http://localhost:56952', // Buraya base urlimiz gelicek.
  });

  export default axiosInstance;