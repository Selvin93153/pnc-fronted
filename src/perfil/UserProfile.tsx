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
} from "@mui/material";
import { getUsuarioById } from "./profileService";
import { useNavigate } from "react-router-dom";

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
    return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box textAlign="center" mt={4}><Alert severity="error">{error}</Alert></Box>;
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <Avatar sx={{ width: 100, height: 100, bgcolor: "primary.main", fontSize: 40 }}>
              {usuario.nombres?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                {usuario.nombres} {usuario.apellidos}
              </Typography>
              <Typography color="text.secondary">{usuario.correo}</Typography>
            </Box>
            <Box>
              <Typography><strong>NIP:</strong> {usuario.nip}</Typography>
              <Typography><strong>Rol:</strong> {usuario.rol?.nombre_rol}</Typography>
            </Box>
            <Button variant="outlined" color="primary" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
