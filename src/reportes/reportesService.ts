import axiosReporte from './axiosReporte';

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
}

export interface Reporte {
  id_reporte: number;
  id_usuario: Usuario;
  titulo: string;
  descripcion?: string;
  fecha_creacion: string;
}

// Obtener todos los reportes
export async function getReportes(): Promise<Reporte[]> {
  try {
    const response = await axiosReporte.get<Reporte[]>('/api/reportes');
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
    const response = await axiosReporte.post<Reporte>('/api/reportes', reporte);
    return response.data;
  } catch (error) {
    console.error('Error al crear reporte:', error);
    throw error;
  }
}

// Actualizar un reporte
export async function updateReporte(
  id_reporte: number,
  reporte: Partial<{ titulo: string; descripcion: string }>
): Promise<Reporte> {
  try {
    const response = await axiosReporte.put<Reporte>(`/api/reportes/${id_reporte}`, reporte);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    throw error;
  }
}

// Eliminar un reporte
export async function eliminarReporte(id_reporte: number): Promise<void> {
  try {
    await axiosReporte.delete(`/api/reportes/${id_reporte}`);
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    throw error;
  }
}
