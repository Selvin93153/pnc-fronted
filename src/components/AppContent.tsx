// src/components/AppContent.tsx
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import RolesTable from "../roles/RolesTable";
import TiposTable from "../tipos_equipos/TiposTable";
import UsuariosTable from "../usuarios/UsuariosTable";
import ReportesTable from "../reportes/ReportesTable";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DevicesIcon from "@mui/icons-material/Devices";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { useState } from "react";
import AsignadosTable from "../asignados/AsignadosTable";
import PrestamosTable from "../prestamos/prestamostable";
import MovimientosTable from "../movimientos/movimientosTable";
import AsignadosPropio from "../asignadospropio/AsignadosPropio";
import UserProfile from "../perfil/UserProfile";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import Inventory2Icon from "@mui/icons-material/Inventory2";

// 🔹 Ítems del Panel (Tarjetas)
const cardModules = [
  {
    title: "Roles",
    description: "Gestiona los roles del sistema",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    index: 0,
  },
  {
    title: "Tipos de Equipos",
    description: "Administra los tipos de equipos registrados",
    icon: <DevicesIcon sx={{ fontSize: 40, color: "#2e7d32" }} />,
    index: 1,
  },
  {
    title: "Usuarios",
    description: "Control de cuentas de usuarios",
    icon: <PeopleIcon sx={{ fontSize: 40, color: "#9c27b0" }} />,
    index: 2,
  },
  {
    title: "Reportes",
    description: "Visualización de reportes del sistema",
    icon: <SummarizeIcon sx={{ fontSize: 40, color: "#ff9800" }} />,
    index: 3,
  },
  {
    title: "Vehiculos",
    description: "Control de vehiculos",
    icon: <DirectionsCarIcon sx={{ fontSize: 40, color: "#0288d1" }} />,
    index: 4,
  },
  {
    title: "Mantenimiento",
    description: "Control de vehiculos",
    icon: <BuildIcon sx={{ fontSize: 40, color: "#f44336" }} />,
    index: 5,
  },
  {
    title: "Equipos Asignados",
    description: "Gestión de armas, chalecos y radios",
    icon: <ChecklistIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
    index: 6,
  },
  {
    title: "Equipos a Prestamo",
    description: "Total de armas, chalecos y radios disponibles",
    icon: <WorkOutlineIcon sx={{ fontSize: 40, color: "#6a1b9a" }} />,
    index: 7,
  },
  {
    title: "Movimientos de Equipos",
    description: "Registro de Ingreso y egreso de equipos",
    icon: <CompareArrowsIcon sx={{ fontSize: 40, color: "#00796b" }} />,
    index: 8,
  },
  {
    title: "Equipos Cargados",
    description: "Listo de equipos Adjudicados",
    icon: <Inventory2Icon sx={{ fontSize: 40, color: "#795548" }} />,
    index: 9,
  },
  {
    title: "Perfil",
    description: "Datos personales",
    icon: <AccountCircleIcon sx={{ fontSize: 40, color: "#0097a7" }} />,
    index: 10,
  },
];

// 🔹 Ítems de la Barra Lateral
const sidebarModules = [
    { title: "Perfil", icon: <AccountCircleIcon />, index: 10 },
  { title: "Roles", icon: <AdminPanelSettingsIcon />, index: 0 },
  { title: "Usuarios", icon: <PeopleIcon />, index: 2 },
  { title: "Reportes", icon: <SummarizeIcon />, index: 3 },
  { title: "Movimientos de Equipos", icon: <DirectionsCarIcon />, index: 8 },
  { title: "Equipos Cargados", icon: <BuildIcon />, index: 9 },

];

interface Props {
  onLogout: () => void;
}

export default function AppContent({ onLogout }: Props) {
  const [tabIndex, setTabIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleModuleClick = (index: number) => {
    setTabIndex(index);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Drawer lateral */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#fefbfbff",
            color: "#0c0c0cff",
          },
        }}
      >
        <List>
          {sidebarModules.map((mod) => (
            <ListItemButton
              key={mod.title}
              onClick={() => handleModuleClick(mod.index)}
              sx={{
                "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
              }}
            >
              <ListItemIcon sx={{ color: "#1976d2" }}>{mod.icon}</ListItemIcon>
              <ListItemText primary={mod.title} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" color="primary">
              Panel de Administración
            </Typography>
          </Stack>
          <Button variant="outlined" color="secondary" onClick={onLogout}>
            Cerrar sesión
          </Button>
        </Stack>

        {/* Tarjetas iniciales */}
        {tabIndex === null && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 4,
            }}
          >
            {cardModules.map((mod) => (
              <Card
                key={mod.title}
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  backgroundColor: "#fff",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 6px 20px rgba(25, 118, 210, 0.5)",
                  },
                }}
              >
                <CardActionArea onClick={() => handleModuleClick(mod.index)}>
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

        {/* Vistas dinámicas */}
        {tabIndex === 0 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Lista de Roles
            </Typography>
            <RolesTable />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Lista de Tipos de Equipos
            </Typography>
            <TiposTable />
          </Box>
        )}

        {tabIndex === 2 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Lista de Usuarios
            </Typography>
            <UsuariosTable />
          </Box>
        )}

        {tabIndex === 3 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Lista de Reportes
            </Typography>
            <ReportesTable />
          </Box>
        )}

        {tabIndex === 6 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Lista de Equipos Asignados
            </Typography>
            <AsignadosTable />
          </Box>
        )}

        {tabIndex === 7 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Lista de Equipos a Prestamo
            </Typography>
            <PrestamosTable />
          </Box>
        )}

        {tabIndex === 8 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Movimientos de Equipos
            </Typography>
            <MovimientosTable />
          </Box>
        )}

        {tabIndex === 9 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Lista de Adjudicaciones
            </Typography>
            <AsignadosPropio />
          </Box>
        )}

        {tabIndex === 10 && (
          <Box mt={4}>
            <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
            <Typography variant="h5" gutterBottom>
              Perfil
            </Typography>
            <UserProfile onLogout={onLogout} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
