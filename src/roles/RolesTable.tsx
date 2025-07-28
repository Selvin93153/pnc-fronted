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
import { getRoles } from "./rolesService";

interface Role {
  id_rol: number;
  nombre_rol: string;
}

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    }
    fetchRoles();
  }, []);

  const handleAddRole = () => {
    if (nuevoNombre.trim() === "") return;

    const nuevoRol: Role = {
      id_rol: roles.length > 0 ? Math.max(...roles.map((r) => r.id_rol)) + 1 : 1,
      nombre_rol: nuevoNombre.trim(),
    };
    setRoles([nuevoRol, ...roles]);
    setNuevoNombre("");
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Gestión de Roles
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRole();
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
          label="Nombre del nuevo rol"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
        />
        <Button variant="contained" color="primary" type="submit">
          Agregar Rol
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 700, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nombre del Rol
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow
                  key={role.id_rol}
                  hover
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{role.id_rol}</TableCell>
                  <TableCell>{role.nombre_rol}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ fontStyle: "italic" }}>
                  No hay roles disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
