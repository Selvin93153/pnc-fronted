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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  getUsuarios,
  addUsuario,
  updateUsuario,
  getRoles,
  type Usuario,
  type Rol,
  type UsuarioCrear,
} from "./usuariosService";

export default function UsuariosTable() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);

  // Estado para nuevo usuario solo con campos de creación
  const [nuevoUsuario, setNuevoUsuario] = useState<UsuarioCrear>({
    nombres: "",
    apellidos: "",
    nip: "",
    correo: "",
    contraseña: "",
    id_rol: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const us = await getUsuarios();
        const rs = await getRoles();
        setUsuarios(us);
        setRoles(rs);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  // Cambia campos de nuevoUsuario
  const handleInputChange = (field: keyof UsuarioCrear, value: string | number) => {
    setNuevoUsuario({ ...nuevoUsuario, [field]: value });
  };

  const handleAddUsuario = async () => {
    const { nombres, apellidos, nip, correo, contraseña } = nuevoUsuario;
    if (!nombres || !apellidos || !nip || !correo || !contraseña) return;

       if (contraseña.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  // Validar que NIP no exista ya
  const nipExiste = usuarios.some(u => u.nip === nip);
  if (nipExiste) {
    alert("El NIP ya está registrado. Por favor ingresa uno diferente.");
    return;
  }


    try {
      const added = await addUsuario(nuevoUsuario);
      setUsuarios([added, ...usuarios]);
      setNuevoUsuario({
        nombres: "",
        apellidos: "",
        nip: "",
        correo: "",
        contraseña: "",
        id_rol: 1,
      });
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };

  const handleEdit = async (id: number, field: keyof Usuario, value: string) => {
    try {
      await updateUsuario(id, { [field]: value });
      setUsuarios((prev) =>
        prev.map((u) => (u.id_usuario === id ? { ...u, [field]: value } : u))
      );
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {/* Formulario para agregar usuario */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddUsuario();
        }}
        sx={{
          mb: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <TextField
          label="Nombres"
          value={nuevoUsuario.nombres}
          onChange={(e) => handleInputChange("nombres", e.target.value)}
          size="small"
        />
        <TextField
          label="Apellidos"
          value={nuevoUsuario.apellidos}
          onChange={(e) => handleInputChange("apellidos", e.target.value)}
          size="small"
        />
        <TextField
          label="NIP"
          value={nuevoUsuario.nip}
          onChange={(e) => handleInputChange("nip", e.target.value)}
          size="small"
        />
        <TextField
          label="Correo"
          value={nuevoUsuario.correo}
          onChange={(e) => handleInputChange("correo", e.target.value)}
          size="small"
        />
        <TextField
          label="Contraseña"
          type="password"
          value={nuevoUsuario.contraseña}
          onChange={(e) => handleInputChange("contraseña", e.target.value)}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Rol</InputLabel>
          <Select
            value={nuevoUsuario.id_rol}
            onChange={(e) => handleInputChange("id_rol", Number(e.target.value))}
            label="Rol"
          >
            {roles.map((rol) => (
              <MenuItem key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre_rol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Agregar Usuario
        </Button>
      </Box>

      {/* Tabla de usuarios */}
      <TableContainer component={Paper} sx={{ maxWidth: 1100, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombres</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Apellidos</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Correo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rol</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id_usuario}>
                  <TableCell>{usuario.id_usuario}</TableCell>
                  <TableCell>
                    <TextField
                      value={usuario.nombres}
                      onChange={(e) =>
                        handleEdit(usuario.id_usuario, "nombres", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={usuario.apellidos}
                      onChange={(e) =>
                        handleEdit(usuario.id_usuario, "apellidos", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={usuario.correo}
                      onChange={(e) =>
                        handleEdit(usuario.id_usuario, "correo", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell>{usuario.rol?.nombre_rol ?? "Rol no asignado"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
