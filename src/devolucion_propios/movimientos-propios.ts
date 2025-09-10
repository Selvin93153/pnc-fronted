import axiosMovimientos from './axiosPropios';

// Relación con préstamo
export interface Asignacion {
  id_asignacion: number;
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
  id_asignacion: Asignacion;
  id_usuario_entrega: Usuario;
  id_usuario_recibe: Usuario;
  fecha_entrega: string;
  hora_entrega: string;
  fecha_devolucion?: string;
  hora_devolucion?: string;
  comentarios?: string;
  estado: string;
}

// 👉 GET: obtener todos los movimientos
export const getMovimientos = async (): Promise<MovimientoEquipo[]> => {
  const response = await axiosMovimientos.get<MovimientoEquipo[]>('/api/movimientos-propios');
  return response.data;
};

// 👉 POST: crear movimiento
export const addMovimiento = async (data: {
  id_asignacion: number;
  id_usuario_entrega: number;
  id_usuario_recibe: number;
  fecha_entrega: string;
  hora_entrega: string;
  fecha_devolucion?: string;
  hora_devolucion?: string;
  comentarios?: string;
  estado?: string;
}): Promise<MovimientoEquipo> => {
  const response = await axiosMovimientos.post<MovimientoEquipo>('/api/movimientos-propios', data);
  return response.data;
};

// 👉 PUT: actualizar movimiento
export const updateMovimiento = async (id: number, data: Partial<Omit<MovimientoEquipo, 'id_movimiento'>>): Promise<MovimientoEquipo> => {
  const response = await axiosMovimientos.patch<MovimientoEquipo>(`/api/movimientos-propios/${id}`, data);
  return response.data;
};

// 👉 DELETE: eliminar movimiento
export const deleteMovimiento = async (id: number): Promise<void> => {
  await axiosMovimientos.delete(`/api/movimientos-propios/${id}`);
};
