import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Collapse,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Sidebar from "./Sidebar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import logo from "../../public/logo.png"; // Logo PNC

const sidebarItems = [
  { title: "Inicio", icon: <EmojiEventsIcon />, route: "/welcome" },
  { title: "Perfil", icon: <AdminPanelSettingsIcon />, route: "/panel/perfil" },
  { title: "Panel General", icon: <MenuIcon />, route: "/panel" },
  { title: "Reportes", icon: <SummarizeIcon />, route: "/panel/reportes" },
  { title: "Mis Equipos", icon: <BuildIcon />, route: "/panel/equiposcargados" },
];

export default function WelcomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [usuarioNombre, setUsuarioNombre] = useState("Usuario");
  const navigate = useNavigate();

  const [stats] = useState({
    usuariosActivos: 12,
    reportesRecientes: 5,
    equiposEnUso: 8,
    movimientosHoy: 3,
  });

  useEffect(() => {
    // Tomamos el usuario del localStorage y usamos solo primer nombre y primer apellido
    const storedUser = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (storedUser.nombres && storedUser.apellidos) {
      const primerNombre = storedUser.nombres.split(" ")[0];
      const primerApellido = storedUser.apellidos.split(" ")[0];
      setUsuarioNombre(`${primerNombre} ${primerApellido}`);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: 'url("/fondoPNC3.webp")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: 0,
        }}
      />
      {/* Capa oscura */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.30)",
          zIndex: 1,
        }}
      />

      {/* Encabezado superior */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 4,
          backgroundColor: "#0b60d8ff",
          backdropFilter: "blur(6px)",
          px: 4,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 4px 10px rgba(6, 22, 41, 0.82)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: "#ffffff" }} />
          </Button>

          {/* Bienvenida con misma fuente y estilo que los links */}
          <Typography
            variant="h6"
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              cursor: "default",
            }}
          >
            Bienvenido {usuarioNombre}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          {["Perfil", "Misión"].map((item) => (
            <Typography
              key={item}
              variant="h6"
              sx={{
                color: "#ffffff",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  color: "#ffff00",
                  textShadow: "0 0 8px #ffff00",
                },
              }}
              onClick={() => {
                if (item === "Perfil") navigate("/panel/perfil");
              }}
            >
              {item}
            </Typography>
          ))}

          {/* Logo PNC al lado de Historia */}
          <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="Logo PNC"
              style={{ width: 50, height: "auto", objectFit: "contain" }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ position: "relative", zIndex: 2, display: "flex", flexGrow: 1, mt: 30 }}>
        <Sidebar
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onLogout={() => navigate("/login")}
          items={sidebarItems}
          forceReloadWelcome={() => {}}
        />

        <Box sx={{ flexGrow: 1, p: 5 }}>
          {/* Mensaje central */}
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h4"
              sx={{
                color: "#ffffff",
                WebkitTextStroke: "0.6px #000000",
              }}
            >
              Gestiona de forma segura armas, vehículos, equipos y mucho más de la sede policial.
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
                backgroundColor: "#ffffffff",
                color: "#0d1b2a",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.5)",
                transition: "all 0.3s ease",
                "&:hover": { backgroundColor: "#5d93eaff" },
              }}
            >
              Entrar al Panel General
            </Button>
          </Box>

          {/* Botón para mostrar/ocultar estadísticas */}
          <Box textAlign="center" mb={2}>
            <Button
              variant="outlined"
              onClick={() => setShowDashboard((prev) => !prev)}
              sx={{
                color: "#ffffff",
                borderColor: "#ffffff",
                fontWeight: "bold",
                letterSpacing: "0.5px",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
              startIcon={showDashboard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {showDashboard ? "Ocultar estadísticas" : "Mostrar estadísticas"}
            </Button>
          </Box>

          {/* Dashboard */}
          <Collapse in={showDashboard}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
            >
              {[
                {
                  label: "Usuarios activos",
                  value: stats.usuariosActivos,
                  icon: <PeopleIcon />,
                  color: "#2196f3",
                },
                {
                  label: "Reportes recientes",
                  value: stats.reportesRecientes,
                  icon: <SummarizeIcon />,
                  color: "#ff9800",
                },
                {
                  label: "Equipos en uso",
                  value: stats.equiposEnUso,
                  icon: <BuildIcon />,
                  color: "#00bcd4",
                },
                {
                  label: "Movimientos hoy",
                  value: stats.movimientosHoy,
                  icon: <DirectionsCarIcon />,
                  color: "#8bc34a",
                },
              ].map((item, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    minWidth: 220,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 12px 25px rgba(0,0,0,0.5)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: item.color,
                      width: 60,
                      height: 60,
                      margin: "0 auto",
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {item.value}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    {item.label}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
}
