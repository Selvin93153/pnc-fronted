import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import { CheckCircle, Close, Send } from "@mui/icons-material";
import axiosPrestamo from "./axiosprestamo";
import { usePrestarPrestamo } from "./usePrestarPrestamo";

interface Prestamo {
  id_prestamo: number;
  marca: string;
  calibre: string;
  serie: string;
  estado: string;
}

interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
}

const PrestamosTable: React.FC = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "disponible" | "en uso">(
    "todos"
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");

  const usuarioLogueado = localStorage.getItem("usuario");
  const usuarioEntregaId = usuarioLogueado
    ? JSON.parse(usuarioLogueado).id_usuario
    : null;

  if (!usuarioEntregaId) console.error("No hay usuario logueado");

  const actualizarEstado = (idPrestamo: number) => {
    setPrestamos((prev) =>
      prev.map((p) =>
        p.id_prestamo === idPrestamo ? { ...p, estado: "en uso" } : p
      )
    );
  };

  const {
    openDialog,
    formData,
    handleOpenDialog,
    handleCloseDialog,
    handleChange,
  } = usePrestarPrestamo(usuarioEntregaId!, actualizarEstado);

  // Cargar equipos
  useEffect(() => {
    axiosPrestamo
      .get("/api/equipos-prestamo")
      .then((res) => setPrestamos(res.data))
      .catch(console.error);
  }, []);

  // Cargar usuarios
  useEffect(() => {
    axiosPrestamo
      .get("/api/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch(console.error);
  }, []);

  // Equipos filtrados
  const prestamosFiltrados = prestamos.filter((p) => {
    if (filtro === "todos") return true;
    return p.estado === filtro;
  });

  // Nueva función para prestar con actualización de DB y Snackbar
  const handlePrestar = async () => {
    if (!formData.id_usuario_recibe || !formData.id_prestamo) return;

    try {
      // Registrar movimiento
      await axiosPrestamo.post("/api/movimientos-equipos", {
        id_prestamo: formData.id_prestamo,
        id_usuario_entrega: usuarioEntregaId,
        id_usuario_recibe: formData.id_usuario_recibe,
        comentarios: formData.comentarios,
        estado: "en uso",
        fecha_devolucion: null,
        hora_devolucion: null,
      });

      // Actualizar estado del equipo en DB
      await axiosPrestamo.put(`/api/equipos-prestamo/${formData.id_prestamo}`, {
        estado: "en uso",
      });

      // Actualizar estado en frontend
      actualizarEstado(formData.id_prestamo);

      // Mostrar mensaje emergente
      setMensajeSnackbar("✅ Equipo prestado con éxito");
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      setMensajeSnackbar("❌ Error al registrar el préstamo");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        📋 Gestión de Préstamos de Equipos
      </Typography>

      {/* Filtro por estado */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Filtrar por estado</InputLabel>
        <Select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as any)}
          label="Filtrar por estado"
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="disponible">Disponibles</MenuItem>
          <MenuItem value="en uso">En uso</MenuItem>
        </Select>
      </FormControl>

      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          borderRadius: 3,
          boxShadow: 4,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Marca</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Calibre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Serie</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamosFiltrados.map((prestamo) => (
              <TableRow
                key={prestamo.id_prestamo}
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "0.2s",
                }}
              >
                <TableCell>{prestamo.id_prestamo}</TableCell>
                <TableCell>{prestamo.marca}</TableCell>
                <TableCell>{prestamo.calibre}</TableCell>
                <TableCell>{prestamo.serie}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={
                      prestamo.estado === "disponible" ? "success.main" : "error.main"
                    }
                  >
                    {prestamo.estado}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Send />}
                    onClick={() => handleOpenDialog(prestamo.id_prestamo)}
                    disabled={prestamo.estado !== "disponible"}
                    sx={{ borderRadius: 2 }}
                  >
                    Prestar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Prestar */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle fontWeight="bold" color="primary">
          🎯 Prestar equipo
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Usuario que recibe"
            name="id_usuario_recibe"
            value={formData.id_usuario_recibe}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            {usuarios.map((user) => (
              <MenuItem key={user.id_usuario} value={user.id_usuario}>
                {user.nombres} {user.apellidos}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Comentarios"
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
            fullWidth
            margin="dense"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            startIcon={<Close />}
            variant="outlined"
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePrestar}
            startIcon={<CheckCircle />}
            variant="contained"
            color="primary"
          >
            Confirmar préstamo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={mensajeSnackbar.includes("✅") ? "success" : "error"}
          sx={{
            width: "100%",
            borderRadius: 2,
            fontWeight: "bold",
          }}
        >
          {mensajeSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrestamosTable;
