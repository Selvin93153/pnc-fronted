import { AppBar, Toolbar, Typography, Box, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../public/logo.png"; // ajusta la ruta si es distinta

interface HeaderGlobalProps {
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export default function HeaderGlobal({ onMenuClick, onLogout }: HeaderGlobalProps) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0b60d8ff", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 90, py: 2 }}>
        {/* Sección izquierda: solo menú + título */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onMenuClick} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            PANEL DE ADMINISTRACION
          </Typography>
        </Box>

        {/* Sección derecha: botones + logo + cerrar sesión */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Botones de navegación alineados a la derecha */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {["INICIO", "PANEL GENERAL", "MIS ARMAS", "MI PERFIL"].map((label) => (
              <Button
                key={label}
                color="inherit"
                sx={{
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "#fffb00ff", // color al pasar el mouse
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Logo */}
          <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />

          {/* Botón cerrar sesión */}
          <Button
            onClick={onLogout}
            sx={{
              color: "white",
              border: "1px solid white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.3)", // rojo translúcido al pasar el mouse
                color: "white",
              },
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
