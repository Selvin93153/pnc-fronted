import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem
} from "@mui/material";
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


// Aca se guarda el usuario que tiene iniciada la sesion para cargarlo al camgo id_usuario_entrega
  const usuarioLogueado = localStorage.getItem("usuario");
const usuarioEntregaId = usuarioLogueado ? JSON.parse(usuarioLogueado).id_usuario : null;

if (!usuarioEntregaId) {
  console.error("No hay usuario logueado");
}
  

  // Función para actualizar estado de un equipo después de prestar
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
    handlePrestar,
  } = usePrestarPrestamo(usuarioEntregaId, actualizarEstado);

  // Cargar equipos
  useEffect(() => {
    axiosPrestamo.get("/api/equipos-prestamo")
      .then((res) => setPrestamos(res.data))
      .catch(console.error);
  }, []);

  // Cargar usuarios
  useEffect(() => {
    axiosPrestamo.get("/api/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Calibre</TableCell>
              <TableCell>Serie</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamos.map((prestamo) => (
              <TableRow key={prestamo.id_prestamo}>
                <TableCell>{prestamo.id_prestamo}</TableCell>
                <TableCell>{prestamo.marca}</TableCell>
                <TableCell>{prestamo.calibre}</TableCell>
                <TableCell>{prestamo.serie}</TableCell>
                <TableCell>{prestamo.estado}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(prestamo.id_prestamo)}
                    disabled={prestamo.estado !== "activo"}
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Prestar equipo</DialogTitle>
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
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handlePrestar} variant="contained" color="primary">
            Confirmar préstamo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PrestamosTable;
