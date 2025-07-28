import  { useEffect, useState } from "react";
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
} from "@mui/material";
import { getTipos } from "./tiposService";

interface Tipos {
  id_tipo: number;
  nombre: string;
}

export default function TiposTable() {
  const [tipos, setTipos] = useState<Tipos[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");

  useEffect(() => {
    async function fetchTipos() {
      try {
        const data = await getTipos();
        setTipos(data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    }
    fetchTipos();
  }, []);

  const handleAddTipos = () => {
    if (nuevoNombre.trim() === "") return;

    const nuevoTipo: Tipos = {
      id_tipo: tipos.length > 0 ? Math.max(...tipos.map((r) => r.id_tipo)) + 1 : 1,
      nombre: nuevoNombre.trim(),
    };
    setTipos([nuevoTipo, ...tipos]);
    setNuevoNombre("");
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Gestión de tipos de equipos
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTipos();
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
          Agregar tipo equipo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 700, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nombre del tipo de equipo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tipos.length > 0 ? (
              tipos.map((tipos) => (
                <TableRow
                  key={tipos.id_tipo}
                  hover
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{tipos.id_tipo}</TableCell>
                  <TableCell>{tipos.nombre}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ fontStyle: "italic" }}>
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
