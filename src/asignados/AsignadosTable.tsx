// src/asignados/AsignadosTable.tsx
import {
  Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, TextField, Typography, Table,
  TableHead, TableBody, TableRow, TableCell, Paper, TableContainer,
  Chip
} from '@mui/material';
import { useEffect, useState } from 'react';
import { 
  getAsignados, createAsignado, getTipos, getUsuarios, updateAsignado, addMovimiento,
  getAsignadosPorNip 
} from './asignadosService';
import type { Asignado, Tipo, Usuario } from './asignadosService';

export default function AsignadosTable() {
  const [asignados, setAsignados] = useState<Asignado[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [open, setOpen] = useState(false);

  // Estados para modal de entrega
  const [openEntrega, setOpenEntrega] = useState(false);
  const [comentarioEntrega, setComentarioEntrega] = useState('');
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<Asignado | null>(null);

  // Usuario en sesión
  const usuarioSesion = JSON.parse(localStorage.getItem("usuario") || "{}");
  const usuarioSesionId = usuarioSesion?.id_usuario;

  const [form, setForm] = useState({
    clase: '',
    marca: '',
    calibre: '',
    serie: '',
    estado: '',
    id_tipo: '',
    id_usuario: '',
  });

  // 🔹 Estado para filtro por estado
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'guardado' | 'en uso'>('todos');

  // 🔹 Estado para buscador por NIP y mensaje
  const [nipBuscado, setNipBuscado] = useState('');
  const [mensajeBusqueda, setMensajeBusqueda] = useState('');

  useEffect(() => {
    async function fetchData() {
      const [asignadosData, tiposData, usuariosData] = await Promise.all([
        getAsignados(),
        getTipos(),
        getUsuarios(),
      ]);
      setAsignados(asignadosData);
      setTipos(tiposData);
      setUsuarios(usuariosData);
    }
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createAsignado({
        clase: form.clase,
        marca: form.marca,
        calibre: form.calibre,
        serie: form.serie,
        estado: form.estado,
        id_tipo: parseInt(form.id_tipo),
        id_usuario: parseInt(form.id_usuario),
      });
      setForm({
        clase: '',
        marca: '',
        calibre: '',
        serie: '',
        estado: '',
        id_tipo: '',
        id_usuario: '',
      });
      setOpen(false);
      const data = await getAsignados();
      setAsignados(data);
      setMensajeBusqueda('');
    } catch (error) {
      console.error('Error al crear asignación', error);
    }
  };

  // Abrir modal entrega
  const handleAbrirEntrega = (asignacion: Asignado) => {
    setAsignacionSeleccionada(asignacion);
    setComentarioEntrega('');
    setOpenEntrega(true);
  };

  // Confirmar entrega
  const handleConfirmarEntrega = async () => {
    if (!asignacionSeleccionada || !usuarioSesionId) return;

    try {
      const movimientoData = {
        id_asignacion: asignacionSeleccionada.id_asignacion,
        id_usuario_entrega: usuarioSesionId,
        id_usuario_recibe: asignacionSeleccionada.usuario.id_usuario,
        comentarios: comentarioEntrega || "Equipo entregado",
        estado: "en uso",
      };

      await addMovimiento(movimientoData);

      await updateAsignado(asignacionSeleccionada.id_asignacion, {
        estado: "en uso",
      });

      setOpenEntrega(false);
      setAsignacionSeleccionada(null);
      const data = await getAsignados();
      setAsignados(data);
      setMensajeBusqueda('');
    } catch (error) {
      console.error("Error al registrar entrega", error);
    }
  };

  // 🔹 Filtramos los asignados según el filtro
  const asignadosFiltrados = asignados.filter(a => {
    if (filtroEstado === 'todos') return true;
    return a.estado === filtroEstado;
  });

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
        Equipos Asignados
      </Typography>

      {/* 🔹 Barra superior con botón, filtro y buscador */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Agregar asignación
        </Button>

        <Box display="flex" gap={2} alignItems="center">
          <TextField
            select
            label="Filtrar por estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'guardado' | 'en uso')}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="guardado">Guardado</MenuItem>
            <MenuItem value="en uso">En uso</MenuItem>
          </TextField>

          <TextField
            label="Buscar por NIP"
            size="small"
            value={nipBuscado}
            onChange={(e) => setNipBuscado(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              if (!nipBuscado) {
                const data = await getAsignados();
                setAsignados(data);
                setMensajeBusqueda('');
              } else {
                try {
                  const data = await getAsignadosPorNip(nipBuscado);
                  setAsignados(data);
                  if (data.length === 0) {
                    setMensajeBusqueda('No hay registro existente');
                  } else {
                    setMensajeBusqueda('');
                  }
                } catch (error) {
                  console.error("Error al buscar por NIP", error);
                  setAsignados([]);
                  setMensajeBusqueda('No hay registro existente');
                }
              }
            }}
          >
            Buscar
          </Button>

          {/* Mensaje de búsqueda */}
          {mensajeBusqueda && (
            <Typography color="error" variant="body2">
              {mensajeBusqueda}
            </Typography>
          )}
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Clase</TableCell>
              <TableCell sx={{ color: '#fff' }}>Marca</TableCell>
              <TableCell sx={{ color: '#fff' }}>Calibre</TableCell>
              <TableCell sx={{ color: '#fff' }}>Serie</TableCell>
              <TableCell sx={{ color: '#fff' }}>Estado</TableCell>
              <TableCell sx={{ color: '#fff' }}>Tipo</TableCell>
              <TableCell sx={{ color: '#fff' }}>Usuario</TableCell>
              <TableCell sx={{ color: '#fff' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asignadosFiltrados.map((item) => (
              <TableRow key={item.id_asignacion} hover>
                <TableCell>{item.clase}</TableCell>
                <TableCell>{item.marca || '-'}</TableCell>
                <TableCell>{item.calibre || '-'}</TableCell>
                <TableCell>{item.serie}</TableCell>
                <TableCell>
                  {item.estado === 'guardado' && <Chip label="Guardado" color="info" size="small" />}
                  {item.estado === 'en uso' && <Chip label="En uso" color="success" size="small" />}
                </TableCell>
                <TableCell>{item.tipo?.nombre}</TableCell>
                <TableCell>{item.usuario?.nombres} {item.usuario?.apellidos}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAbrirEntrega(item)}
                    disabled={item.estado === "en uso"}
                  >
                    Entregar equipo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para entrega */}
      <Dialog open={openEntrega} onClose={() => setOpenEntrega(false)} fullWidth maxWidth="sm">
        <DialogTitle>Entregar equipo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Comentarios"
            multiline
            rows={3}
            value={comentarioEntrega}
            onChange={(e) => setComentarioEntrega(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEntrega(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarEntrega} variant="contained" color="primary">
            Confirmar entrega
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para crear asignación */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar nueva asignación</DialogTitle>
        <DialogContent>
          <TextField label="Clase" name="clase" fullWidth margin="dense" value={form.clase} onChange={handleInputChange} />
          <TextField label="Marca" name="marca" fullWidth margin="dense" value={form.marca} onChange={handleInputChange} />
          <TextField label="Calibre" name="calibre" fullWidth margin="dense" value={form.calibre} onChange={handleInputChange} />
          <TextField label="Serie" name="serie" fullWidth margin="dense" value={form.serie} onChange={handleInputChange} />
          <TextField select label="Estado" name="estado" fullWidth margin="dense" value={form.estado} onChange={handleInputChange}>
            <MenuItem value="guardado">guardado</MenuItem>
            <MenuItem value="en uso">en uso</MenuItem>
          </TextField>
          <TextField select label="Tipo de equipo" name="id_tipo" fullWidth margin="dense" value={form.id_tipo} onChange={handleInputChange}>
            {tipos.map((tipo) => (
              <MenuItem key={tipo.id_tipo} value={tipo.id_tipo}>
                {tipo.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Usuario" name="id_usuario" fullWidth margin="dense" value={form.id_usuario} onChange={handleInputChange}>
            {usuarios.map((usuario) => (
              <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                {usuario.nombres} {usuario.apellidos}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
