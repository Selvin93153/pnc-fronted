import { useState } from "react";
import axiosPrestamo from "./axiosprestamo";

interface MovimientoForm {
  id_usuario_recibe: number;
  comentarios: string;
}

export const usePrestarPrestamo = (usuarioEntregaId: number, actualizarEstado: (idPrestamo: number) => void) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrestamo, setSelectedPrestamo] = useState<number | null>(null);
  const [formData, setFormData] = useState<MovimientoForm>({
    id_usuario_recibe: 0,
    comentarios: "",
  });

  const handleOpenDialog = (idPrestamo: number) => {
    setSelectedPrestamo(idPrestamo);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ id_usuario_recibe: 0, comentarios: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrestar = async () => {
    if (!selectedPrestamo || !formData.id_usuario_recibe) return;

    const nuevoMovimiento = {
      id_prestamo: selectedPrestamo,
      id_usuario_entrega: usuarioEntregaId,
      id_usuario_recibe: formData.id_usuario_recibe,
      comentarios: formData.comentarios,
      estado: "en uso",
      fecha_devolucion: null,
      hora_devolucion: null,
    };

    try {
      await axiosPrestamo.post("/api/movimientos-equipos", nuevoMovimiento);
      alert("Equipo prestado con éxito ✅");

      // Actualizar estado en la tabla
      actualizarEstado(selectedPrestamo);

      handleCloseDialog();
    } catch (error: any) {
      console.error("Error detalle:", error.response?.data || error.message);
      alert("Error al registrar el préstamo ❌");
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
