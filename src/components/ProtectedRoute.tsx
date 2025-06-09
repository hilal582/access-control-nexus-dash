
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireSuperAdmin = false }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }

      if (requireSuperAdmin && !profile?.is_super_admin) {
        navigate("/pages/products-list");
        return;
      }
    }
  }, [user, profile, loading, navigate, requireSuperAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireSuperAdmin && !profile?.is_super_admin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
