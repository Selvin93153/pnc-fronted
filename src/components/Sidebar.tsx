import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Button, Divider, Typography, Box } from "@mui/material";
import type { JSX } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

interface SidebarItem {
  title: string;
  icon: JSX.Element;
  route: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  items: SidebarItem[];
  forceReloadWelcome: () => void;
}

export default function Sidebar({ open, onClose, onLogout, items, forceReloadWelcome }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (route: string) => {
    if (route === "/welcome" && location.pathname === "/welcome") {
      forceReloadWelcome();
    } else {
      navigate(route);
    }
    onClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout();
    navigate("/login", { replace: true });
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 260,
          background: "linear-gradient(90deg, #0b60d8 0%, #003b8a 100%)", // 🔹 gradiente igual al header
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      {/* Logo o título de la app */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          ARMERIA VIRTUAL
        </Typography>
      </Box>

      <List>
        {items.map((mod) => {
          const isActive = location.pathname === mod.route;
          return (
            <ListItemButton
              key={mod.title}
              onClick={() => handleNavigate(mod.route)}
              sx={{
                mb: 1,
                borderRadius: 2,
                mx: 2,
                transition: "0.3s",
                backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" }
              }}
            >
              <ListItemIcon sx={{ color: isActive ? "#4fc3f7" : "rgba(255,255,255,0.7)" }}>
                {mod.icon}
              </ListItemIcon>
              <ListItemText primary={mod.title} sx={{ color: "#fff", fontWeight: isActive ? "bold" : "normal" }} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.3)" }} />

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          sx={{
            width: "100%",
            borderRadius: 2,
            backgroundColor: "#f44336",
            "&:hover": { backgroundColor: "#d32f2f" },
            textTransform: "none",
            fontWeight: "bold",
          }}
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  );
}
