// src/asignadospropio/service.ts
import axiosPropio from './axiosPropio';
import type { EquipoAsignado } from './types';

export const getMisEquipos = async (): Promise<EquipoAsignado[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token de autenticación');

  const response = await axiosPropio.get<EquipoAsignado[]>('/api/equipos-asignados/mis-equipos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
