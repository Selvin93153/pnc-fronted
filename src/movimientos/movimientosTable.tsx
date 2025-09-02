import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Chip, IconButton, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getMovimientos, deleteMovimiento,
  type MovimientoEquipo
} from "./movimientos-equipos";

const MovimientosTable: React.FC = () => {
  const [movimientos, setMovimientos] = useState<MovimientoEquipo[]>([]);

  const cargarMovimientos = async () => {
    const data = await getMovimientos();
    setMovimientos(data);
  };

  useEffect(() => { cargarMovimientos(); }, []);

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este movimiento?")) return;
    await deleteMovimiento(id);
    cargarMovimientos();
  };

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        📋 Historial de Movimientos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Aquí puedes visualizar todos los movimientos de préstamos registrados.
      </Typography>

      <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Clase</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Marca  y Serie</TableCell>
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
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
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
                      label={mov.estado === "en uso" ? "En Uso" : "Devuelto"}
                      color={mov.estado === "en uso" ? "warning" : "success"}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleEliminar(mov.id_movimiento)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MovimientosTable;
