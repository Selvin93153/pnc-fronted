import axiosPrestados from './axiosPrestados';

export interface Prestamo {
  id_prestamo: number;
  clase: string;
  marca: string;
  calibre: string;
  serie: string;
  estado: string;
}

// Obtener todos los préstamos "en uso" de un usuario
export async function getPrestamosEnUso(id_usuario: number): Promise<Prestamo[]> {
  try {
    const response = await axiosPrestados.get<Prestamo[]>(`/api/movimientos-equipos/prestamos-en-uso/${id_usuario}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener préstamos en uso:', error);
    throw error;
  }
}
