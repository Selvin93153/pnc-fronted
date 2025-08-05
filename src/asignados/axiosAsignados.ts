// src/modules/asignados/axiosAsignados.ts
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosAsignados = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default axiosAsignados;
