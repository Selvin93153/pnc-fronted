import axiosPropio from './axiosPropio';
import type { EquipoAsignado } from './types';

interface MisEquiposResponse {
  total: number;
  equipos: EquipoAsignado[];
}

export const getMisEquipos = async (): Promise<MisEquiposResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token de autenticación');

  const response = await axiosPropio.get<MisEquiposResponse>('/api/equipos-asignados/mis-equipos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // ✅ ahora contiene { total, equipos }
};
