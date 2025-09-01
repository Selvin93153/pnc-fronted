import { useState } from "react";
import axiosPrestamo from "./axiosprestamo";

interface MovimientoForm {
  id_prestamo: number | null;
  id_usuario_recibe: number;
  comentarios: string;
}

export const usePrestarPrestamo = (
  usuarioEntregaId: number,
  actualizarEstado: (idPrestamo: number) => void
) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<MovimientoForm>({
    id_prestamo: null,
    id_usuario_recibe: 0,
    comentarios: "",
  });

  const handleOpenDialog = (idPrestamo: number) => {
    setFormData((prev) => ({
      ...prev,
      id_prestamo: idPrestamo,
    }));
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

    const nuevoMovimiento = {
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
      await axiosPrestamo.post("/api/movimientos-equipos", nuevoMovimiento);

      // 2️⃣ Actualizar estado del equipo en la DB
      await axiosPrestamo.put(`/api/equipos-prestamo/${formData.id_prestamo}`, {
        estado: "en uso",
      });

      // 3️⃣ Actualizar estado en frontend
      actualizarEstado(formData.id_prestamo);

      // 4️⃣ Cerrar modal
      handleCloseDialog();
    } catch (error: any) {
      console.error("Error detalle:", error.response?.data || error.message);
      throw error; // el Snackbar en PrestamosTable se encarga de mostrar el error
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
