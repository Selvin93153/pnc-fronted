import axiosTipos from './axiosTipos';


export interface Tipos {
  id_tipo: number;
  nombre: string;
}

export const getTipos = async (): Promise<Tipos[]> => {
  const response = await axiosTipos.get<Tipos[]>('/api/tipos-equipos');
  return response.data;
};
