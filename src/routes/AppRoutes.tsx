import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LoginPage from "../login/LoginPage";
import WelcomePage from "../components/WelcomePage";
import AppContent from "../components/AppContent";
import PrivateRoute from "./PrivateRoute";

import RolesTable from "../roles/RolesTable";
import TiposTable from "../tipos_equipos/TiposTable";
import UsuariosTable from "../usuarios/UsuariosTable";
import ReportesTable from "../reportes/ReportesTable";
import AsignadosTable from "../asignados/AsignadosTable";
import PrestamosTable from "../prestamos/prestamostable";
import MovimientosTable from "../movimientos/movimientosTable";
import AsignadosPropio from "../asignadospropio/AsignadosPropio";
import DevolucionTable from "../devolucion_equipos/devolucionTable";
import UserProfile from "../perfil/UserProfile";
import { Box } from "@mui/material";

export default function AppRoutes() {
  const [welcomeKey, setWelcomeKey] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  const forceReloadWelcome = () => setWelcomeKey(prev => prev + 1); // 🔹 CAMBIO: remount WelcomePage

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage onLoginSuccess={() => {}} />} />

      {/* 🔹 WelcomePage fuera del layout */}
      <Route
        path="/welcome"
        element={
          <PrivateRoute>
            <WelcomePage key={welcomeKey} />
          </PrivateRoute>
        }
      />

      {/* 🔹 Panel general con layout */}
      <Route
        path="/panel/*"
        element={
          <PrivateRoute>
            <AppContent onLogout={handleLogout} forceReloadWelcome={forceReloadWelcome} />
          </PrivateRoute>
        }
      >
        {/* Rutas internas del panel */}
        <Route path="roles" element={<RolesTable />} />
        <Route path="tipos" element={<TiposTable />} />
        <Route path="usuarios" element={<UsuariosTable />} />
        <Route path="reportes" element={<ReportesTable />} />
        <Route path="vehiculos" element={<Box>Vista Vehículos</Box>} />
        <Route path="mantenimiento" element={<Box>Vista Mantenimiento</Box>} />
        <Route path="asignados" element={<AsignadosTable />} />
        <Route path="prestamos" element={<PrestamosTable />} />
        <Route path="movimientos" element={<MovimientosTable />} />
          <Route path="devolucion" element={<DevolucionTable />} />
        <Route path="equiposcargados" element={<AsignadosPropio />} />
        <Route path="perfil" element={<UserProfile onLogout={handleLogout} />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
