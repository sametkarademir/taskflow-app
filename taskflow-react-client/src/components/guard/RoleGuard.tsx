import { Navigate } from "react-router-dom";

import { useUser } from "../../contexts/userContext";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: string;
}

export const RoleGuard = ({ children, requiredRole }: RoleGuardProps) => {
  const { hasRole, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-20 animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-[#6366f1] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
