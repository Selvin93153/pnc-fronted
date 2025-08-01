// src/services/authService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(correo: string, contraseña: string) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      correo,
      contraseña: contraseña,
    });

    return response.data; // { access_token: "..." }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
}
