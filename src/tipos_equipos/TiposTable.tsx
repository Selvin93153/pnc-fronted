import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import { getTipos, addTipo, updateTipo, type Tipos } from "./tiposService";

export default function TiposTable() {
  const [tipos, setTipos] = useState<Tipos[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");

  useEffect(() => {
    async function fetchTipos() {
      try {
        const data = await getTipos();
        setTipos(data);
      } catch (error) {
        console.error("Error al obtener tipos:", error);
      }
    }
    fetchTipos();
  }, []);

  const handleAddTipo = async () => {
    if (nuevoNombre.trim() === "") return;
    try {
      const nuevo = await addTipo(nuevoNombre.trim());
      setTipos([nuevo, ...tipos]);
      setNuevoNombre("");
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al agregar tipo:", error);
    }
  };

  const handleEditar = (tipo: Tipos) => {
    setModoEdicion(tipo.id_tipo);
    setNombreEditado(tipo.nombre);
  };

  const handleGuardarEdicion = async (id: number) => {
    if (nombreEditado.trim() === "") return;
    try {
      const actualizado = await updateTipo(id, nombreEditado.trim());
      setTipos(tipos.map((t) => (t.id_tipo === id ? actualizado : t)));
      setModoEdicion(null);
      setNombreEditado("");
    } catch (error) {
      console.error("Error al editar tipo:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f8faff", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de tipos de equipos
      </Typography>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar nuevo tipo de equipo"}
        </Button>
      </Box>

      <Collapse in={mostrarFormulario}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTipo();
          }}
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Nombre del nuevo tipo de equipo"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
          />
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </Box>
      </Collapse>

      <TableContainer component={Paper} sx={{ maxWidth: 700, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nombre del tipo de equipo
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {tipos.length > 0 ? (
              tipos.map((tipo) => (
                <TableRow key={tipo.id_tipo}>
                  <TableCell>{tipo.id_tipo}</TableCell>
                  <TableCell>
                    {modoEdicion === tipo.id_tipo ? (
                      <TextField
                        value={nombreEditado}
                        onChange={(e) => setNombreEditado(e.target.value)}
                        size="small"
                      />
                    ) : (
                      tipo.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    {modoEdicion === tipo.id_tipo ? (
                      <IconButton
                        color="success"
                        onClick={() => handleGuardarEdicion(tipo.id_tipo)}
                      >
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton color="primary" onClick={() => handleEditar(tipo)}>
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ fontStyle: "italic" }}>
                  No hay tipos de equipos disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}