import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getAsignados, createAsignado } from '../asignados/asignadosService';
import axios from 'axios';

interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
}

interface Tipo {
  id_tipo: number;
  nombre: string;
}

interface Asignado {
  id_asignacion: number;
  clase: string;
  marca?: string;
  calibre?: string;
  serie: string;
  id_tipo: Tipo;
  id_usuario: Usuario;
}

export default function AsignadosTable() {
  const [asignados, setAsignados] = useState<Asignado[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    clase: '',
    marca: '',
    calibre: '',
    serie: '',
    id_tipo: '',
    id_usuario: '',
  });

  useEffect(() => {
    getAsignados().then(setAsignados);

    axios.get('http://localhost:3000/api/tipos-equipos').then(res => {
      setTipos(res.data);
    });

    axios.get('http://localhost:3000/api/usuarios').then(res => {
      setUsuarios(res.data);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createAsignado({
        clase: form.clase,
        marca: form.marca,
        calibre: form.calibre,
        serie: form.serie,
        id_tipo: parseInt(form.id_tipo),
        id_usuario: parseInt(form.id_usuario),
      });
      setForm({
        clase: '',
        marca: '',
        calibre: '',
        serie: '',
        id_tipo: '',
        id_usuario: '',
      });
      setOpen(false);
      const data = await getAsignados();
      setAsignados(data);
    } catch (error) {
      console.error('Error al crear asignación', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
        Equipos Asignados
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Agregar asignación
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Clase</TableCell>
              <TableCell sx={{ color: '#fff' }}>Marca</TableCell>
              <TableCell sx={{ color: '#fff' }}>Calibre</TableCell>
              <TableCell sx={{ color: '#fff' }}>Serie</TableCell>
              <TableCell sx={{ color: '#fff' }}>Tipo</TableCell>
              <TableCell sx={{ color: '#fff' }}>Usuario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asignados.map((item) => (
              <TableRow key={item.id_asignacion} hover>
                <TableCell>{item.clase}</TableCell>
                <TableCell>{item.marca || '-'}</TableCell>
                <TableCell>{item.calibre || '-'}</TableCell>
                <TableCell>{item.serie}</TableCell>
                <TableCell>{item.id_tipo?.nombre}</TableCell>
                <TableCell>{item.id_usuario?.nombres} {item.id_usuario?.apellidos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de agregar asignación */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar nueva asignación</DialogTitle>
        <DialogContent>
          <TextField label="Clase" name="clase" fullWidth margin="dense" value={form.clase} onChange={handleInputChange} />
          <TextField label="Marca" name="marca" fullWidth margin="dense" value={form.marca} onChange={handleInputChange} />
          <TextField label="Calibre" name="calibre" fullWidth margin="dense" value={form.calibre} onChange={handleInputChange} />
          <TextField label="Serie" name="serie" fullWidth margin="dense" value={form.serie} onChange={handleInputChange} />

          <TextField
            select
            label="Tipo de equipo"
            name="id_tipo"
            fullWidth
            margin="dense"
            value={form.id_tipo}
            onChange={handleInputChange}
          >
            {tipos.map((tipo) => (
              <MenuItem key={tipo.id_tipo} value={tipo.id_tipo}>
                {tipo.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Usuario"
            name="id_usuario"
            fullWidth
            margin="dense"
            value={form.id_usuario}
            onChange={handleInputChange}
          >
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
