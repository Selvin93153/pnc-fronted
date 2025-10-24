import axiosPrestados from './axiosPrestados';

export interface Prestamo {
  id_prestamo: number;
  clase: string;
  marca: string;
  calibre: string;
  serie: string;
  estado: string;
}

// Nueva interfaz para la respuesta
interface PrestamosResponse {
  total: number;
  prestamos: Prestamo[];
}

// Obtener todos los préstamos "en uso" de un usuario
export async function getPrestamosEnUso(id_usuario: number): Promise<PrestamosResponse> {
  try {
    const response = await axiosPrestados.get<PrestamosResponse>(
      `/api/movimientos-equipos/prestamos-en-uso/${id_usuario}`
    );
    return response.data; // ✅ ahora contiene { total, prestamos }
  } catch (error) {
    console.error('Error al obtener préstamos en uso:', error);
    throw error;
  }
}
