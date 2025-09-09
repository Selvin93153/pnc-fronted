import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Button } from "@mui/material";
import type { JSX } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  forceReloadWelcome: () => void; // 🔹 NUEVO
}

export default function Sidebar({ open, onClose, onLogout, items, forceReloadWelcome }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (route: string) => {
    if (route === "/welcome" && location.pathname === "/welcome") {
      // 🔹 Si ya estamos en WelcomePage, recargamos solo el componente
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
          width: 250,
          backgroundColor: "#fefbfbff",
          color: "#0c0c0cff",
        },
      }}
    >
      <List>
        {items.map((mod) => (
          <ListItemButton
            key={mod.title}
            onClick={() => handleNavigate(mod.route)}
            sx={{ "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" } }}
          >
            <ListItemIcon sx={{ color: "#1976d2" }}>{mod.icon}</ListItemIcon>
            <ListItemText primary={mod.title} />
          </ListItemButton>
        ))}

        <Button
          variant="outlined"
          color="secondary"
          sx={{ m: 2 }}
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </List>
    </Drawer>
  );
}
