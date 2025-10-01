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
} from "@mui/material";
import { getUsuarioById } from "./profileService";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

interface UserProfileProps {
  onLogout?: () => void;
}

export default function UserProfile({ onLogout }: UserProfileProps) {
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        px: 2,
      }}
    >
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: 8,
          background: "linear-gradient(135deg, #ffffff, #f5f7fa)",
        }}
      >
        <CardContent>
          <Stack spacing={3} alignItems="center">
            {/* Avatar con borde */}
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

            {/* Nombre y correo */}
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                {usuario.nombres} {usuario.apellidos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuario.correo}
              </Typography>
            </Box>

            <Divider flexItem />

            {/* Info del usuario */}
            <Stack spacing={1} alignItems="center">
              <Chip label={`NIP: ${usuario.nip}`} color="primary" variant="outlined" />
              <Chip label={`Rol: ${usuario.rol?.nombre_rol}`} color="secondary" variant="outlined" />
            </Stack>

            {/* Botón logout */}
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
