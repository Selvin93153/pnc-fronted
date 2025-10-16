import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosPrestados = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosPrestados.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosPrestados;
