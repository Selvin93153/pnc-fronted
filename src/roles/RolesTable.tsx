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
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // icono para botón

import AddRoleForm from "./AddRoleForm";
import { getRoles, addRole } from "./rolesService";

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
      const nuevoRol = await addRole(nombre);
      setRoles([nuevoRol, ...roles]);
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al agregar rol:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Encabezado */}
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 3, textAlign: "center", borderRadius: 3 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Gestión de Roles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra y agrega los diferentes roles disponibles en el sistema
        </Typography>
      </Paper>

      {/* Botón */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Button
          variant={mostrarFormulario ? "outlined" : "contained"}
          color="primary"
          startIcon={!mostrarFormulario && <AddIcon />}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          sx={{ borderRadius: 2, px: 3 }}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar nuevo rol"}
        </Button>
      </Box>

      {/* Formulario */}
      <Collapse in={mostrarFormulario}>
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, maxWidth: 600, mx: "auto" }}>
          <AddRoleForm onAdd={handleAddRole} />
        </Paper>
      </Collapse>

      <Divider sx={{ mb: 3 }} />

      {/* Tabla */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ maxWidth: 800, mx: "auto", borderRadius: 3 }}
      >
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
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f0f4ff" },
                  }}
                >
                  <TableCell>{role.id_rol}</TableCell>
                  <TableCell>{role.nombre_rol}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  align="center"
                  sx={{ fontStyle: "italic", py: 3 }}
                >
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
