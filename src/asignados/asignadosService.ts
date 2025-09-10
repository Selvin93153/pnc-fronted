// src/asignados/asignadosService.ts
import axiosAsignados from './axiosAsignados';


// 🔹 Interfaces
export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
}

export interface Tipo {
  id_tipo: number;
  nombre: string;
}

export interface Asignado {
  id_asignacion: number;
  clase: string;
  marca?: string;
  calibre?: string;
  serie: string;
  estado: string;
  id_tipo: Tipo;
  id_usuario: Usuario;
  tipo: Tipo;
  usuario: Usuario;
}

export interface Movimiento {
  id_asignacion: number;
  id_usuario_entrega: number;
  id_usuario_recibe: number;
  fecha_devolucion?: string | null;
  hora_devolucion?: string | null;
  comentarios?: string;
  estado: string;
}

// 🔹 Funciones para equipos asignados
export async function getAsignados(): Promise<Asignado[]> {
  const response = await axiosAsignados.get('/api/equipos-asignados');
  return response.data;
}

export async function createAsignado(data: {
  clase: string;
  marca?: string;
  calibre?: string;
  serie: string;
  estado: string;
  id_tipo: number;
  id_usuario: number;
}) {
  const response = await axiosAsignados.post('/api/equipos-asignados', data);
  return response.data;
}

export async function updateAsignado(id_asignacion: number, data: Partial<Asignado>) {
  const response = await axiosAsignados.put(`/api/equipos-asignados/${id_asignacion}`, data);
  return response.data;
}

// 🔹 Funciones para tipos y usuarios
export async function getTipos(): Promise<Tipo[]> {
  const response = await axiosAsignados.get(`/api/tipos-equipos`);
  return response.data;
}

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await axiosAsignados.get(`/api/usuarios`);
  return response.data;
}

// 🔹 Función para registrar movimientos propios (POST)
export async function addMovimiento(data: Movimiento) {
  const response = await axiosAsignados.post('/api/movimientos-propios', data);
  return response.data;
}