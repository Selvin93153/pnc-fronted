import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LoginPage from "../login/LoginPage";
import WelcomePage from "../components/WelcomePage";
import AppContent from "../components/AppContent";
import PrivateRoute from "./PrivateRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

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
import DevolucionPropios from "../devolucion_propios/devolucionTable";
import VehiculosTable from "../vehiculos/VehiculosTable";
import ControlVehiculo from "../vehiculos/ControlVehiculo";
import MantenimientoTabla from "../mantenimiento/MantenimientoTabla";

export default function AppRoutes() {
  const [welcomeKey, setWelcomeKey] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  const forceReloadWelcome = () => setWelcomeKey(prev => prev + 1);

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage onLoginSuccess={() => {}} />} />
      <Route path="/reset-password" element={<LoginPage onLoginSuccess={() => {}} />} />

      {/* WelcomePage */}
      <Route
        path="/welcome"
        element={
          <PrivateRoute>
            <WelcomePage key={welcomeKey} />
          </PrivateRoute>
        }
      />

      {/* Panel general */}
      <Route
        path="/panel/*"
        element={
          <PrivateRoute>
            <AppContent onLogout={handleLogout} forceReloadWelcome={forceReloadWelcome} />
          </PrivateRoute>
        }
      >
        {/* Roles (solo jefe) */}
        <Route
          path="roles"
          element={
            <RoleProtectedRoute allowedRoles={["jefe"]}>
              <RolesTable />
            </RoleProtectedRoute>
          }
        />

        {/* Tipos de Equipos (jefe y armero) */}
        <Route
          path="tipos"
          element={
            <RoleProtectedRoute allowedRoles={["jefe","armero"]}>
              <TiposTable />
            </RoleProtectedRoute>
          }
        />

        {/* Usuarios (solo jefe) */}
        <Route
          path="usuarios"
          element={
            <RoleProtectedRoute allowedRoles={["jefe"]}>
              <UsuariosTable />
            </RoleProtectedRoute>
          }
        />

        {/* Reportes (todos los roles) */}
        <Route
          path="reportes"
          element={
            <RoleProtectedRoute allowedRoles={["jefe","armero","agente operativo"]}>
              <ReportesTable />
            </RoleProtectedRoute>
          }
        />

        {/* Vehiculos (todos los roles) */}
        <Route
          path="vehiculos"
          element={
            <RoleProtectedRoute allowedRoles={["jefe","armero","agente operativo"]}>
              <VehiculosTable />
            </RoleProtectedRoute>
          }
        />

        {/* Mantenimiento (todos los roles) */}
        <Route
          path="mantenimiento"
          element={
            <RoleProtectedRoute allowedRoles={["jefe","armero","agente operativo"]}>
              <MantenimientoTabla/>
            </RoleProtectedRoute>
          }
        />

        {/* Equipos Asignados (solo armero) */}
        <Route
          path="asignados"
          element={
            <RoleProtectedRoute allowedRoles={["armero"]}>
              <AsignadosTable />
            </RoleProtectedRoute>
          }
        />

        {/* Equipos a Prestamo (solo armero) */}
        <Route
          path="prestamos"
          element={
            <RoleProtectedRoute allowedRoles={["armero"]}>
              <PrestamosTable />
            </RoleProtectedRoute>
          }
        />

        {/* Movimientos de Equipos (solo armero) */}
        <Route
          path="movimientos"
          element={
            <RoleProtectedRoute allowedRoles={["armero"]}>
              <MovimientosTable />
            </RoleProtectedRoute>
          }
        />

        {/* Devolución de Equipos Prestados (solo armero) */}
        <Route
          path="devolucion"
          element={
            <RoleProtectedRoute allowedRoles={["armero"]}>
              <DevolucionTable />
            </RoleProtectedRoute>
          }
        />

        {/* Equipos Cargados (todos los roles) */}
        <Route
          path="equiposcargados"
          element={
            <RoleProtectedRoute allowedRoles={["jefe","armero","agente operativo"]}>
              <AsignadosPropio />
            </RoleProtectedRoute>
          }
        />

        {/* Devoluciones de Equipos Propios (solo armero) */}
        <Route
          path="equipospropios"
          element={
            <RoleProtectedRoute allowedRoles={["armero"]}>
              <DevolucionPropios />
            </RoleProtectedRoute>
          }
        />

        {/* Perfil */}
        <Route path="perfil" element={<UserProfile onLogout={handleLogout} />} />

        {/* Control Vehiculo */}
        <Route path="vehiculos/control/:id" element={<ControlVehiculo />} />

      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
