// src/mantenimiento/MantenimientoTabla.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  getMantenimientos,
  createMantenimiento,
  updateMantenimiento,
  getVehiculosUsuario,
  type Mantenimiento,
} from "./MantenimientoService";
import type { Vehiculo as VehiculoAPI } from "../vehiculos/vehiculosService";

const MantenimientoTabla: React.FC = () => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [vehiculos, setVehiculos] = useState<VehiculoAPI[]>([]);

  // Estados formulario
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Mantenimiento | null>(null);
  const [kmActual, setKmActual] = useState("");
  const [kmProximo, setKmProximo] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idVehiculo, setIdVehiculo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchVehiculos();
  }, []);

  // Obtener los vehículos del usuario logeado y luego sus mantenimientos
  const fetchVehiculos = async () => {
    try {
      const misVehiculos = await getVehiculosUsuario();
      setVehiculos(misVehiculos);

      // Filtrar los mantenimientos solo de los vehículos de este usuario
      const allMantenimientos = await getMantenimientos();
      const misVehiculosIds = misVehiculos.map((v) => v.id_vehiculo);
      const mantenimientosFiltrados = allMantenimientos.filter((m) => {
        const idVeh =
          typeof m.id_vehiculo === "object"
            ? m.id_vehiculo.id_vehiculo
            : m.id_vehiculo;
        return misVehiculosIds.includes(idVeh);
      });
      setMantenimientos(mantenimientosFiltrados);
    } catch (err) {
      console.error(err);
      setError("No se pudieron obtener los vehículos o mantenimientos.");
    }
  };

  const handleOpen = (mantenimiento?: Mantenimiento) => {
    if (mantenimiento) {
      setEditando(mantenimiento);
      setKmActual(mantenimiento.km_actual.toString());
      setKmProximo(mantenimiento.km_servicioproximo.toString());
      setTipo(mantenimiento.tipo_mantenimiento);
      setDescripcion(mantenimiento.descripcion);
      setIdVehiculo(
        typeof mantenimiento.id_vehiculo === "object"
          ? mantenimiento.id_vehiculo.id_vehiculo.toString()
          : (mantenimiento.id_vehiculo as number).toString()
      );
    } else {
      setEditando(null);
      setKmActual("");
      setKmProximo("");
      setTipo("");
      setDescripcion("");
      setIdVehiculo("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!kmActual || !kmProximo || !tipo || !idVehiculo) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      if (editando) {
        await updateMantenimiento(editando.id_mantenimiento, {
          km_actual: Number(kmActual),
          km_servicioproximo: Number(kmProximo),
          tipo_mantenimiento: tipo,
          descripcion,
          id_vehiculo: Number(idVehiculo),
        });
        setSuccess("Mantenimiento actualizado.");
      } else {
        await createMantenimiento({
          km_actual: Number(kmActual),
          km_servicioproximo: Number(kmProximo),
          tipo_mantenimiento: tipo,
          descripcion,
          id_vehiculo: Number(idVehiculo),
        });
        setSuccess("Mantenimiento creado.");
      }

      handleClose();
      fetchVehiculos(); // Refrescar lista filtrada
    } catch (err) {
      console.error(err);
      setError("Error al guardar el mantenimiento.");
    }
  };

  return (
    <Box p={4} sx={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
        Gestión de Mantenimientos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            background: "linear-gradient(90deg, #1565c0, #42a5f5)",
            color: "white",
            "&:hover": {
              background: "linear-gradient(90deg, #1976d2, #64b5f6)",
            },
          }}
        >
          Nuevo Mantenimiento
        </Button>

        {/* Botón visible solo para jefe */}
        {JSON.parse(localStorage.getItem("usuario") || "{}")?.rol === "jefe" && (
          <Button
            variant="outlined"
            sx={{
              ml: 2,
              background: "linear-gradient(90deg, #ff9800, #ffc107)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(90deg, #ffb74d, #ffe082)",
              },
            }}
            onClick={async () => {
              try {
                const data = await getMantenimientos(); // Trae todos los mantenimientos
                setMantenimientos(data);
              } catch (err) {
                console.error(err);
                setError("No se pudieron obtener todos los mantenimientos.");
              }
            }}
          >
            Ver todos los mantenimientos
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 6 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white" }}>Fecha de Servicio</TableCell>
              <TableCell sx={{ color: "white" }}>Km Actual</TableCell>
              <TableCell sx={{ color: "white" }}>Km Próximo</TableCell>
              <TableCell sx={{ color: "white" }}>Tipo</TableCell>
              <TableCell sx={{ color: "white" }}>Descripción</TableCell>
              <TableCell sx={{ color: "white" }}>Vehículo</TableCell>
              <TableCell sx={{ color: "white" }}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mantenimientos.map((m) => (
              <TableRow key={m.id_mantenimiento}>
                <TableCell>
                  {m.fecha_servicio
                    ? new Date(m.fecha_servicio).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "—"}
                </TableCell>
                <TableCell>{m.km_actual}</TableCell>
                <TableCell>{m.km_servicioproximo}</TableCell>
                <TableCell>{m.tipo_mantenimiento}</TableCell>
                <TableCell>{m.descripcion}</TableCell>
                <TableCell>
                  {typeof m.id_vehiculo === "object"
                    ? `${m.id_vehiculo.marca} ${m.id_vehiculo.modelo} - ${m.id_vehiculo.placa}`
                    : m.id_vehiculo}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(m)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal Formulario */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editando ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
        </DialogTitle>
        <DialogContent>
          {/* Mostrar fecha solo cuando se edita */}
          {editando && (
            <TextField
              fullWidth
              margin="dense"
              label="Fecha de Servicio"
              value={
                editando.fecha_servicio
                  ? new Date(editando.fecha_servicio).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : ""
              }
              InputProps={{ readOnly: true }}
            />
          )}

          <TextField
            fullWidth
            margin="dense"
            label="Km Actual"
            value={kmActual}
            onChange={(e) => setKmActual(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Km Próximo"
            value={kmProximo}
            onChange={(e) => setKmProximo(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Tipo de Mantenimiento"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={3}
          />

          {/* Select de Vehículos filtrados */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="vehiculo-label">Vehículo</InputLabel>
            <Select
              labelId="vehiculo-label"
              value={idVehiculo}
              onChange={(e) => setIdVehiculo(e.target.value)}
            >
              {vehiculos.map((v) => (
                <MenuItem key={v.id_vehiculo} value={v.id_vehiculo}>
                  {v.marca} {v.modelo} - {v.placa}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #1565c0, #42a5f5)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(90deg, #1976d2, #64b5f6)",
              },
            }}
            onClick={handleSave}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MantenimientoTabla;
