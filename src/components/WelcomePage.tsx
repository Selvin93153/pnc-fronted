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

  const [stats] = useState({
    usuariosActivos: 12,
    reportesRecientes: 5,
    equiposEnUso: 8,
    movimientosHoy: 3,
  });

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
      {/* 🔹 Fondo */}
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
      {/* 🔹 Capa oscura */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.30)",
          zIndex: 1,
        }}
      />

      {/* 🔹 Encabezado superior */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 4,
          backgroundColor: "#0b1a2f",
          backdropFilter: "blur(6px)",
          px: 4,
          py: 1.5, // Padding vertical reducido para acercar el texto al botón
          display: "flex",
          alignItems: "flex-start", // Alinea al inicio del header
          justifyContent: "space-between",
          boxShadow: "0px 4px 10px rgba(6, 22, 41, 0.82)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Botón menú */}
          <Button onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: "#ffffff" }} />
          </Button>

          {/* Texto de bienvenida pegado al botón */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#ffffffff",
              WebkitTextStroke: "1px #0b1a2f",
            }}
          >
            ¡Bienvenido al Sistema de Control!
          </Typography>
        </Stack>

        {/* Opciones seleccionables */}
        <Stack direction="row" spacing={4}>
          {["Perfil", "Soporte", "Misión", "Historia"].map((item) => (
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
        </Stack>
      </Box>

      {/* 🔹 Logo debajo del encabezado */}
      <Box
        sx={{
          position: "absolute",
          top: 75,
          right: 30,
          zIndex: 3,
        }}
      >
        <img
          src="/public/logo.png"
          alt="Logo PNC"
          style={{ width: "130px", height: "auto" }}
        />
      </Box>

      {/* 🔹 Contenido principal */}
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

          {/* Dashboard inferior con estadísticas */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#4870e9ff",
                minWidth: 200,
                textAlign: "center",
              }}
            >
              <PeopleIcon sx={{ fontSize: 40, color: "#f9fafbff" }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {stats.usuariosActivos}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#0b0b0bff" }}>
                Usuarios activos
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#f88214ff",
                minWidth: 200,
                textAlign: "center",
              }}
            >
              <SummarizeIcon sx={{ fontSize: 40, color: "#060606ff" }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {stats.reportesRecientes}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#0a0a0aff" }}>
                Reportes recientes
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#0fe8ddff",
                minWidth: 200,
                textAlign: "center",
              }}
            >
              <BuildIcon sx={{ fontSize: 40, color: "#0901ebff" }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {stats.equiposEnUso}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#0b0b0bff" }}>
                Equipos en uso
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#83f123ff",
                minWidth: 200,
                textAlign: "center",
              }}
            >
              <DirectionsCarIcon sx={{ fontSize: 40, color: "#ee0f0fff" }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {stats.movimientosHoy}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#040404ff" }}>
                Movimientos hoy
              </Typography>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
