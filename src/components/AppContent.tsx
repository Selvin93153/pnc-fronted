import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { useState, type JSX } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import HeaderGlobal from "./HeaderGlobal";
import FooterGlobal from "../components/FooterGlobal"; // ✅ Importamos el footer

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import DevicesIcon from "@mui/icons-material/Devices";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ChecklistIcon from "@mui/icons-material/Checklist";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BuildIcon from "@mui/icons-material/Build";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import SummarizeIcon from "@mui/icons-material/Summarize";

interface Props {
  onLogout: () => void;
  forceReloadWelcome: () => void;
}

export default function AppContent({ onLogout, forceReloadWelcome }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isInRootPanel = location.pathname === "/panel";

  // Obtener rol desde el localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const rol = usuario?.rol || "";

  // Definir los módulos que cada rol puede ver
  const roleAccess: Record<string, string[]> = {
    jefe: ["Roles", "Tipos de Equipos", "Usuarios", "Reportes", "Vehiculos", "Mantenimiento", "Equipos Cargados"],
    armero: [
      "Tipos de Equipos",
      "Reportes",
      "Vehiculos",
      "Mantenimiento",
      "Equipos Asignados",
      "Equipos a Prestamo",
      "Movimientos de Equipos",
      "Devolución de Equipos Prestados",
      "Equipos Cargados",
      "Devoluciones de Equipos Propios",
    ],
    "agente operativo": ["Reportes", "Vehiculos", "Mantenimiento", "Equipos Cargados"],
  };

  const allModules = [
    { title: "Roles", icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: "#1976d2" }} />, route: "/panel/roles", description: "Gestiona los roles del sistema" },
    { title: "Tipos de Equipos", icon: <DevicesIcon sx={{ fontSize: 40, color: "#2e7d32" }} />, route: "/panel/tipos", description: "Administra los tipos de equipos" },
    { title: "Usuarios", icon: <PeopleIcon sx={{ fontSize: 40, color: "#9c27b0" }} />, route: "/panel/usuarios", description: "Control de cuentas de usuarios" },
    { title: "Reportes", icon: <SummarizeIcon sx={{ fontSize: 40, color: "#ff9800" }} />, route: "/panel/reportes", description: "Visualización de reportes" },
    { title: "Vehiculos", icon: <DirectionsCarIcon sx={{ fontSize: 40, color: "#0288d1" }} />, route: "/panel/vehiculos", description: "Control de vehículos" },
    { title: "Mantenimiento", icon: <BuildIcon sx={{ fontSize: 40, color: "#f44336" }} />, route: "/panel/mantenimiento", description: "Gestión de mantenimiento" },
    { title: "Equipos Asignados", icon: <ChecklistIcon sx={{ fontSize: 40, color: "#388e3c" }} />, route: "/panel/asignados", description: "Gestión del equipo adjudicado a un agente" },
    { title: "Equipos a Prestamo", icon: <WorkOutlineIcon sx={{ fontSize: 40, color: "#6a1b9a" }} />, route: "/panel/prestamos", description: "Total de equipos disponibles" },
    { title: "Movimientos de Equipos", icon: <SwapHorizIcon sx={{ fontSize: 40, color: "#1976d2" }} />, route: "/panel/movimientos", description: "Registro de ingreso y egreso de equipos" },
    { title: "Devolución de Equipos Prestados", icon: <AssignmentReturnIcon sx={{ fontSize: 40, color: "#00796b" }} />, route: "/panel/devolucion", description: "Devoluciones de equipos a préstamo" },
    { title: "Equipos Cargados", icon: <StorefrontIcon sx={{ fontSize: 40, color: "#ff9800" }} />, route: "/panel/equiposcargados", description: "Equipos adjudicados a tu usuario" },
    { title: "Devoluciones de Equipos Propios", icon: <AssignmentReturnedIcon sx={{ fontSize: 40, color: "#795548" }} />, route: "/panel/equipospropios", description: "Gestión de devoluciones de equipos adjudicados" },
  ];

  const cardModules = allModules.filter((mod) => roleAccess[rol]?.includes(mod.title));

  // Sidebar items según rol
  let sidebarItems: { title: string; icon: JSX.Element; route: string }[] = [];

  if (rol === "armero") {
    sidebarItems = [
      { title: "Inicio", icon: <AccountCircleIcon />, route: "/welcome" },
      { title: "Perfil", icon: <AdminPanelSettingsIcon />, route: "/panel/perfil" },
      { title: "Panel General", icon: <StorefrontIcon sx={{ fontSize: 24 }} />, route: "/panel" },
      { title: "Equipos Asignados", icon: <ChecklistIcon sx={{ fontSize: 24 }} />, route: "/panel/asignados" },
      { title: "Equipos a Prestamo", icon: <WorkOutlineIcon sx={{ fontSize: 24 }} />, route: "/panel/prestamos" },
    ];
  } else if (rol === "jefe") {
    sidebarItems = [
      { title: "Inicio", icon: <AccountCircleIcon />, route: "/welcome" },
      { title: "Perfil", icon: <AdminPanelSettingsIcon />, route: "/panel/perfil" },
      { title: "Panel General", icon: <StorefrontIcon sx={{ fontSize: 24 }} />, route: "/panel" },
      { title: "Usuarios", icon: <PeopleIcon sx={{ fontSize: 24 }} />, route: "/panel/usuarios" },
      { title: "Equipos Cargados", icon: <StorefrontIcon sx={{ fontSize: 24 }} />, route: "/panel/equiposcargados" },
    ];
  } else if (rol === "agente operativo") {
    sidebarItems = [
      { title: "Inicio", icon: <AccountCircleIcon />, route: "/welcome" },
      { title: "Perfil", icon: <AdminPanelSettingsIcon />, route: "/panel/perfil" },
      { title: "Panel General", icon: <StorefrontIcon sx={{ fontSize: 24 }} />, route: "/panel" },
      { title: "Reportes", icon: <SummarizeIcon sx={{ fontSize: 24 }} />, route: "/panel/reportes" },
      { title: "Equipos Cargados", icon: <StorefrontIcon sx={{ fontSize: 24 }} />, route: "/panel/equiposcargados" },
    ];
  }

  return (
    // ⚡ Layout column para header + contenido + footer
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header global */}
      <HeaderGlobal onMenuClick={() => setDrawerOpen(true)} onLogout={onLogout} />

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onLogout={onLogout}
          items={sidebarItems}
          forceReloadWelcome={forceReloadWelcome}
        />

        {/* Contenido */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {isInRootPanel && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "70vh",
                gap: 4,
              }}
            >
              {cardModules.map((mod) => (
                <Card
                  key={mod.title}
                  sx={{
                    width: 340,
                    height: 250,
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                    backgroundColor: "#ffffffff",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 6px 20px rgba(25, 118, 210, 0.5)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => navigate(mod.route)}>
                    <CardContent sx={{ textAlign: "center", py: 6 }}>
                      <Box mb={2}>{mod.icon}</Box>
                      <Typography variant="h6" gutterBottom>
                        {mod.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {mod.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          )}

          {!isInRootPanel && <Outlet />}
        </Box>
      </Box>

      {/* Footer global */}
      <FooterGlobal />
    </Box>
  );
}
