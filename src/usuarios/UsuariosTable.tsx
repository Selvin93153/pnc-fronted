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
import { getUsuarios } from "./usuariosService";

interface Usuarios {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  nip: string;
  correo: string;
  contraseña: string;
}

export default function UsuariosTable() {
  const [Usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoApellido, setNuevoApellido] = useState("");
  const [nuevoNip, setNuevoNip] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    }
    fetchUsuarios();
  }, []);

  const handleAddUsuarios = () => {
  if (
    nuevoNombre.trim() === "" ||
    nuevoApellido.trim() === "" ||
    nuevoNip.trim() === "" ||
    nuevoCorreo.trim() === "" ||
    nuevaContraseña.trim() === ""
  ) {
    return;
  }

  const nuevoUsuario: Usuarios = {
    id_usuario: Usuarios.length > 0 ? Math.max(...Usuarios.map((r) => r.id_usuario)) + 1 : 1,
    nombres: nuevoNombre.trim(),
    apellidos: nuevoApellido.trim(),
    nip: nuevoNip.trim(),
    correo: nuevoCorreo.trim(),
    contraseña: nuevaContraseña.trim(),
  };

  setUsuarios([nuevoUsuario, ...Usuarios]);

  // Limpiar campos
  setNuevoNombre("");
  setNuevoApellido("");
  setNuevoNip("");
  setNuevoCorreo("");
  setNuevaContraseña("");
};


  
  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddUsuarios();
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
          Agregar usuarios
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 700, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nombres
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}> Apellidos </TableCell>
               <TableCell sx={{ color: "white", fontWeight: "bold" }}> correo </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}> contraseña </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Usuarios.length > 0 ? (
              Usuarios.map((Usuarios) => (
                <TableRow
                  key={Usuarios.id_usuario}
                  hover
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{Usuarios.id_usuario}</TableCell>
                  <TableCell>{Usuarios.nombres}</TableCell>
                     <TableCell>{Usuarios.apellidos}</TableCell>
                        <TableCell>{Usuarios.correo}</TableCell>
                        <TableCell>{Usuarios.contraseña}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ fontStyle: "italic" }}>
                  No hay usuarios disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
