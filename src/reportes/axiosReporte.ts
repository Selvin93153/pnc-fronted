import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosReporte = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aquí puedes agregar interceptores si usas token, etc.

export default axiosReporte;
