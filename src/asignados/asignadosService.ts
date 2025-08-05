import axiosAsignados from './axiosAsignados';

export async function getAsignados() {
  const response = await axiosAsignados.get('/api/equipos-asignados');
  return response.data;
}

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
