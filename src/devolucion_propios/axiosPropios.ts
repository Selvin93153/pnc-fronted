import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosDevolucion = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosDevolucion;
