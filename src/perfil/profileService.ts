import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getUsuarioById(id: number, token: string) {
  try {
    const response = await axios.get(`${API_URL}/api/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener usuario");
  }
}
