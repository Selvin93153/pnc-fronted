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
  Button,
  Collapse,
} from "@mui/material";

import AddRoleForm from "./AddRoleForm";
import { getRoles, addRole } from "./rolesService"; // asegúrate de importar addRole

interface Role {
  id_rol: number;
  nombre_rol: string;
}

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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



const handleAddRole = async (nombre: string) => {
  try {
    const nuevoRol = await addRole(nombre); // guardar en backend
    setRoles([nuevoRol, ...roles]); // actualizar localmente
    setMostrarFormulario(false);
  } catch (error) {
    console.error("Error al agregar rol:", error);
    // Podrías mostrar un mensaje de error al usuario aquí
  }
};

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Roles
      </Typography>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar nuevo rol"}
        </Button>
      </Box>

      <Collapse in={mostrarFormulario}>
        <AddRoleForm onAdd={handleAddRole} />
      </Collapse>

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
                <TableRow key={role.id_rol} hover sx={{ cursor: "pointer" }}>
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
