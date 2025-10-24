import { AppBar, Toolbar, Typography, Box, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderGlobalProps {
  onMenuClick?: () => void;
}

export default function HeaderGlobal({ onMenuClick }: HeaderGlobalProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Definimos los botones del header y sus rutas correspondientes
  const navItems = [
    { label: "INICIO", path: "/welcome" },
    { label: "PANEL GENERAL", path: "/panel" },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #0b60d8 0%, #003b8a 100%)",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.25)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 90, py: 2 }}>
        {/* Sección izquierda: menú + título */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onMenuClick} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "white",
              letterSpacing: "1px",
              userSelect: "none",
            }}
          >
            PANEL DE ADMINISTRACIÓN
          </Typography>
        </Box>

        {/* Sección derecha: botones + logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Botones de navegación */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {navItems.map(({ label, path }) => {
              // Corrección: "PANEL GENERAL" solo se activa si la ruta es exactamente "/panel"
              const isActive =
                path === "/panel"
                  ? location.pathname === "/panel"
                  : location.pathname.startsWith(path);

              return (
                <Button
                  key={label}
                  onClick={() => navigate(path)}
                  sx={{
                    textTransform: "none",
                    color: isActive ? "#fffb00ff" : "white",
                    borderBottom: isActive
                      ? "2px solid #fffb00ff"
                      : "2px solid transparent",
                    borderRadius: 0,
                    transition: "all 0.2s ease",
                    fontWeight: isActive ? "bold" : "normal",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#fffb00ff",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          {/* Logo limpio y sin fondo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: 55,
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
