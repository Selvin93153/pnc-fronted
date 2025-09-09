// src/components/WelcomePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Sidebar from "./Sidebar"; // Importa el Sidebar genérico
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon  from "@mui/icons-material/Build";

// 🔹 Items de la barra lateral
const sidebarItems = [
  { title: "Inicio", icon: <EmojiEventsIcon />, route: "/" },
  { title: "Roles", icon: <AdminPanelSettingsIcon />, route: "/panel/roles" },
  { title: "Usuarios", icon: <PeopleIcon />, route: "/panel/usuarios" },
  { title: "Reportes", icon: <SummarizeIcon />, route: "/panel/reportes" },
  { title: "Movimientos de Equipos", icon: <DirectionsCarIcon />, route: "/panel/movimientos" },
  { title: "Equipos Cargados", icon: <BuildIcon />, route: "/panel/equipos-cargados" },
];

export default function WelcomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(to right, #1976d2, #42a5f5)" }}>
      
      {/* Sidebar genérico */}
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={() => navigate("/login")}
        items={sidebarItems}
      />

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Barra superior */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" mb={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: "#fff" }} />
            </Button>
            <Typography variant="h4" color="white">Bienvenido</Typography>
          </Stack>
        </Stack>

        {/* Tarjeta central */}
        <Paper elevation={12} sx={{ p: 6, borderRadius: 4, textAlign: "center", maxWidth: 700 }}>
          <Stack spacing={3} alignItems="center">
            <EmojiEventsIcon sx={{ fontSize: 60, color: "#1976d2" }} />
            <Typography variant="h3" color="primary" fontWeight="bold">
              ¡Bienvenido al Sistema de Control!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Gestiona de forma segura armas, vehículos, equipos y reportes de la sede policial.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/panel")}
              sx={{
                mt: 2,
                py: 1.5,
                px: 6,
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.5)",
                transition: "all 0.3s ease",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Entrar al Panel General
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
