// 👇 en devolucionTable.tsx
import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Chip, IconButton, Tooltip, Button, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  getMovimientos, updateMovimiento,
  type MovimientoEquipo
} from "./movimientos-devolucion";

const DevolucionTable: React.FC = () => {
  const [movimientos, setMovimientos] = useState<MovimientoEquipo[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [movSeleccionado, setMovSeleccionado] = useState<MovimientoEquipo | null>(null);

  const cargarMovimientos = async () => {
    const data = await getMovimientos();
    setMovimientos(data);
  };

  useEffect(() => { cargarMovimientos(); }, []);

  
  const handleAbrirDevolucion = (mov: MovimientoEquipo) => {
    setMovSeleccionado(mov);
    setComentarios("");
    setOpenDialog(true);
  };

  const handleConfirmarDevolucion = async () => {
    if (!movSeleccionado) return;

    const fechaActual = new Date();
    const fechaISO = fechaActual.toISOString().split("T")[0]; // YYYY-MM-DD
    const hora = fechaActual.toTimeString().split(" ")[0]; // HH:mm:ss

    await updateMovimiento(movSeleccionado.id_movimiento, {
      fecha_devolucion: fechaISO,
      hora_devolucion: hora,
      comentarios: comentarios || "Equipo devuelto",
      estado: "disponible",
    });

    setOpenDialog(false);
    setMovSeleccionado(null);
    cargarMovimientos();
  };

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        📋 DEVOLUCIONES DE EQUIPOS
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Aquí puedes aceptar la devolución de equipos prestados.
      </Typography>

      <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Clase</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Marca y Serie</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Entrega</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Recibe</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha Entrega</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hora Entrega</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha Devolución</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hora Devolución</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Comentarios</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {movimientos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay movimientos registrados.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              movimientos.map((mov) => (
                <TableRow key={mov.id_movimiento} hover>
                  <TableCell>{mov.id_prestamo.clase}</TableCell>
                  <TableCell>{mov.id_prestamo.marca} - {mov.id_prestamo.serie}</TableCell>
                  <TableCell>{mov.id_usuario_entrega.nombres} {mov.id_usuario_entrega.apellidos}</TableCell>
                  <TableCell>{mov.id_usuario_recibe.nombres} {mov.id_usuario_recibe.apellidos}</TableCell>
                  <TableCell>{mov.fecha_entrega}</TableCell>
                  <TableCell>{mov.hora_entrega}</TableCell>
                  <TableCell>{mov.fecha_devolucion || "-"}</TableCell>
                  <TableCell>{mov.hora_devolucion || "-"}</TableCell>
                  <TableCell>{mov.comentarios || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={mov.estado === "en uso" ? "En Uso" : "Disponible"}
                      color={mov.estado === "en uso" ? "warning" : "success"}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Devolución">
                      <IconButton
                        color="primary"
                        onClick={() => handleAbrirDevolucion(mov)}
                        disabled={mov.estado !== "en uso"}
                      >
                        <ReplayIcon />
                      </IconButton>
                    </Tooltip>
                    
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para devolución */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Registrar Devolución</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Comentarios"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarDevolucion} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DevolucionTable;
