// src/vehiculos/ControlVehiculo.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  getVehiculoById,
  createControlVehiculo,
  getControlesByVehiculo,
  type Vehiculo,
  type Control,
  updateKmEntrada,
} from './vehiculosService';

const ControlVehiculo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [controles, setControles] = useState<Control[]>([]);
  const [kmSalida, setKmSalida] = useState('');
  const [kmEntrada, setKmEntrada] = useState('');
  const [servicioKm, setServicioKm] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [successForm, setSuccessForm] = useState('');

  // Estado para edición de km_entrada
  const [openEdit, setOpenEdit] = useState(false);
  const [editControl, setEditControl] = useState<Control | null>(null);
  const [editKmEntrada, setEditKmEntrada] = useState('');
  const [errorEdit, setErrorEdit] = useState('');
  const [successEdit, setSuccessEdit] = useState('');

  useEffect(() => {
    if (id) {
      fetchVehiculo(id);
      fetchControles(Number(id));
    }
  }, [id]);

  const fetchVehiculo = async (vehiculoId: string) => {
    try {
      const data = await getVehiculoById(Number(vehiculoId));
      setVehiculo(data);
    } catch (err) {
      console.error(err);
      setErrorForm('No se pudo obtener el vehículo.');
    }
  };

  const fetchControles = async (vehiculoId: number) => {
    try {
      const data = await getControlesByVehiculo(vehiculoId);
      setControles(data);
    } catch (err) {
      console.error(err);
      setErrorForm('No se pudieron obtener los controles.');
    }
  };

  const handleSubmit = async () => {
    setErrorForm('');
    setSuccessForm('');

    if (!kmSalida.match(/^\d+$/)) {
      setErrorForm('Km de salida debe ser un número.');
      return;
    }
    if (kmEntrada && !kmEntrada.match(/^\d+$/)) {
      setErrorForm('Km de entrada debe ser un número.');
      return;
    }
    if (!servicioKm.match(/^\d+$/)) {
      setErrorForm('Servicio Km debe ser un número.');
      return;
    }

    try {
      await createControlVehiculo({
        id_vehiculo: vehiculo!.id_vehiculo!,
        km_salida: Number(kmSalida),
        km_entrada: kmEntrada ? Number(kmEntrada) : null,
        servicio_km: Number(servicioKm),
      });
      setSuccessForm('Control registrado correctamente.');
      setKmSalida('');
      setKmEntrada('');
      setServicioKm('');

      // Opcional: refrescar controles desde backend
      fetchControles(vehiculo!.id_vehiculo!);
    } catch (err) {
      console.error(err);
      setErrorForm('Error al guardar el control.');
    }
  };

  // Abrir modal de edición
  const handleOpenEdit = (control: Control) => {
    setEditControl(control);
    setEditKmEntrada(control.km_entrada ? control.km_entrada.toString() : '');
    setErrorEdit('');
    setSuccessEdit('');
    setOpenEdit(true);
  };

  // Guardar edición y actualizar tabla instantáneamente
  const handleSaveEdit = async () => {
    if (!editControl) return;
    if (!editKmEntrada.match(/^\d+$/)) {
      setErrorEdit('Km de entrada debe ser un número.');
      return;
    }

    try {
      console.log('Editando control:', editControl.id_control, 'Nuevo km:', editKmEntrada);
      await updateKmEntrada(editControl.id_control, Number(editKmEntrada));

      // Actualizar estado local sin recargar
      setControles((prev) =>
        prev.map((c) =>
          c.id_control === editControl.id_control
            ? { ...c, km_entrada: Number(editKmEntrada) }
            : c
        )
      );

      setSuccessEdit('Kilometraje de entrada actualizado.');
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      setErrorEdit('Error al actualizar el control.');
    }
  };

  return (
    <Box p={4} sx={{ minHeight: '100vh', background: '#f4f6f8' }}>
      <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
        Control de Vehículo
      </Typography>

      {/* Formulario nuevo control */}
      {vehiculo && (
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 8,
            maxWidth: 750,
            mx: 'auto',
            mb: 5,
            background: 'linear-gradient(135deg, #ffffff, #e0f7fa)',
          }}
        >
          <Typography variant="h5" gutterBottom color="secondary">
            {vehiculo.tipo} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.placa})
          </Typography>

          {errorForm && <Alert severity="error" sx={{ mb: 2 }}>{errorForm}</Alert>}
          {successForm && <Alert severity="success" sx={{ mb: 2 }}>{successForm}</Alert>}

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
            <TextField
              fullWidth
              label="Km de Salida"
              value={kmSalida}
              onChange={(e) => setKmSalida(e.target.value)}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Km de Entrada"
              value={kmEntrada}
              onChange={(e) => setKmEntrada(e.target.value)}
              placeholder="Dejar vacío si está en uso"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Servicio Km"
              value={servicioKm}
              onChange={(e) => setServicioKm(e.target.value)}
              variant="outlined"
            />
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
                color: 'white',
                '&:hover': { background: 'linear-gradient(90deg, #1976d2, #64b5f6)' },
              }}
              onClick={handleSubmit}
            >
              Guardar Control
            </Button>
          </Box>
        </Paper>
      )}

      {/* Historial de controles */}
      <Typography variant="h5" color="primary" mb={2} textAlign="center">
        Historial de Controles
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: 6, maxWidth: 950, mx: 'auto', mb: 5 }}>
        <Table sx={{ borderRadius: 3 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              
              <TableCell sx={{ color: 'white' }}>Km Salida</TableCell>
              <TableCell sx={{ color: 'white' }}>Km Entrada</TableCell>
              <TableCell sx={{ color: 'white' }}>Servicio Km</TableCell>
              <TableCell sx={{ color: 'white' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'white' }}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {controles.map((c) => (
              <TableRow
                key={c.id_control}
                sx={{ '&:hover': { backgroundColor: '#e3f2fd' }, transition: '0.3s' }}
              >
              
                <TableCell>{c.km_salida}</TableCell>
                <TableCell>{c.km_entrada ?? 'En uso'}</TableCell>
                <TableCell>{c.servicio_km}</TableCell>
                <TableCell>{new Date(c.fecha_control).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenEdit(c)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal edición km_entrada */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Km de Entrada</DialogTitle>
        <DialogContent>
          {errorEdit && <Alert severity="error" sx={{ mb: 2 }}>{errorEdit}</Alert>}
          {successEdit && <Alert severity="success" sx={{ mb: 2 }}>{successEdit}</Alert>}
          <TextField
            fullWidth
            label="Km de Entrada"
            value={editKmEntrada}
            onChange={(e) => setEditKmEntrada(e.target.value)}
            sx={{ mt: 1 }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
              color: 'white',
              '&:hover': { background: 'linear-gradient(90deg, #1976d2, #64b5f6)' },
            }}
            onClick={handleSaveEdit}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ControlVehiculo;
