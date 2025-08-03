import axiosTipos from './axiosTipos';


export interface Tipos {
  id_tipo: number;
  nombre: string;
}

export const getTipos = async (): Promise<Tipos[]> => {
  const response = await axiosTipos.get<Tipos[]>('/api/tipos-equipos');
  return response.data;
};

export const addTipo = async (nombre: string): Promise<Tipos> => {
  const response = await axiosTipos.post<Tipos>("/api/tipos-equipos", { nombre });
  return response.data;
};

export const updateTipo = async (id: number, nombre: string): Promise<Tipos> => {
  const response = await axiosTipos.put<Tipos>(`/api/tipos-equipos/${id}`, { nombre });
  return response.data;
};