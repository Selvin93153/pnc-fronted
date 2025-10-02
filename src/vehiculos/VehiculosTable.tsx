// src/vehiculos/VehiculosTable.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  createVehiculo,
  getUsuarios,
  cambiarPiloto,
  type Vehiculo,
  type Usuario,
  getMisVehiculos,
  getVehiculos, // Traer todos los vehículos
} from './vehiculosService';

const estados = ['activo', 'inactivo'];

const VehiculosTable: React.FC = () => {
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [openNuevo, setOpenNuevo] = useState(false);
  const [openPiloto, setOpenPiloto] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<number | null>(null);
  const [nuevoPiloto, setNuevoPiloto] = useState<number>(0);
  const [error, setError] = useState('');
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // Verificar si el usuario tiene rol de jefe
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');
  const esJefe = usuarioLogueado?.rol === 'jefe';

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    tipo: '',
    placa: '',
    marca: '',
    modelo: '',
    estado: 'activo',
    id_usuario: 0,
  });

  // Fetch vehículos según si se muestran todos o solo del usuario
  const fetchVehiculos = async () => {
    try {
      let data: Vehiculo[] = [];
      if (mostrarTodos && esJefe) {
        data = await getVehiculos(); // Todos los vehículos
      } else {
        data = await getMisVehiculos(); // Solo los del usuario
      }
      setVehiculos(data);
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
    }
  };

  // Fetch usuarios
  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    fetchVehiculos();
    fetchUsuarios();
  }, [mostrarTodos]);

  const handleChangeVehiculo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoVehiculo({ ...nuevoVehiculo, [e.target.name]: e.target.value });
  };

  const handleSaveVehiculo = async () => {
    if (!nuevoVehiculo.id_usuario) {
      setError('Debe seleccionar un usuario para el vehículo.');
      return;
    }
    await createVehiculo(nuevoVehiculo);
    setOpenNuevo(false);
    setNuevoVehiculo({
      tipo: '',
      placa: '',
      marca: '',
      modelo: '',
      estado: 'activo',
      id_usuario: 0,
    });
    setError('');
    fetchVehiculos();
  };

  const handleAbrirPiloto = (vehiculoId: number) => {
    setVehiculoSeleccionado(vehiculoId);
    setOpenPiloto(true);
    setNuevoPiloto(0);
  };

  const handleActualizarPiloto = async () => {
    if (!nuevoPiloto || !vehiculoSeleccionado) return;
    await cambiarPiloto(vehiculoSeleccionado, nuevoPiloto);
    setOpenPiloto(false);
    fetchVehiculos();
  };

  return (
    <Box p={4} sx={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Gestión de Vehículos
        </Typography>

        <Tooltip
          title={
            esJefe
              ? "Alterna entre tus vehículos y todos los vehículos"
              : "Opción solo disponible para usuarios con rol de jefe"
          }
        >
          <span>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => esJefe && setMostrarTodos(!mostrarTodos)}
              disabled={!esJefe}
            >
              {mostrarTodos ? "Ver Mis Vehículos" : "Ver Todos los Vehículos"}
            </Button>
          </span>
        </Tooltip>
      </Box>

      <Button
        variant="contained"
        sx={{ mb: 3, background: 'linear-gradient(90deg, #1565c0, #42a5f5)' }}
        onClick={() => setOpenNuevo(true)}
      >
        Crear Vehículo
      </Button>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white' }}>Placa</TableCell>
              <TableCell sx={{ color: 'white' }}>Marca</TableCell>
              <TableCell sx={{ color: 'white' }}>Modelo</TableCell>
              <TableCell sx={{ color: 'white' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white' }}>Usuario</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.map((v) => (
              <TableRow key={v.id_vehiculo} sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
                <TableCell>{v.id_vehiculo}</TableCell>
                <TableCell>{v.tipo}</TableCell>
                <TableCell>{v.placa}</TableCell>
                <TableCell>{v.marca}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: v.estado === 'activo' ? 'green' : 'red',
                  }}
                >
                  {v.estado}
                </TableCell>
                <TableCell>
                  {v.id_usuario.nombres} {v.id_usuario.apellidos} ({v.id_usuario.nip})
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/panel/vehiculos/control/${v.id_vehiculo}`)}
                  >
                    Control de Vehículo
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleAbrirPiloto(v.id_vehiculo!)}
                  >
                    Cambiar Piloto
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal Crear Vehículo */}
      <Dialog open={openNuevo} onClose={() => setOpenNuevo(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crear Nuevo Vehículo</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Tipo"
            name="tipo"
            value={nuevoVehiculo.tipo}
            onChange={handleChangeVehiculo}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Placa"
            name="placa"
            value={nuevoVehiculo.placa}
            onChange={handleChangeVehiculo}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Marca"
            name="marca"
            value={nuevoVehiculo.marca}
            onChange={handleChangeVehiculo}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Modelo"
            name="modelo"
            value={nuevoVehiculo.modelo}
            onChange={handleChangeVehiculo}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            name="estado"
            value={nuevoVehiculo.estado}
            onChange={handleChangeVehiculo}
            sx={{ mb: 2 }}
          >
            {estados.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            name="id_usuario"
            value={nuevoVehiculo.id_usuario}
            onChange={handleChangeVehiculo}
            sx={{ mb: 2 }}
          >
            <MenuItem value={0} disabled>
              Selecciona un usuario
            </MenuItem>
            {usuarios.map((u) => (
              <MenuItem key={u.id_usuario} value={u.id_usuario}>
                {u.nombres} {u.apellidos} ({u.nip})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNuevo(false)}>Cancelar</Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(90deg, #1565c0, #42a5f5)' }}
            onClick={handleSaveVehiculo}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Cambiar Piloto */}
      <Dialog open={openPiloto} onClose={() => setOpenPiloto(false)} fullWidth maxWidth="sm">
        <DialogTitle>Cambiar Piloto</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            value={nuevoPiloto}
            onChange={(e) => setNuevoPiloto(Number(e.target.value))}
            sx={{ mb: 2 }}
          >
            <MenuItem value={0} disabled>
              Selecciona un usuario
            </MenuItem>
            {usuarios.map((u) => (
              <MenuItem key={u.id_usuario} value={u.id_usuario}>
                {u.nombres} {u.apellidos} ({u.nip})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPiloto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(90deg, #1565c0, #42a5f5)' }}
            onClick={handleActualizarPiloto}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehiculosTable;
