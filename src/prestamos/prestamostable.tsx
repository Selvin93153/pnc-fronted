import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem,
  Select, FormControl, InputLabel, Snackbar, Alert,
  Typography, Box,
} from "@mui/material";
import { CheckCircle, Close, Send, AddCircle, Edit } from "@mui/icons-material";
import { prestamosService, type EquipoPrestamo, type Usuario, type TipoEquipo } from "./prestamos.service";
import { usePrestarPrestamo } from "./usePrestarPrestamo";

const PrestamosTable: React.FC = () => {
  const [prestamos, setPrestamos] = useState<EquipoPrestamo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tipos, setTipos] = useState<TipoEquipo[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "disponible" | "en uso">("todos");
  const [filtroTipo, setFiltroTipo] = useState<number | "todos">("todos");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");

  // Editar equipo
  const [openEditar, setOpenEditar] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState<EquipoPrestamo | null>(null);

  // Nuevo equipo
  const [openNuevoEquipo, setOpenNuevoEquipo] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    clase: "",
    marca: "",
    calibre: "",
    serie: "",
    id_tipo: 0,
    estado: "disponible",
  });

  const usuarioLogueado = localStorage.getItem("usuario");
  const usuarioEntregaId = usuarioLogueado ? JSON.parse(usuarioLogueado).id_usuario : null;
  if (!usuarioEntregaId) console.error("No hay usuario logueado");

  // Función para actualizar estado después de prestar
  const actualizarEstado = (idPrestamo: number) => {
    setPrestamos((prev) =>
      prev.map((p) =>
        p.id_prestamo === idPrestamo ? { ...p, estado: "en uso" } : p
      )
    );
  };

  // Hook para Prestar
  const {
    openDialog,
    formData,
    handleOpenDialog,
    handleCloseDialog,
    handleChange,
    handlePrestar,
  } = usePrestarPrestamo(
    usuarioEntregaId!,
    actualizarEstado,
    (msg) => { setMensajeSnackbar(msg); setOpenSnackbar(true); },
    (msg) => { setMensajeSnackbar(msg); setOpenSnackbar(true); }
  );

  // Cargar equipos
  const cargarEquipos = async () => {
    try {
      const data = await prestamosService.getEquipos();
      setPrestamos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { cargarEquipos(); }, []);

  // Cargar tipos de equipo
  useEffect(() => {
    prestamosService.getTipos()
      .then(setTipos)
      .catch(console.error);
  }, []);

  // Cargar usuarios
  useEffect(() => {
    prestamosService.getUsuarios()
      .then(setUsuarios)
      .catch(console.error);
  }, []);

  // Filtrado por tipo
  useEffect(() => {
    if (filtroTipo === "todos") {
      cargarEquipos();
    } else {
      prestamosService.getEquiposPorTipo(Number(filtroTipo))
        .then(setPrestamos)
        .catch(console.error);
    }
  }, [filtroTipo]);

  // Filtrado por estado
  const prestamosFiltrados = prestamos.filter((p) =>
    (filtro === "todos" ? true : p.estado === filtro)
  );

  // Guardar edición
  const handleGuardarEdicion = async () => {
    if (!equipoEditando) return;
    try {
      const actualizado = await prestamosService.updateEquipo(
        equipoEditando.id_prestamo,
        {
          clase: equipoEditando.clase,
          marca: equipoEditando.marca,
          calibre: equipoEditando.calibre,
          serie: equipoEditando.serie,
          estado: equipoEditando.estado,
          id_tipo: equipoEditando.id_tipo, // objeto TipoEquipo
        }
      );
      setPrestamos((prev) =>
        prev.map((p) =>
          p.id_prestamo === actualizado.id_prestamo ? actualizado : p
        )
      );
      setMensajeSnackbar("✅ Equipo actualizado con éxito");
      setOpenSnackbar(true);
      setOpenEditar(false);
      setEquipoEditando(null);
    } catch (error) {
      console.error("Error al actualizar equipo:", error);
      setMensajeSnackbar("❌ Error al actualizar equipo");
      setOpenSnackbar(true);
    }
  };

  // Guardar nuevo equipo
  const handleGuardarNuevoEquipo = async () => {
    try {
      const creado = await prestamosService.addEquipo(nuevoEquipo);
      setPrestamos((prev) => [...prev, creado]);
      setMensajeSnackbar("✅ Equipo agregado con éxito");
      setOpenSnackbar(true);
      setOpenNuevoEquipo(false);
      setNuevoEquipo({ clase: "", marca: "", calibre: "", serie: "", id_tipo: 0, estado: "disponible" });
    } catch (error) {
      console.error("Error al agregar equipo:", error);
      setMensajeSnackbar("❌ Error al agregar equipo");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        📋 Gestión de Préstamos de Equipos
      </Typography>

      {/* Botón nuevo equipo */}
      <Button
        variant="contained"
        color="success"
        startIcon={<AddCircle />}
        onClick={() => setOpenNuevoEquipo(true)}
        sx={{ mb: 2, borderRadius: 2 }}
      >
        Ingresar nuevo equipo
      </Button>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl fullWidth>
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

        <FormControl fullWidth>
          <InputLabel>Filtrar por tipo</InputLabel>
          <Select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            label="Filtrar por tipo"
          >
            <MenuItem value="todos">Todos</MenuItem>
            {tipos.map((t) => (
              <MenuItem key={t.id_tipo} value={t.id_tipo}>
                {t.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Clase</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Marca</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Calibre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Serie</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamosFiltrados.map((prestamo) => (
              <TableRow key={prestamo.id_prestamo}>
                <TableCell>{prestamo.clase}</TableCell>
                <TableCell>{prestamo.marca}</TableCell>
                <TableCell>{prestamo.calibre}</TableCell>
                <TableCell>{prestamo.serie}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={prestamo.estado === "disponible" ? "success.main" : "error.main"}
                  >
                    {prestamo.estado}
                  </Typography>
                </TableCell>
                <TableCell>
                  {/* Botón Prestar */}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Send />}
                    onClick={() => handleOpenDialog(prestamo.id_prestamo)}
                    disabled={prestamo.estado !== "disponible"}
                    sx={{ borderRadius: 2, mr: 1 }}
                  >
                    Prestar
                  </Button>

                  {/* Botón Editar */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Edit />}
                    sx={{ borderRadius: 2 }}
                    onClick={() => {
                      setEquipoEditando(prestamo);
                      setOpenEditar(true);
                    }}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Prestar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle fontWeight="bold" color="primary">🎯 Prestar equipo</DialogTitle>
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
          <Button onClick={handleCloseDialog} startIcon={<Close />} variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button onClick={handlePrestar} startIcon={<CheckCircle />} variant="contained" color="primary">
            Confirmar préstamo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={openEditar} onClose={() => setOpenEditar(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle fontWeight="bold" color="primary">✏️ Editar equipo</DialogTitle>
        <DialogContent>
          <TextField
            label="Clase"
            value={equipoEditando?.clase || ""}
            onChange={(e) => setEquipoEditando({ ...equipoEditando!, clase: e.target.value })}
            fullWidth margin="dense"
          />
          <TextField
            label="Marca"
            value={equipoEditando?.marca || ""}
            onChange={(e) => setEquipoEditando({ ...equipoEditando!, marca: e.target.value })}
            fullWidth margin="dense"
          />
          <TextField
            label="Calibre"
            value={equipoEditando?.calibre || ""}
            onChange={(e) => setEquipoEditando({ ...equipoEditando!, calibre: e.target.value })}
            fullWidth margin="dense"
          />
          <TextField
            label="Serie"
            value={equipoEditando?.serie || ""}
            onChange={(e) => setEquipoEditando({ ...equipoEditando!, serie: e.target.value })}
            fullWidth margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo de equipo</InputLabel>
            <Select
              value={equipoEditando?.id_tipo.id_tipo || ""}
              onChange={(e) => {
                const tipoSeleccionado = tipos.find(t => t.id_tipo === Number(e.target.value));
                if (tipoSeleccionado) setEquipoEditando({ ...equipoEditando!, id_tipo: tipoSeleccionado });
              }}
            >
              {tipos.map(t => (
                <MenuItem key={t.id_tipo} value={t.id_tipo}>{t.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditar(false)} startIcon={<Close />} variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleGuardarEdicion} startIcon={<CheckCircle />} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog nuevo equipo */}
      <Dialog open={openNuevoEquipo} onClose={() => setOpenNuevoEquipo(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle fontWeight="bold" color="success.main">➕ Ingresar nuevo equipo</DialogTitle>
        <DialogContent>
          <TextField
            label="Clase"
            value={nuevoEquipo.clase}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, clase: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Marca"
            value={nuevoEquipo.marca}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, marca: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Calibre"
            value={nuevoEquipo.calibre}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, calibre: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Serie"
            value={nuevoEquipo.serie}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, serie: e.target.value })}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo de equipo</InputLabel>
            <Select
              value={nuevoEquipo.id_tipo}
              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, id_tipo: Number(e.target.value) })}
            >
              {tipos.map((t) => (
                <MenuItem key={t.id_tipo} value={t.id_tipo}>{t.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNuevoEquipo(false)} startIcon={<Close />} variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleGuardarNuevoEquipo} startIcon={<CheckCircle />} variant="contained" color="success">
            Guardar equipo
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
          sx={{ width: "100%", borderRadius: 2, fontWeight: "bold" }}
        >
          {mensajeSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrestamosTable;
