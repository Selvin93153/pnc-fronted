import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

import {
  getMovimientos, addMovimiento, updateMovimiento, deleteMovimiento,
  type MovimientoEquipo, type Prestamo, type Usuario
} from "./movimientos-equipos";

// 👇 TODO: Cargar desde API (ejemplo: /api/equipos-prestamo y /api/usuarios)
const prestamosMock: Prestamo[] = [
  { id_prestamo: 1, marca: "Colt", calibre: "5.56 mm", serie: "AR12345678", estado: "activo" },
  { id_prestamo: 2, marca: "Motorola", calibre: "N/A", serie: "RADIO123", estado: "activo" }
];

const usuariosMock: Usuario[] = [
  { id_usuario: 6, nombres: "Carlos", apellidos: "Martínez", nip: "PNC5555", correo: "carlos@mail.com" },
  { id_usuario: 8, nombres: "Marck", apellidos: "Cordon", nip: "62533-p", correo: "marck@mail.com" }
];

const MovimientosTable: React.FC = () => {
  const [movimientos, setMovimientos] = useState<MovimientoEquipo[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const cargarMovimientos = async () => {
    const data = await getMovimientos();
    setMovimientos(data);
  };

  useEffect(() => { cargarMovimientos(); }, []);

  const handleCrear = async () => {
    await addMovimiento({
      id_prestamo: formData.id_prestamo,
      id_usuario_entrega: formData.id_usuario_entrega,
      id_usuario_recibe: formData.id_usuario_recibe,
      fecha_entrega: formData.fecha_entrega,
      hora_entrega: formData.hora_entrega,
      fecha_devolucion: formData.fecha_devolucion,
      hora_devolucion: formData.hora_devolucion,
      comentarios: formData.comentarios,
      estado: formData.estado || "en uso",
    });
    cargarMovimientos();
    setOpen(false);
    setFormData({});
  };

  const handleEditar = async () => {
    if (!formData.id_movimiento) return;
    await updateMovimiento(formData.id_movimiento, formData);
    cargarMovimientos();
    setOpen(false);
    setFormData({});
  };

  const handleEliminar = async (id: number) => {
    await deleteMovimiento(id);
    cargarMovimientos();
  };

  const openForm = (mov?: MovimientoEquipo) => {
    if (mov) {
      setFormData({
        id_movimiento: mov.id_movimiento,
        id_prestamo: mov.id_prestamo.id_prestamo,
        id_usuario_entrega: mov.id_usuario_entrega.id_usuario,
        id_usuario_recibe: mov.id_usuario_recibe.id_usuario,
        fecha_entrega: mov.fecha_entrega,
        hora_entrega: mov.hora_entrega,
        fecha_devolucion: mov.fecha_devolucion,
        hora_devolucion: mov.hora_devolucion,
        comentarios: mov.comentarios,
        estado: mov.estado
      });
    } else {
      setFormData({});
    }
    setOpen(true);
  };

  return (
    <TableContainer component={Paper}>
      <Button onClick={() => openForm()} variant="contained" sx={{ m: 2 }}>
        Nuevo Movimiento
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Equipo</TableCell>
            <TableCell>Entrega</TableCell>
            <TableCell>Recibe</TableCell>
            <TableCell>Fecha Entrega</TableCell>
            <TableCell>Hora Entrega</TableCell>
            <TableCell>Fecha Devolución</TableCell>
            <TableCell>Hora Devolución</TableCell>
            <TableCell>Comentarios</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movimientos.map((mov) => (
            <TableRow key={mov.id_movimiento}>
              <TableCell>{mov.id_prestamo.marca} - {mov.id_prestamo.serie}</TableCell>
              <TableCell>{mov.id_usuario_entrega.nombres} {mov.id_usuario_entrega.apellidos}</TableCell>
              <TableCell>{mov.id_usuario_recibe.nombres} {mov.id_usuario_recibe.apellidos}</TableCell>
              <TableCell>{mov.fecha_entrega}</TableCell>
              <TableCell>{mov.hora_entrega}</TableCell>
              <TableCell>{mov.fecha_devolucion || "-"}</TableCell>
              <TableCell>{mov.hora_devolucion || "-"}</TableCell>
              <TableCell>{mov.comentarios}</TableCell>
              <TableCell>{mov.estado}</TableCell>
              <TableCell>
                <Button onClick={() => openForm(mov)} sx={{ mr: 1 }}>Editar</Button>
                <Button color="error" onClick={() => handleEliminar(mov.id_movimiento)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal para crear/editar */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{formData.id_movimiento ? "Editar Movimiento" : "Nuevo Movimiento"}</DialogTitle>
        <DialogContent>
          {/* Equipo */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="prestamo-label">Equipo</InputLabel>
            <Select
              labelId="prestamo-label"
              value={formData.id_prestamo || ""}
              onChange={(e) => setFormData({ ...formData, id_prestamo: e.target.value })}
            >
              {prestamosMock.map((p) => (
                <MenuItem key={p.id_prestamo} value={p.id_prestamo}>
                  {p.marca} - {p.serie}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Usuario entrega */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="entrega-label">Usuario Entrega</InputLabel>
            <Select
              labelId="entrega-label"
              value={formData.id_usuario_entrega || ""}
              onChange={(e) => setFormData({ ...formData, id_usuario_entrega: e.target.value })}
            >
              {usuariosMock.map((u) => (
                <MenuItem key={u.id_usuario} value={u.id_usuario}>
                  {u.nombres} {u.apellidos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Usuario recibe */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="recibe-label">Usuario Recibe</InputLabel>
            <Select
              labelId="recibe-label"
              value={formData.id_usuario_recibe || ""}
              onChange={(e) => setFormData({ ...formData, id_usuario_recibe: e.target.value })}
            >
              {usuariosMock.map((u) => (
                <MenuItem key={u.id_usuario} value={u.id_usuario}>
                  {u.nombres} {u.apellidos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Fechas y horas */}
          <TextField
            label="Fecha Entrega" type="date" fullWidth margin="dense"
            value={formData.fecha_entrega || ""} InputLabelProps={{ shrink: true }}
            onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
          />
          <TextField
            label="Hora Entrega" type="time" fullWidth margin="dense"
            value={formData.hora_entrega || ""} InputLabelProps={{ shrink: true }}
            onChange={(e) => setFormData({ ...formData, hora_entrega: e.target.value })}
          />
          <TextField
            label="Fecha Devolución" type="date" fullWidth margin="dense"
            value={formData.fecha_devolucion || ""} InputLabelProps={{ shrink: true }}
            onChange={(e) => setFormData({ ...formData, fecha_devolucion: e.target.value })}
          />
          <TextField
            label="Hora Devolución" type="time" fullWidth margin="dense"
            value={formData.hora_devolucion || ""} InputLabelProps={{ shrink: true }}
            onChange={(e) => setFormData({ ...formData, hora_devolucion: e.target.value })}
          />
          <TextField
            label="Comentarios" fullWidth margin="dense"
            value={formData.comentarios || ""} onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
          />

          {/* Estado */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              value={formData.estado || "en uso"}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
              <MenuItem value="en uso">En Uso</MenuItem>
              <MenuItem value="devuelto">Devuelto</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={formData.id_movimiento ? handleEditar : handleCrear}>
            {formData.id_movimiento ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default MovimientosTable;
