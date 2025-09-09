// src/routes/PrivateRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode; // ✅ Permite uno o varios elementos
}

export default function PrivateRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}
