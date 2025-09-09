import {
  Box,
  Typography,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import DevicesIcon from "@mui/icons-material/Devices";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ChecklistIcon from "@mui/icons-material/Checklist";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BuildIcon from "@mui/icons-material/Build";
import SummarizeIcon  from "@mui/icons-material/Summarize";

interface Props {
  onLogout: () => void;
  forceReloadWelcome: () => void; // 🔹 CAMBIO: callback para recargar WelcomePage
}

export default function AppContent({ onLogout, forceReloadWelcome }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isInRootPanel = location.pathname === "/panel";

  const cardModules = [
    { title: "Roles", icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: "#1976d2" }} />, route: "/panel/roles", description: "Gestiona los roles del sistema" },
    { title: "Tipos de Equipos", icon: <DevicesIcon sx={{ fontSize: 40, color: "#2e7d32" }} />, route: "/panel/tipos", description: "Administra los tipos de equipos" },
    { title: "Usuarios", icon: <PeopleIcon sx={{ fontSize: 40, color: "#9c27b0" }} />, route: "/panel/usuarios", description: "Control de cuentas de usuarios" },
    { title: "Reportes", icon: <SummarizeIcon sx={{ fontSize: 40, color: "#ff9800" }} />, route: "/panel/reportes", description: "Visualización de reportes" },
    { title: "Vehiculos", icon: <DirectionsCarIcon sx={{ fontSize: 40, color: "#0288d1" }} />, route: "/panel/vehiculos", description: "Control de vehículos" },
    { title: "Mantenimiento", icon: <BuildIcon sx={{ fontSize: 40, color: "#f44336" }} />, route: "/panel/mantenimiento", description: "Gestión de mantenimiento" },
    { title: "Equipos Asignados", icon: <ChecklistIcon sx={{ fontSize: 40, color: "#388e3c" }} />, route: "/panel/asignados", description: "Gestión de armas, chalecos y radios" },
    { title: "Equipos a Prestamo", icon: <WorkOutlineIcon sx={{ fontSize: 40, color: "#6a1b9a" }} />, route: "/panel/prestamos", description: "Total de equipos disponibles" },
    { title: "Movimientos de Equipos", icon: <CompareArrowsIcon sx={{ fontSize: 40, color: "#00796b" }} />, route: "/panel/movimientos", description: "Registro de ingreso y egreso" },
   { title: "Devolucion de Equipos", icon: <CompareArrowsIcon sx={{ fontSize: 40, color: "#00796b" }} />, route: "/panel/devolucion", description: "Devoluciones de equipos" },
    { title: "Equipos Cargados", icon: <Inventory2Icon sx={{ fontSize: 40, color: "#795548" }} />, route: "/panel/equiposcargados", description: "Listado de equipos adjudicados" },
    { title: "Perfil", icon: <AccountCircleIcon sx={{ fontSize: 40, color: "#0097a7" }} />, route: "/panel/perfil", description: "Datos personales" },
  ];

  const sidebarItems = [
    { title: "Inicio", icon: <AccountCircleIcon />, route: "/welcome" },
    { title: "Perfil", icon: <AdminPanelSettingsIcon />, route: "/panel/perfil" },
    { title: "Roles", icon: <AdminPanelSettingsIcon />, route: "/panel/roles" },
    { title: "Usuarios", icon: <PeopleIcon />, route: "/panel/usuarios" },
    { title: "Reportes", icon: <SummarizeIcon />, route: "/panel/reportes" },
    { title: "Movimientos de Equipos", icon: <DirectionsCarIcon />, route: "/panel/movimientos" },
    { title: "Equipos Cargados", icon: <BuildIcon />, route: "/panel/equiposcargados" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={onLogout}
        items={sidebarItems}
        forceReloadWelcome={forceReloadWelcome} // 🔹 CAMBIO
      />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
            <Typography variant="h4" color="primary">Panel de Administración</Typography>
          </Stack>
          <Box>
            <IconButton onClick={onLogout}>Cerrar sesión</IconButton>
          </Box>
        </Stack>

        {/* Mostrar tarjetas solo en /panel */}
        {isInRootPanel && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 4
            }}
          >
            {cardModules.map(mod => (
              <Card key={mod.title} sx={{
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                backgroundColor: "#fff",
                transition: "transform 0.2s ease-in-out, box-shadow 0.3s",
                "&:hover": { transform: "scale(1.03)", boxShadow: "0 6px 20px rgba(25, 118, 210, 0.5)" }
              }}>
                <CardActionArea onClick={() => navigate(mod.route)}>
                  <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <Box mb={2}>{mod.icon}</Box>
                    <Typography variant="h6" gutterBottom>{mod.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{mod.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}

        {/* Renderizar rutas internas del panel */}
        {!isInRootPanel && <Outlet />}
      </Box>
    </Box>
  );
}
