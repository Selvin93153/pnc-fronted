import axiosClient from './axiosClient';

export interface Role {
  id_rol: number;
  nombre_rol: string;
}

export const getRoles = async (): Promise<Role[]> => {
  const response = await axiosClient.get<Role[]>('/api/roles');
  return response.data;
};
