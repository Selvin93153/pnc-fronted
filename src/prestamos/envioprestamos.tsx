import axiosPrestamo from "./axiosprestamo"

// Tipo de datos que necesita movimientos_equipos
export interface MovimientoEquipo {
  id_movimiento?: number;
  id_prestamo: number;            // referencia al equipo prestado
  id_usuario_entrega: number;     // quien entrega el equipo
  id_usuario_recibe: number;      // quien recibe el equipo
  comentarios?: string;           // comentarios opcionales
  estado: "en uso";               // siempre "en uso" al crear un préstamo
  fecha_devolucion?: string | null; // null por defecto
  hora_devolucion?: string | null;  // null por defecto
}

// Crear movimiento (ej: prestar un equipo)
export const registrarMovimiento = async (mov: MovimientoEquipo) => {
  const res = await axiosPrestamo.post("/api/movimientos-equipos", mov);
  return res.data;
};
