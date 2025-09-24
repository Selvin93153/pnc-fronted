import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosDevolucion = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

axiosDevolucion.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // 🔹 reutiliza el token guardado en LoginForm
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosDevolucion;
