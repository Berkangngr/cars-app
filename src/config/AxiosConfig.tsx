import axios from "axios";

 const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // Buraya base urlimiz gelicek.
  });

  export default axiosInstance;