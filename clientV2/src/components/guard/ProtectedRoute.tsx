// utils/ProtectedRoute.tsx
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate } from "react-router-dom";
import roleRoutes from "@/utils/roleRoute";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children?: React.ReactNode;
  allowedRoles: string[];
}) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={roleRoutes[user.role] ?? "/"} replace />;
  }

  return <>{children}</>;
}
