import axiosReporte from './axiosReporte';

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
  rol?: string;
}

export interface Reporte {
  id_reporte: number;
  id_usuario: number | Usuario;
  titulo: string;
  descripcion?: string;
  fecha_creacion: string;
}

// Función para obtener el token de localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Obtener todos los reportes (el backend filtrará según rol)
export async function getReportes(): Promise<Reporte[]> {
  try {
    const response = await axiosReporte.get<Reporte[]>('/api/reportes', {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    throw error;
  }
}

// Crear un nuevo reporte
export async function addReporte(reporte: {
   id_usuario: number;
  titulo: string;
  descripcion?: string;
}): Promise<Reporte> {
  try {
    const response = await axiosReporte.post<Reporte>(
      '/api/reportes',
      reporte,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear reporte:', error);
    throw error;
  }
}

// Actualizar un reporte
export const updateReporte = async (
  id_reporte: number,
  data: { titulo?: string; descripcion?: string }
): Promise<Reporte> => {
  try {
    const res = await axiosReporte.put(`/api/reportes/${id_reporte}`, data, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    throw error;
  }
};
