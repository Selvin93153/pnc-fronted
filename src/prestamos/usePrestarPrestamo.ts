import { useState } from "react";
import { prestamosService, type MovimientoEquipo } from "./prestamos.service";

interface MovimientoForm {
  id_prestamo: number | null;
  id_usuario_recibe: number;
  comentarios: string;
}

export const usePrestarPrestamo = (
  usuarioEntregaId: number,
  actualizarEstado: (idPrestamo: number) => void,
  onSuccess?: (msg: string) => void,
  onError?: (msg: string) => void
) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<MovimientoForm>({
    id_prestamo: null,
    id_usuario_recibe: 0,
    comentarios: "",
  });

  const handleOpenDialog = (idPrestamo: number) => {
    setFormData((prev) => ({ ...prev, id_prestamo: idPrestamo }));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ id_prestamo: null, id_usuario_recibe: 0, comentarios: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrestar = async () => {
    if (!formData.id_prestamo || !formData.id_usuario_recibe) return;

    const nuevoMovimiento: MovimientoEquipo = {
      id_prestamo: formData.id_prestamo,
      id_usuario_entrega: usuarioEntregaId,
      id_usuario_recibe: formData.id_usuario_recibe,
      comentarios: formData.comentarios,
      estado: "en uso",
      fecha_devolucion: null,
      hora_devolucion: null,
    };

    try {
      // 1️⃣ Registrar movimiento
      await prestamosService.registrarMovimiento(nuevoMovimiento);

      // 2️⃣ Actualizar estado del equipo
      await prestamosService.updateEquipo(formData.id_prestamo, { estado: "en uso" });

      // 3️⃣ Actualizar estado en frontend
      actualizarEstado(formData.id_prestamo);

      onSuccess?.("✅ Equipo prestado con éxito");
      handleCloseDialog();
    } catch (error: any) {
      console.error("Error al prestar:", error.response?.data || error.message);
      onError?.("❌ Error al registrar el préstamo");
    }
  };

  return {
    openDialog,
    formData,
    handleOpenDialog,
    handleCloseDialog,
    handleChange,
    handlePrestar,
  };
};
