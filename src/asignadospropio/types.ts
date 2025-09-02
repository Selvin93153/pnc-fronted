export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
}

export interface TipoEquipo {
  id_tipo: number;
  nombre: string;
}

export interface EquipoAsignado {
  id_asignacion: number;
  clase: string;
  marca: string;
  calibre: string;
  serie: string;
  usuario: Usuario;
  tipo: TipoEquipo;
}
