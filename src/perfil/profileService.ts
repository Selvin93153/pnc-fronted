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

// Nueva función para cambiar contraseña
export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/api/auth/change-password`,
      { currentPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al cambiar la contraseña");
  }
}