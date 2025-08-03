// src/pages/ReportesTable.tsx
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Typography, Box
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  type Reporte,
  getReportes,
  addReporte,
  eliminarReporte
} from './reportesService';

export default function ReportesTable() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idUsuarioActivo, setIdUsuarioActivo] = useState<number | null>(null);

  useEffect(() => {
    // Obtener los reportes existentes
    const fetchData = async () => {
      const data = await getReportes();
      setReportes(data);
    };
    fetchData();

    // Obtener el usuario autenticado desde localStorage
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      setIdUsuarioActivo(usuario.id_usuario);
    }
  }, []);

  const handleAgregar = async () => {
    // Validar campos obligatorios
    if (!nuevoTitulo || !nuevaDescripcion || !idUsuarioActivo) return;

    const nuevo = await addReporte({
      id_usuario: idUsuarioActivo,
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion,
    });

    setReportes([...reportes, nuevo]);
    setNuevoTitulo('');
    setNuevaDescripcion('');
    setMostrarFormulario(false);
  };

  const handleEliminar = async (id: number) => {
    await eliminarReporte(id);
    setReportes(reportes.filter(r => r.id_reporte !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Reportes
      </Typography>

      <Box mb={2}>
        {mostrarFormulario ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Título"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              fullWidth
            />
            <TextField
              label="Descripción"
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
            <Box display="flex" gap={2}>
              <Button variant="contained" color="primary" onClick={handleAgregar}>
                Guardar
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </Button>
            </Box>
          </Box>
        ) : (
          <Button variant="contained" onClick={() => setMostrarFormulario(true)}>
            Agregar nuevo reporte
          </Button>
        )}
      </Box>

      {reportes.length === 0 ? (
        <Typography>No hay reportes disponibles.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}>Título</TableCell>
                <TableCell sx={{ color: '#fff' }}>Descripción</TableCell>
                <TableCell sx={{ color: '#fff' }}>Usuario</TableCell>
                <TableCell sx={{ color: '#fff' }}>Correo</TableCell>
                <TableCell sx={{ color: '#fff' }}>Fecha</TableCell>
                <TableCell sx={{ color: '#fff' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportes.map((reporte) => (
                <TableRow key={reporte.id_reporte}>
                  <TableCell>{reporte.titulo}</TableCell>
                  <TableCell>{reporte.descripcion}</TableCell>
                  <TableCell>
                    {reporte.id_usuario?.nombres} {reporte.id_usuario?.apellidos}
                  </TableCell>
                  <TableCell>{reporte.id_usuario?.correo}</TableCell>
                  <TableCell>{new Date(reporte.fecha_creacion).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleEliminar(reporte.id_reporte)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
