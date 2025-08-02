import axiosClient from './axiosClient';

export interface Role {
  id_rol: number;
  nombre_rol: string;
}

export const getRoles = async (): Promise<Role[]> => {
  const response = await axiosClient.get<Role[]>('/api/roles');
  return response.data;
};
export const addRole = async (nombre_rol: string): Promise<Role> => {
  const response = await axiosClient.post<Role>('/api/roles', { nombre_rol });
  return response.data;
};