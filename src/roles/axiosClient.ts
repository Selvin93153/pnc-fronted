import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 Interceptor para agregar automáticamente el token JWT
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // 🔹 reutiliza el token guardado en LoginForm
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;


