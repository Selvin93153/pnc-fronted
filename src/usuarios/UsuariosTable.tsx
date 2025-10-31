// src/components/UsuariosTable.tsx
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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

  const [nuevoUsuario, setNuevoUsuario] = useState<Omit<Usuario, "id_usuario">>({
    nombres: "",
    apellidos: "",
    nip: "",
    correo: "",
    contraseña: "",
    rol: { id_rol: 1, nombre_rol: "" },
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleInputChange = (field: keyof Omit<Usuario, "id_usuario">, value: any) => {
    setNuevoUsuario({ ...nuevoUsuario, [field]: value });
  };

  const handleInputEditChange = (field: keyof Omit<Usuario, "id_usuario">, value: any) => {
    if (!usuarioEditado) return;
    setUsuarioEditado({ ...usuarioEditado, [field]: value });
  };

  const handleAddUsuario = async () => {
    setErrorMsg(null);

    if (
      !nuevoUsuario.nombres.trim() ||
      !nuevoUsuario.apellidos.trim() ||
      !nuevoUsuario.nip.trim() ||
      !nuevoUsuario.correo.trim() ||
      !nuevoUsuario.contraseña.trim() ||
      !nuevoUsuario.rol
    ) {
      setErrorMsg("Por favor complete todos los campos.");
      return;
    }

    if (nuevoUsuario.contraseña !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    try {
      const usuarioAEnviar: any = {
        ...nuevoUsuario,
        id_rol: nuevoUsuario.rol.id_rol,
      };
      delete usuarioAEnviar.rol;

      const agregado = await addUsuario(usuarioAEnviar);
      setUsuarios([agregado, ...usuarios]);

      setNuevoUsuario({
        nombres: "",
        apellidos: "",
        nip: "",
        correo: "",
        contraseña: "",
        rol: roles.length > 0 ? roles[0] : { id_rol: 1, nombre_rol: "" },
      });
      setConfirmPassword("");
      setMostrarFormulario(false);
    } catch (error: any) {
      let mensaje = "Error al agregar usuario.";
      if (error?.response?.data) {
        const data = error.response.data;
        mensaje = Array.isArray(data.message) ? data.message.join(", ") : data.message || String(data);
      } else if (error?.message) {
        mensaje = error.message;
      }
      setErrorMsg(mensaje);
      console.error(error);
    }
  };

  const handleEditar = (usuario: Usuario) => {
    setModoEdicion(usuario.id_usuario);
    setUsuarioEditado({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      nip: usuario.nip,
      correo: usuario.correo,
      contraseña: "", // contraseña vacía, solo se envía si se cambia
      rol: usuario.rol,
    });
  };

  const handleGuardarEdicion = async (id: number) => {
    if (!usuarioEditado) return;

    if (
      !usuarioEditado.nombres.trim() ||
      !usuarioEditado.apellidos.trim() ||
      !usuarioEditado.nip.trim() ||
      !usuarioEditado.correo.trim() ||
      !usuarioEditado.rol
    ) {
      alert("Por favor complete todos los campos.");
      return;
    }

    try {
      const usuarioAEnviar: any = {
        nombres: usuarioEditado.nombres,
        apellidos: usuarioEditado.apellidos,
        nip: usuarioEditado.nip,
        correo: usuarioEditado.correo,
        id_rol: usuarioEditado.rol.id_rol,
      };

      // Solo enviar contraseña si se escribió algo nuevo
      if (usuarioEditado.contraseña) {
        usuarioAEnviar.contraseña = usuarioEditado.contraseña;
      }

      const actualizado = await updateUsuario(id, usuarioAEnviar);

      setUsuarios(
        usuarios.map((u) => (u.id_usuario === id ? actualizado : u))
      );

      setModoEdicion(null);
      setUsuarioEditado(null);
    } catch (error: any) {
      let mensaje = "Error al actualizar usuario.";
      if (error?.response?.data) {
        const data = error.response.data;
        mensaje = Array.isArray(data.message) ? data.message.join(", ") : data.message || String(data);
      } else if (error?.message) {
        mensaje = error.message;
      }
      alert(mensaje);
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
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            if (!mostrarFormulario) setErrorMsg(null);
          }}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar nuevo usuario"}
        </Button>
      </Box>

      <Dialog
        open={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
        <DialogContent sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
          {errorMsg && (
            <Box sx={{ width: "100%" }}>
              <Alert severity="error">{errorMsg}</Alert>
            </Box>
          )}

          <TextField
            label="Nombres"
            value={nuevoUsuario.nombres}
            onChange={(e) => handleInputChange("nombres", e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Apellidos"
            value={nuevoUsuario.apellidos}
            onChange={(e) => handleInputChange("apellidos", e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="NIP"
            value={nuevoUsuario.nip}
            onChange={(e) => handleInputChange("nip", e.target.value)}
            size="small"
            sx={{ width: { xs: "100%", sm: "30%" } }}
          />
          <TextField
            label="Correo"
            value={nuevoUsuario.correo}
            onChange={(e) => handleInputChange("correo", e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={nuevoUsuario.contraseña}
            onChange={(e) => handleInputChange("contraseña", e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmar contraseña"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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

          <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setMostrarFormulario(false)}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleAddUsuario}>
              Guardar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <TableContainer component={Paper} sx={{ maxWidth: 1100, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
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
                  <TableCell>
                    {modoEdicion === usuario.id_usuario ? (
                      <TextField
                        value={usuarioEditado?.nombres || ""}
                        onChange={(e) => handleInputEditChange("nombres", e.target.value)}
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
                        onChange={(e) => handleInputEditChange("apellidos", e.target.value)}
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
                        onChange={(e) => handleInputEditChange("correo", e.target.value)}
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
                            if (rolSeleccionado) handleInputEditChange("rol", rolSeleccionado);
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
                      <IconButton color="primary" onClick={() => handleEditar(usuario)}>
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
