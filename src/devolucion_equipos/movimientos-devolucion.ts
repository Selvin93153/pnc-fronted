import axiosMovimientos from './axiosDevolucion';

// Relación con préstamo
export interface Prestamo {
  id_prestamo: number;
  clase: string;
  marca: string;
  calibre: string;
  serie: string;
  estado: string;
}

// Relación con usuario
export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
}

export interface MovimientoEquipo {
  id_movimiento: number;
  id_prestamo: Prestamo;
  id_usuario_entrega: Usuario;
  id_usuario_recibe: Usuario;
  fecha_entrega: string;
  hora_entrega: string;
  fecha_devolucion?: string;
  hora_devolucion?: string;
  comentarios?: string;
  estado: string;
}

// GET: obtener todos los movimientos
export const getMovimientos = async (): Promise<MovimientoEquipo[]> => {
  const response = await axiosMovimientos.get<MovimientoEquipo[]>('/api/movimientos-equipos');
  return response.data;
};

// POST: crear movimiento
export const addMovimiento = async (data: {
  id_prestamo: number;
  id_usuario_entrega: number;
  id_usuario_recibe: number;
  fecha_entrega: string;
  hora_entrega: string;
  fecha_devolucion?: string;
  hora_devolucion?: string;
  comentarios?: string;
  estado?: string;
}): Promise<MovimientoEquipo> => {
  const response = await axiosMovimientos.post<MovimientoEquipo>('/api/movimientos-equipos', data);
  return response.data;
};

// PUT: actualizar movimiento
export const updateMovimiento = async (id: number, data: Partial<Omit<MovimientoEquipo, 'id_movimiento'>>): Promise<MovimientoEquipo> => {
  const response = await axiosMovimientos.patch<MovimientoEquipo>(`/api/movimientos-equipos/${id}`, data);
  return response.data;
};

// DELETE: eliminar movimiento
export const deleteMovimiento = async (id: number): Promise<void> => {
  await axiosMovimientos.delete(`/api/movimientos-equipos/${id}`);
};

// GET: buscar movimientos por NIP
export const getMovimientosPorNip = async (nip: string): Promise<MovimientoEquipo[]> => {
  const response = await axiosMovimientos.get<MovimientoEquipo[]>(`/api/movimientos-equipos/por-nip/${nip}`);
  return response.data;
};