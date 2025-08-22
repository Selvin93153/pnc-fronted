import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';
import { 
  getEquiposPrestamo, addEquipoPrestamo, updateEquipoPrestamo, deleteEquipoPrestamo, type EquipoPrestamo, type TipoEquipo 
} from './equipos-prestamos';

// Si quieres, puedes traer los tipos de tu API en otro fetch similar a roles/tipos
const tiposMock: TipoEquipo[] = [
  { id_tipo: 1, nombre: 'armas cortas' },
  { id_tipo: 2, nombre: 'armas largas' },
];

const PrestamosTable: React.FC = () => {
  const [equipos, setEquipos] = useState<EquipoPrestamo[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<EquipoPrestamo>>({});

  const cargarEquipos = async () => {
    const data = await getEquiposPrestamo();
    setEquipos(data);
  };

  useEffect(() => { cargarEquipos(); }, []);

  const handleCrear = async () => {
    if (!formData.marca || !formData.calibre || !formData.serie || !formData.id_tipo) return;
    await addEquipoPrestamo({
      marca: formData.marca,
      calibre: formData.calibre,
      serie: formData.serie,
      id_tipo: formData.id_tipo.id_tipo,
      estado: formData.estado || 'activo',
    });
    cargarEquipos();
    setOpen(false);
    setFormData({});
  };

  const handleEditar = async () => {
    if (!formData.id_prestamo) return;
    await updateEquipoPrestamo(formData.id_prestamo, {
      marca: formData.marca,
      calibre: formData.calibre,
      serie: formData.serie,
      id_tipo: formData.id_tipo?.id_tipo,
      estado: formData.estado,
    });
    cargarEquipos();
    setOpen(false);
    setFormData({});
  };

  const handleEliminar = async (id: number) => {
    await deleteEquipoPrestamo(id);
    cargarEquipos();
  };

  const openForm = (equipo?: EquipoPrestamo) => {
    setFormData(equipo || {});
    setOpen(true);
  };

  return (
    <TableContainer component={Paper}>
      <Button onClick={() => openForm()} variant="contained" sx={{ m: 2 }}>
        Nuevo Prestamo
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Marca</TableCell>
            <TableCell>Calibre</TableCell>
            <TableCell>Serie</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipos.map((equipo) => (
            <TableRow key={equipo.id_prestamo}>
              <TableCell>{equipo.marca}</TableCell>
              <TableCell>{equipo.calibre}</TableCell>
              <TableCell>{equipo.serie}</TableCell>
              <TableCell>{equipo.id_tipo.nombre}</TableCell>
              <TableCell>{equipo.estado}</TableCell>
              <TableCell>
                <Button onClick={() => openForm(equipo)} sx={{ mr: 1 }}>Editar</Button>
                <Button onClick={() => handleEliminar(equipo.id_prestamo)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{formData.id_prestamo ? 'Editar Prestamo' : 'Nuevo Prestamo'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Marca"
            fullWidth
            margin="dense"
            value={formData.marca || ''}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
          />
          <TextField
            label="Calibre"
            fullWidth
            margin="dense"
            value={formData.calibre || ''}
            onChange={(e) => setFormData({ ...formData, calibre: e.target.value })}
          />
          <TextField
            label="Serie"
            fullWidth
            margin="dense"
            value={formData.serie || ''}
            onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="tipo-label">Tipo</InputLabel>
            <Select
              labelId="tipo-label"
              value={formData.id_tipo?.id_tipo || ''}
              label="Tipo"
              onChange={(e) => {
                const tipo = tiposMock.find(t => t.id_tipo === Number(e.target.value));
                if (tipo) setFormData({ ...formData, id_tipo: tipo });
              }}
            >
              {tiposMock.map((tipo) => (
                <MenuItem key={tipo.id_tipo} value={tipo.id_tipo}>{tipo.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              value={formData.estado || 'activo'}
              label="Estado"
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={formData.id_prestamo ? handleEditar : handleCrear}>
            {formData.id_prestamo ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default PrestamosTable;
