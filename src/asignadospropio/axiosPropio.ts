import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosPropio = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor para añadir token automáticamente
axiosPropio.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosPropio;
