import axiosPrestamo from "../prestamos/axiosPrestamos";

// Tipos
export interface MovimientoEquipo {
  id_movimiento?: number;
  id_prestamo: number;
  id_usuario_entrega: number;
  id_usuario_recibe: number;
  comentarios?: string;
  estado: "en uso";
  fecha_devolucion?: string | null;
  hora_devolucion?: string | null;
}

export interface TipoEquipo {
  id_tipo: number;
  nombre: string;
}

export interface EquipoPrestamo {
  id_prestamo: number;
  clase: string;
  marca: string;
  calibre: string;
  serie: string;
  id_tipo: TipoEquipo;
  estado: string;
}

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
}

// Servicios
export const prestamosService = {
  // Movimientos
  registrarMovimiento: async (mov: MovimientoEquipo) => {
    const res = await axiosPrestamo.post("/api/movimientos-equipos", mov);
    return res.data;
  },

  // Equipos
  getEquipos: async (): Promise<EquipoPrestamo[]> => {
    const res = await axiosPrestamo.get("/api/equipos-prestamo");
    return res.data;
  },

  addEquipo: async (data: {
    marca: string;
    calibre: string;
    serie: string;
    id_tipo: number;
    estado?: string;
  }): Promise<EquipoPrestamo> => {
    const res = await axiosPrestamo.post("/api/equipos-prestamo", data);
    return res.data;
  },

  updateEquipo: async (
    id: number,
    data: Partial<Omit<EquipoPrestamo, "id_prestamo" | "id_tipo">>
  ): Promise<EquipoPrestamo> => {
    const res = await axiosPrestamo.put(`/api/equipos-prestamo/${id}`, data);
    return res.data;
  },

  deleteEquipo: async (id: number): Promise<void> => {
    await axiosPrestamo.delete(`/api/equipos-prestamo/${id}`);
  },

  // Usuarios
  getUsuarios: async (): Promise<Usuario[]> => {
    const res = await axiosPrestamo.get("/api/usuarios");
    return res.data;
  },

  // Tipos de equipo
getTipos: async (): Promise<TipoEquipo[]> => {
  const res = await axiosPrestamo.get("/api/tipos-equipos");
  return res.data;
}

};


