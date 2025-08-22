import axiosPrestamo from './axiosprestamo';

export interface TipoEquipo {
  id_tipo: number;
  nombre: string;
}

export interface EquipoPrestamo {
  id_prestamo: number;
  marca: string;
  calibre: string;
  serie: string;
  id_tipo: TipoEquipo;
  estado: string;
}

// Obtener todos los equipos en préstamo
export const getEquiposPrestamo = async (): Promise<EquipoPrestamo[]> => {
  const response = await axiosPrestamo.get<EquipoPrestamo[]>('/api/equipos-prestamo');
  return response.data;
};

// Crear un nuevo equipo en préstamo
export const addEquipoPrestamo = async (data: {
  marca: string;
  calibre: string;
  serie: string;
  id_tipo: number;
  estado?: string;
}): Promise<EquipoPrestamo> => {
  const response = await axiosPrestamo.post<EquipoPrestamo>('/api/equipos-prestamo', data);
  return response.data;
};

// Actualizar un equipo existente
export const updateEquipoPrestamo = async (id: number, data: {
  marca?: string;
  calibre?: string;
  serie?: string;
  id_tipo?: number;
  estado?: string;
}): Promise<EquipoPrestamo> => {
  const response = await axiosPrestamo.put<EquipoPrestamo>(`/api/equipos-prestamo/${id}`, data);
  return response.data;
};

// Eliminar un equipo
export const deleteEquipoPrestamo = async (id: number): Promise<void> => {
  await axiosPrestamo.delete(`/api/equipos-prestamo/${id}`);
};
