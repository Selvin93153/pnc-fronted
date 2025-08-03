
import axiosUsuarios from './axiosUsuarios';

export interface Rol {
  id_rol: number;
  nombre_rol: string;
}

// Para mostrar usuarios (vienen con el objeto rol completo)
export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
  contraseña: string;
  rol: Rol;   // objeto rol completo
}

// Para crear un usuario (se envía solo id_rol)
export interface UsuarioCrear {
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
  contraseña: string;
  id_rol: number;  // sólo id del rol
}

// Obtener lista de usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await axiosUsuarios.get<Usuario[]>('/api/usuarios');
  return response.data;
};

// Obtener lista de roles
export const getRoles = async (): Promise<Rol[]> => {
  const res = await axiosUsuarios.get<Rol[]>("/api/roles");
  return res.data;
};

// Agregar usuario, recibe UsuarioCrear
export const addUsuario = async (usuario: UsuarioCrear): Promise<Usuario> => {
  const res = await axiosUsuarios.post<Usuario>("/api/usuarios", usuario);
  return res.data;
};

// Actualizar usuario (puede enviar cualquier campo parcial)
export const updateUsuario = async (
  id: number,
  usuario: Partial<Usuario>
): Promise<Usuario> => {
  const res = await axiosUsuarios.put<Usuario>(`/api/usuarios/${id}`, usuario);
  return res.data;
};
