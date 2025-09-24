import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleProtectedRoute({ children, allowedRoles }: Props) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const rol = usuario?.rol || "";

  // Redirige si el rol no está permitido
  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}
