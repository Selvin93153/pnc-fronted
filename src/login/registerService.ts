// src/services/registerService.ts
import { publicClient } from './publicClient';

export interface RegisterUserData {
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
  contraseña: string;
  id_rol: number;
}

export interface RegisterResponse {
  message: string;
}

export const registerUser = async (data: RegisterUserData): Promise<RegisterResponse> => {
  const response = await publicClient.post<RegisterResponse>('/api/usuarios/register', data);
  return response.data;
};
