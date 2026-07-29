import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";
import { ROLES } from "@/lib/constants";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);

  if (user?.role.name !== ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
