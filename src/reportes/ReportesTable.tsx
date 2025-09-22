import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Box
} from '@mui/material';
import { type Reporte, getReportes, addReporte, updateReporte, type Usuario } from './reportesService';

const ReportesTable: React.FC = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [selectedReporte, setSelectedReporte] = useState<Reporte | null>(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const data = await getReportes();
      setReportes(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
  };

  const handleDetalle = (reporte: Reporte) => {
    setSelectedReporte(reporte);
    setOpenDetalle(true);
  };

  const handleEditar = (reporte: Reporte) => {
    setSelectedReporte(reporte);
    setEditTitulo(reporte.titulo);
    setEditDescripcion(reporte.descripcion || '');
    setOpenEditar(true);
  };

  const handleGuardarEdicion = async () => {
    if (!selectedReporte) return;
    try {
      await updateReporte(selectedReporte.id_reporte, {
        titulo: editTitulo,
        descripcion: editDescripcion,
      });
      setOpenEditar(false);
      cargarReportes();
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
    }
  };

  const handleNuevoReporte = async () => {
    if (!nuevoTitulo) return alert('Debe ingresar un título');

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const id_usuario = usuario?.id_usuario;
      if (!id_usuario) {
        alert('No se encontró un usuario en sesión.');
        return;
      }

      await addReporte({
        id_usuario,
        titulo: nuevoTitulo,
        descripcion: nuevaDescripcion,
      });
      setNuevoTitulo('');
      setNuevaDescripcion('');
      setOpenNuevo(false);
      cargarReportes();
    } catch (error) {
      console.error('Error al crear reporte:', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        📋 Reportes
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpenNuevo(true)}
      >
        Nuevo Reporte
      </Button>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Título</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportes.map((reporte) => {
              const usuario = reporte.id_usuario as Usuario;
              return (
                <TableRow key={reporte.id_reporte} hover>
                  <TableCell>{reporte.titulo}</TableCell>
                  <TableCell>{usuario?.nombres} {usuario?.apellidos}</TableCell>
                  <TableCell>{new Date(reporte.fecha_creacion).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleDetalle(reporte)}
                      sx={{ mr: 1 }}
                    >
                      Detalles
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEditar(reporte)}
                    >
                      Modificar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Detalle */}
      <Dialog open={openDetalle} onClose={() => setOpenDetalle(false)} fullWidth maxWidth="sm">
        <DialogTitle>Detalles del Reporte</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedReporte?.titulo}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {selectedReporte?.descripcion}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
            Enviado por: {(selectedReporte?.id_usuario as Usuario)?.nombres}{' '}
            {(selectedReporte?.id_usuario as Usuario)?.apellidos}
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray' }}>
            Fecha: {selectedReporte && new Date(selectedReporte.fecha_creacion).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetalle(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={openEditar} onClose={() => setOpenEditar(false)} fullWidth maxWidth="sm">
        <DialogTitle>Modificar Reporte</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            fullWidth
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={editDescripcion}
            onChange={(e) => setEditDescripcion(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditar(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarEdicion}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Nuevo Reporte */}
      <Dialog open={openNuevo} onClose={() => setOpenNuevo(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo Reporte</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            fullWidth
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNuevo(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleNuevoReporte}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportesTable;
