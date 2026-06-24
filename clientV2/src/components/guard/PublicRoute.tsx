// utils/PublicRoute.tsx — redirects logged-in users away from "/"
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import roleRoute from "@/utils/roleRoute";

export default function PublicRoute({
  children,
}: {
  children?: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);

  if (user) return <Navigate to={roleRoute[user.role]} replace />;

  return <>{children}</>;
}
