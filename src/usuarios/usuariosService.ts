import axiosUsuarios from './axiosUsuarios';


export interface Usuarios {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
  contraseña: string;
}

export const getUsuarios = async (): Promise<Usuarios[]> => {
  const response = await axiosUsuarios.get<Usuarios[]>('/api/usuarios');
  return response.data;
};
