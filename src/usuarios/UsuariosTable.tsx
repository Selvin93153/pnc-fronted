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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import {
  getUsuarios,
  addUsuario,
  updateUsuario,
  getRoles,
  type Usuario,
  type Rol,
} from "./usuariosService";

export default function UsuariosTable() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState<number | null>(null);

  // Estado para nuevo usuario (sin id_usuario)
  const [nuevoUsuario, setNuevoUsuario] = useState<Omit<Usuario, "id_usuario">>({
    nombres: "",
    apellidos: "",
    nip: "",
    correo: "",
    contraseña: "",
    rol: { id_rol: 1, nombre_rol: "" },
  });

  // Estado para editar usuario
  const [usuarioEditado, setUsuarioEditado] = useState<Omit<Usuario, "id_usuario"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const us = await getUsuarios();
        const rs = await getRoles();
        setUsuarios(us);
        setRoles(rs);
        if (rs.length > 0) {
          setNuevoUsuario((u) => ({ ...u, rol: rs[0] }));
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  // Cambios en formulario nuevo usuario
  const handleInputChange = (field: keyof Omit<Usuario, "id_usuario">, value: any) => {
    setNuevoUsuario({ ...nuevoUsuario, [field]: value });
  };

  // Cambios en formulario editar usuario
  const handleInputEditChange = (field: keyof Omit<Usuario, "id_usuario">, value: any) => {
    if (!usuarioEditado) return;
    setUsuarioEditado({ ...usuarioEditado, [field]: value });
  };

  // Agregar nuevo usuario
  const handleAddUsuario = async () => {
    // Validaciones básicas
    if (
      !nuevoUsuario.nombres.trim() ||
      !nuevoUsuario.apellidos.trim() ||
      !nuevoUsuario.nip.trim() ||
      !nuevoUsuario.correo.trim() ||
      !nuevoUsuario.contraseña.trim() ||
      !nuevoUsuario.rol
    ) {
      alert("Por favor complete todos los campos.");
      return;
    }
    if (nuevoUsuario.contraseña.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    try {
      // Preparamos objeto para enviar (backend espera id_rol, no rol completo)
      const usuarioAEnviar = {
        ...nuevoUsuario,
        id_rol: nuevoUsuario.rol.id_rol,
      };
      delete (usuarioAEnviar as any).rol;

      const agregado = await addUsuario(usuarioAEnviar);
      setUsuarios([agregado, ...usuarios]);

      // Reset form
      setNuevoUsuario({
        nombres: "",
        apellidos: "",
        nip: "",
        correo: "",
        contraseña: "",
        rol: roles.length > 0 ? roles[0] : { id_rol: 1, nombre_rol: "" },
      });
      setMostrarFormulario(false);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error al agregar usuario.");
      console.error(error);
    }
  };

  // Iniciar edición
  const handleEditar = (usuario: Usuario) => {
    setModoEdicion(usuario.id_usuario);
    setUsuarioEditado({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      nip: usuario.nip,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      rol: usuario.rol,
    });
  };

  // Guardar edición
  const handleGuardarEdicion = async (id: number) => {
    if (!usuarioEditado) return;

    // Validaciones
    if (
      !usuarioEditado.nombres.trim() ||
      !usuarioEditado.apellidos.trim() ||
      !usuarioEditado.nip.trim() ||
      !usuarioEditado.correo.trim() ||
      !usuarioEditado.contraseña.trim() ||
      !usuarioEditado.rol
    ) {
      alert("Por favor complete todos los campos.");
      return;
    }
    if (usuarioEditado.contraseña.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const usuarioAEnviar = {
        ...usuarioEditado,
        id_rol: usuarioEditado.rol.id_rol,
      };
      delete (usuarioAEnviar as any).rol;

      const actualizado = await updateUsuario(id, usuarioAEnviar);
      setUsuarios(
        usuarios.map((u) => (u.id_usuario === id ? actualizado : u))
      );
      setModoEdicion(null);
      setUsuarioEditado(null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error al actualizar usuario.");
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar nuevo usuario"}
        </Button>
      </Box>

      <Collapse in={mostrarFormulario}>
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
              value={nuevoUsuario.rol?.id_rol || ""}
              onChange={(e) => {
                const rolSeleccionado = roles.find(
                  (r) => r.id_rol === Number(e.target.value)
                );
                if (rolSeleccionado) handleInputChange("rol", rolSeleccionado);
              }}
              label="Rol"
            >
              {roles.map((rol) => (
                <MenuItem key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre_rol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </Box>
      </Collapse>

      <TableContainer component={Paper} sx={{ maxWidth: 1100, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombres</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Apellidos</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>NIP</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Correo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rol</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id_usuario}>
                  <TableCell>{usuario.id_usuario}</TableCell>

                  <TableCell>
                    {modoEdicion === usuario.id_usuario ? (
                      <TextField
                        value={usuarioEditado?.nombres || ""}
                        onChange={(e) =>
                          handleInputEditChange("nombres", e.target.value)
                        }
                        size="small"
                      />
                    ) : (
                      usuario.nombres
                    )}
                  </TableCell>

                  <TableCell>
                    {modoEdicion === usuario.id_usuario ? (
                      <TextField
                        value={usuarioEditado?.apellidos || ""}
                        onChange={(e) =>
                          handleInputEditChange("apellidos", e.target.value)
                        }
                        size="small"
                      />
                    ) : (
                      usuario.apellidos
                    )}
                  </TableCell>

                  <TableCell>
                    {modoEdicion === usuario.id_usuario ? (
                      <TextField
                        value={usuarioEditado?.nip || ""}
                        onChange={(e) => handleInputEditChange("nip", e.target.value)}
                        size="small"
                      />
                    ) : (
                      usuario.nip
                    )}
                  </TableCell>

                  <TableCell>
                    {modoEdicion === usuario.id_usuario ? (
                      <TextField
                        value={usuarioEditado?.correo || ""}
                        onChange={(e) =>
                          handleInputEditChange("correo", e.target.value)
                        }
                        size="small"
                      />
                    ) : (
                      usuario.correo
                    )}
                  </TableCell>

                  <TableCell>
                    {modoEdicion === usuario.id_usuario ? (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={usuarioEditado?.rol.id_rol || ""}
                          onChange={(e) => {
                            const rolSeleccionado = roles.find(
                              (r) => r.id_rol === Number(e.target.value)
                            );
                            if (rolSeleccionado)
                              handleInputEditChange("rol", rolSeleccionado);
                          }}
                          label="Rol"
                        >
                          {roles.map((rol) => (
                            <MenuItem key={rol.id_rol} value={rol.id_rol}>
                              {rol.nombre_rol}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      usuario.rol.nombre_rol
                    )}
                  </TableCell>

                  <TableCell>
                    {modoEdicion === usuario.id_usuario ? (
                      <IconButton
                        color="success"
                        onClick={() => handleGuardarEdicion(usuario.id_usuario)}
                      >
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEditar(usuario)}
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ fontStyle: "italic" }}>
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
