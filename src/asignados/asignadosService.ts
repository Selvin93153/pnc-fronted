// src/asignados/asignadosService.ts
import axiosAsignados from './axiosAsignados';
import axios from 'axios';


const API_BASE = import.meta.env.VITE_API_URL;


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
  id_tipo: Tipo;
  id_usuario: Usuario;
}


// Obtener asignaciones
export async function getAsignados(): Promise<Asignado[]> {
  const response = await axiosAsignados.get('/api/equipos-asignados');
  return response.data;
}

// Crear nueva asignación
export async function createAsignado(data: {
  clase: string;
  marca?: string;
  calibre?: string;
  serie: string;
  id_tipo: number;
  id_usuario: number;
}) {
  const response = await axiosAsignados.post('/api/equipos-asignados', data);
  return response.data;
}

// Obtener tipos de equipos
export async function getTipos(): Promise<Tipo[]> {
  const response = await axios.get(`${API_BASE}/api/tipos-equipos`);
  return response.data;
}

// Obtener usuarios
export async function getUsuarios(): Promise<Usuario[]> {
  const response = await axios.get(`${API_BASE}/api/usuarios`);
  return response.data;
}
