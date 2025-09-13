import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Sidebar from "./Sidebar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";

// Items de la barra lateral
const sidebarItems = [
  { title: "Inicio", icon: <EmojiEventsIcon />, route: "/welcome" },
  { title: "Perfil", icon: <AdminPanelSettingsIcon />, route: "/panel/perfil" },
  { title: "Panel General", icon: <MenuIcon />, route: "/panel" },
  { title: "Roles", icon: <AdminPanelSettingsIcon />, route: "/panel/roles" },
  { title: "Usuarios", icon: <PeopleIcon />, route: "/panel/usuarios" },
  { title: "Reportes", icon: <SummarizeIcon />, route: "/panel/reportes" },
  { title: "Movimientos de Equipos", icon: <DirectionsCarIcon />, route: "/panel/movimientos" },
  { title: "Equipos Cargados", icon: <BuildIcon />, route: "/panel/equipos-cargados" },
];

export default function WelcomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // 🔹 Datos simulados de dashboard (pueden reemplazarse con tus endpoints reales)
  const [stats] = useState({
    usuariosActivos: 12,
    reportesRecientes: 5,
    equiposEnUso: 8,
    movimientosHoy: 3,
  });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#0d1b2a", color: "#fff" }}>
      
      {/* Sidebar */}
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={() => navigate("/login")}
        items={sidebarItems}
        forceReloadWelcome={() => {}}
      />

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, p: 5 }}>
        
        {/* Barra superior */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: "#4fc3f7" }} />
            </Button>
            <Typography variant="h4" fontWeight="bold">
              Bienvenido
            </Typography>
          </Stack>
        </Stack>

        {/* Título principal */}
        <Box textAlign="center" mb={8}>
          <EmojiEventsIcon sx={{ fontSize: 80, color: "#4fc3f7" }} />
          <Typography variant="h2" fontWeight="bold" sx={{ mt: 2, mb: 2, color: "#e0f7fa" }}>
            ¡Bienvenido al Sistema de Control!
          </Typography>
          <Typography variant="h6" sx={{ color: "#cfd8dc" }}>
            Gestiona de forma segura armas, vehículos, equipos y reportes de la sede policial.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/panel")}
            sx={{
              mt: 4,
              py: 1.5,
              px: 6,
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: "1.1rem",
              backgroundColor: "#4fc3f7",
              color: "#0d1b2a",
              boxShadow: "0 6px 20px rgba(79,195,247,0.5)",
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "#3a99c9" },
            }}
          >
            Entrar al Panel General
          </Button>
        </Box>

        {/* Dashboard inferior */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="center" alignItems="center" flexWrap="wrap">
          
          {/* Usuarios activos */}
          <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: "#f7f8fbff", minWidth: 200, textAlign: "center" }}>
            <PeopleIcon sx={{ fontSize: 40, color: "#4fc3f7" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{stats.usuariosActivos}</Typography>
            <Typography variant="subtitle1" sx={{ color: "#0b0b0bff" }}>Usuarios activos</Typography>
          </Paper>

          {/* Reportes recientes */}
          <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: "#fdfcfcff", minWidth: 200, textAlign: "center" }}>
            <SummarizeIcon sx={{ fontSize: 40, color: "#ffb74d" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{stats.reportesRecientes}</Typography>
            <Typography variant="subtitle1" sx={{ color: "#0a0a0aff" }}>Reportes recientes</Typography>
          </Paper>

          {/* Equipos en uso */}
          <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: "#fdfbfbff", minWidth: 200, textAlign: "center" }}>
            <BuildIcon sx={{ fontSize: 40, color: "#81c784" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{stats.equiposEnUso}</Typography>
            <Typography variant="subtitle1" sx={{ color: "#0b0b0bff" }}>Equipos en uso</Typography>
          </Paper>

          {/* Movimientos hoy */}
          <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: "#f4f6f9ff", minWidth: 200, textAlign: "center" }}>
            <DirectionsCarIcon sx={{ fontSize: 40, color: "#f06292" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{stats.movimientosHoy}</Typography>
            <Typography variant="subtitle1" sx={{ color: "#0f0f0fff" }}>Movimientos hoy</Typography>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
