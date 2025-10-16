// src/perfil/UserProfile.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { getUsuarioById, changePassword } from "./profileService";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface UserProfileProps {
  onLogout?: () => void;
}

export default function UserProfile({ onLogout }: UserProfileProps) {
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("usuario") || "{}");

    if (!token || !storedUser.id_usuario) {
      setError("No se encontró información del usuario.");
      setLoading(false);
      return;
    }

    getUsuarioById(storedUser.id_usuario, token)
      .then((data) => setUsuario(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son obligatorios.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    try {
      const res = await changePassword(currentPassword, newPassword);
      setSuccessMessage(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (err: any) {
      setPasswordError(err.message);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={6}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, px: 2 }}>
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: 8,
          background: "linear-gradient(135deg, #ffffff, #f5f7fa)",
        }}
      >
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 110,
                height: 110,
                bgcolor: "primary.main",
                fontSize: 42,
                border: "4px solid white",
                boxShadow: 4,
              }}
            >
              {usuario.nombres?.charAt(0).toUpperCase() || "U"}
            </Avatar>

            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                {usuario.nombres} {usuario.apellidos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuario.correo}
              </Typography>
            </Box>

            <Divider flexItem />

            <Stack spacing={1} alignItems="center">
              <Chip label={`NIP: ${usuario.nip}`} color="primary" variant="outlined" />
              <Chip label={`Rol: ${usuario.rol?.nombre_rol}`} color="secondary" variant="outlined" />
            </Stack>

            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 3, px: 4, mt: 2 }}
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              Cambiar contraseña
            </Button>

            {showChangePassword && (
              <Stack spacing={2} width="100%" mt={2}>
                {passwordError && <Alert severity="error">{passwordError}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}

                <TextField
                  type={showCurrent ? "text" : "password"}
                  label="Contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end">
                          {showCurrent ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  type={showNew ? "text" : "password"}
                  label="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                          {showNew ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  type={showConfirm ? "text" : "password"}
                  label="Confirmar nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                          {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="contained"
                  color="success"
                  onClick={handlePasswordChange}
                  sx={{ borderRadius: 3 }}
                >
                  Guardar cambios
                </Button>
              </Stack>
            )}

            <Button
              variant="contained"
              color="error"
              size="large"
              endIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderRadius: 3, px: 4, mt: 2 }}
            >
              Cerrar sesión
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
