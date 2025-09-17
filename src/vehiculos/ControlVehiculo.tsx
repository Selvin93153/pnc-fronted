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
} from '@mui/material';
import {
  getVehiculoById,
  createControlVehiculo,
  getControlesByVehiculo,
  type Vehiculo,
  type Control,
} from './vehiculosService';

const ControlVehiculo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [controles, setControles] = useState<Control[]>([]);
  const [kmSalida, setKmSalida] = useState('');
  const [kmEntrada, setKmEntrada] = useState('');
  const [servicioKm, setServicioKm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setError('No se pudo obtener el vehículo.');
    }
  };

  const fetchControles = async (vehiculoId: number) => {
    try {
      const data = await getControlesByVehiculo(vehiculoId);
      setControles(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron obtener los controles.');
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validaciones
    if (!kmSalida.match(/^\d+$/)) {
      setError('Km de salida debe ser un número.');
      return;
    }
    if (kmEntrada && !kmEntrada.match(/^\d+$/)) {
      setError('Km de entrada debe ser un número.');
      return;
    }
    if (!servicioKm.match(/^\d+$/)) {
      setError('Servicio Km debe ser un número.');
      return;
    }

    try {
      await createControlVehiculo({
        id_vehiculo: vehiculo!.id_vehiculo!,
        km_salida: Number(kmSalida),
        km_entrada: kmEntrada ? Number(kmEntrada) : null,
        servicio_km: Number(servicioKm),
      });
      setSuccess('Control registrado correctamente.');
      setKmSalida('');
      setKmEntrada('');
      setServicioKm('');
      fetchControles(vehiculo!.id_vehiculo!); // refresca la tabla
    } catch (err) {
      console.error(err);
      setError('Error al guardar el control.');
    }
  };

  return (
    <Box p={4} sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Control de Vehículo
      </Typography>

      {vehiculo && (
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4, maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            {vehiculo.tipo} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.placa})
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            fullWidth
            label="Km de Salida"
            value={kmSalida}
            onChange={(e) => setKmSalida(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Km de Entrada"
            value={kmEntrada}
            onChange={(e) => setKmEntrada(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Dejar vacío si el vehículo aún está en uso"
          />

          <TextField
            fullWidth
            label="Servicio Km"
            value={servicioKm}
            onChange={(e) => setServicioKm(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button
              variant="contained"
              sx={{ background: 'linear-gradient(90deg, #1565c0, #42a5f5)' }}
              onClick={handleSubmit}
            >
              Guardar Control
            </Button>
          </Box>
        </Paper>
      )}

      {/* Tabla de historial de controles */}
      {controles.length > 0 && (
        <Paper sx={{ mt: 4, p: 2, borderRadius: 3, boxShadow: 4 }}>
          <Typography variant="h6" gutterBottom>
            Historial de Controles
          </Typography>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white' }}>ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Km Salida</TableCell>
                <TableCell sx={{ color: 'white' }}>Km Entrada</TableCell>
                <TableCell sx={{ color: 'white' }}>Servicio Km</TableCell>
                <TableCell sx={{ color: 'white' }}>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {controles.map((c) => (
                <TableRow key={c.id_control} sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
                  <TableCell>{c.id_control}</TableCell>
                  <TableCell>{c.km_salida}</TableCell>
                  <TableCell>{c.km_entrada ?? 'En uso'}</TableCell>
                  <TableCell>{c.servicio_km}</TableCell>
                  <TableCell>{new Date(c.fecha_control).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default ControlVehiculo;
