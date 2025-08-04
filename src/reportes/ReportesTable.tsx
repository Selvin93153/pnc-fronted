import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Collapse,
  TextField,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  type Reporte,
  getReportes,
  addReporte,
  eliminarReporte,
} from './reportesService';

const modalStyle = {
  position: 'fixed' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export default function ReportesTable() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idUsuarioActivo, setIdUsuarioActivo] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openModalDesc, setOpenModalDesc] = useState(false);
  const [descCompleta, setDescCompleta] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getReportes();
      setReportes(data);
    };
    fetchData();

    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      setIdUsuarioActivo(usuario.id_usuario);
    }
  }, []);

  const handleAgregar = async () => {
    if (!nuevoTitulo || !idUsuarioActivo) return;
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
    setReportes(reportes.filter((r) => r.id_reporte !== id));
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const abrirModalDescripcion = (desc: string) => {
    setDescCompleta(desc);
    setOpenModalDesc(true);
  };

  const cerrarModalDescripcion = () => {
    setOpenModalDesc(false);
    setDescCompleta('');
  };

  return (
    <Box p={3}>
      {/* Botón para mostrar formulario flotante */}
      <Box mb={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={() => setMostrarFormulario(true)}>
          Agregar nuevo reporte
        </Button>
      </Box>

      {/* Modal flotante para agregar reporte */}
      <Modal
        open={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backgroundColor: 'rgba(0,0,0,0.3)' },
          },
        }}
      >
        <Fade in={mostrarFormulario}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Agregar nuevo reporte
            </Typography>
            <TextField
              label="Título"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Descripción"
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              multiline
              minRows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={handleAgregar}>
                Guardar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Modal para descripción completa */}
      <Modal
        open={openModalDesc}
        onClose={cerrarModalDescripcion}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backgroundColor: 'rgba(0,0,0,0.3)' },
          },
        }}
      >
        <Fade in={openModalDesc}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Descripción completa
            </Typography>
            <Typography
              sx={{ whiteSpace: 'pre-wrap', maxHeight: '60vh', overflowY: 'auto' }}
            >
              {descCompleta}
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" onClick={cerrarModalDescripcion}>
                Cerrar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Contenedor con flexbox para 3 columnas */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
        }}
      >
        {reportes.map((reporte) => (
          <Card
            key={reporte.id_reporte}
            sx={{
              width: 'calc((100% / 3) - 16px)',
              minWidth: 280,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {reporte.titulo}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
                noWrap
              >
                {reporte.descripcion}
              </Typography>

              {/* Botón Ver más solo si hay descripción */}
              {reporte.descripcion && (
                <Button
                  size="small"
                  onClick={() => abrirModalDescripcion(reporte.descripcion ?? '')}
                  sx={{ textTransform: 'none', fontWeight: 'bold', mb: 1 }}
                >
                  Ver más
                </Button>
              )}

              <Button
                size="small"
                onClick={() => toggleExpand(reporte.id_reporte)}
                sx={{ mb: 1 }}
              >
                {expandedId === reporte.id_reporte ? 'Ocultar detalles' : 'Detalles'}
              </Button>

              <Collapse in={expandedId === reporte.id_reporte} timeout="auto" unmountOnExit>
                <Box mt={2}>
                  <Typography>
                    <strong>Usuario:</strong> {reporte.id_usuario?.nombres}{' '}
                    {reporte.id_usuario?.apellidos}
                  </Typography>
                  <Typography>
                    <strong>Correo:</strong> {reporte.id_usuario?.correo}
                  </Typography>
                  <Typography>
                    <strong>Fecha:</strong>{' '}
                    {new Date(reporte.fecha_creacion).toLocaleString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => handleEliminar(reporte.id_reporte)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
