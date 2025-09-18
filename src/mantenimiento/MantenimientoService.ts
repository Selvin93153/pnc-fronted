import axiosMantenimiento from './axiosMantenimiento';

// Interfaces
export interface Vehiculo {
  id_vehiculo: number;
  tipo: string;
  placa: string;
  marca: string;
  modelo: string;
  estado: string;
}

export interface Mantenimiento {
  id_mantenimiento: number;
  km_actual: number;
  km_servicioproximo: number;
  tipo_mantenimiento: string;
  descripcion: string;
  id_vehiculo: number | Vehiculo;
}

// Obtener todos los mantenimientos
export const getMantenimientos = async (): Promise<Mantenimiento[]> => {
  const { data } = await axiosMantenimiento.get<Mantenimiento[]>('/api/mantenimiento');
  return data;
};

// Crear nuevo mantenimiento
export const createMantenimiento = async (
  mantenimiento: Omit<Mantenimiento, 'id_mantenimiento' | 'id_vehiculo'> & { id_vehiculo: number }
) => {
  const { data } = await axiosMantenimiento.post('/api/mantenimiento', mantenimiento);
  return data;
};

// Editar mantenimiento
export const updateMantenimiento = async (
  id_mantenimiento: number,
  mantenimiento: Partial<Omit<Mantenimiento, 'id_vehiculo'>> & { id_vehiculo?: number }
) => {
  const { data } = await axiosMantenimiento.put(`/api/mantenimiento/${id_mantenimiento}`, mantenimiento);
  return data;
};
