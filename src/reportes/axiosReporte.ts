import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosReporte = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosReporte;



