import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions as DialogActionsMUI,
  TextField
} from '@mui/material';
import {
  type Reporte,
  getReportes,
  addReporte,
  updateReporte,
  type Usuario,
  getReportesNoVistos,
  getReportesVistos,
  marcarReporteVisto
} from './reportesService';

const ReportesCards: React.FC = () => {
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

  const handleVerReporte = async (reporte: Reporte) => {
    setSelectedReporte(reporte);
    setOpenDetalle(true);

    if (!(reporte as any).visto) {
      try {
        await marcarReporteVisto(reporte.id_reporte);
        cargarReportes();
      } catch (error) {
        console.error('Error al marcar reporte como visto:', error);
      }
    }
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
        <Typography variant="h5" fontWeight="bold">
          📋 Reportes
        </Typography>
        <Button variant="contained" onClick={() => setOpenNuevo(true)} sx={{ mt: { xs: 2, sm: 0 } }}>
          Nuevo Reporte
        </Button>
      </Box>

      {/* Filtros */}
      <Box display="flex" justifyContent="flex-start" gap={2} mb={3} flexWrap="wrap">
        <Button variant="contained" onClick={() => cargarReportes()}>
          Ver todos
        </Button>
        <Button variant="outlined" onClick={async () => {
          const data = await getReportesNoVistos();
          setReportes(data);
        }}>
          Ver reportes no vistos
        </Button>
        <Button variant="outlined" onClick={async () => {
          const data = await getReportesVistos();
          setReportes(data);
        }}>
          Ver reportes vistos
        </Button>
      </Box>

      {/* Cards container */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {reportes.map((reporte) => {
          const usuario = reporte.id_usuario as Usuario;
          const colorFondo = (reporte as any).visto ? '#c6f7f3ff' : '#fbeec6ff'; // verde suave vs azul suave

          return (
            <Card
              key={reporte.id_reporte}
              sx={{
                width: { xs: '100%', sm: '48%', md: '31%' },
                borderRadius: 3,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: colorFondo,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {reporte.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enviado por: {usuario?.nombres} {usuario?.apellidos}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {new Date(reporte.fecha_creacion).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined" onClick={() => handleVerReporte(reporte)}>
                  Ver reporte
                </Button>
                <Button size="small" variant="contained" color="secondary" onClick={() => handleEditar(reporte)}>
                  Modificar
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>

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
        <DialogActionsMUI>
          <Button onClick={() => setOpenDetalle(false)}>Cerrar</Button>
        </DialogActionsMUI>
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
        <DialogActionsMUI>
          <Button onClick={() => setOpenEditar(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarEdicion}>
            Guardar
          </Button>
        </DialogActionsMUI>
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
        <DialogActionsMUI>
          <Button onClick={() => setOpenNuevo(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleNuevoReporte}>
            Guardar
          </Button>
        </DialogActionsMUI>
      </Dialog>
    </Box>
  );
};

export default ReportesCards;
