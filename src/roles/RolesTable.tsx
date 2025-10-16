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
import AddIcon from "@mui/icons-material/Add";

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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8f9fb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 6,
        px: 2,
      }}
    >
      {/* Encabezado limpio */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ color: "#1a1a1a", mb: 1, textAlign: "center" }}
      >
        Gestión de Roles
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center", maxWidth: 600 }}
      >
        Administra, visualiza y agrega los diferentes roles disponibles en el sistema.
      </Typography>

      {/* Botón agregar */}
      <Button
        variant={mostrarFormulario ? "outlined" : "contained"}
        color="primary"
        startIcon={!mostrarFormulario && <AddIcon />}
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        sx={{
          borderRadius: 2,
          px: 4,
          py: 1.2,
          mb: 3,
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        {mostrarFormulario ? "Cancelar" : "Agregar nuevo rol"}
      </Button>

      {/* Formulario agregar */}
      <Collapse in={mostrarFormulario}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            maxWidth: 600,
            mx: "auto",
            bgcolor: "white",
          }}
        >
          <AddRoleForm onAdd={handleAddRole} />
        </Paper>
      </Collapse>

      <Divider sx={{ width: "80%", my: 3 }} />

      {/* Tabla de roles */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "90%",
          maxWidth: 700,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#1976d2" }}>
              <TableCell
                align="center"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: 0.3,
                }}
              >
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
                    transition: "background 0.2s ease",
                    "&:hover": { bgcolor: "#f4f7fc" },
                  }}
                >
                  <TableCell align="center" sx={{ py: 2 }}>
                    {role.nombre_rol}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    fontStyle: "italic",
                    py: 3,
                    color: "text.secondary",
                  }}
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
