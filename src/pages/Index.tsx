
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile && !loading) {
      if (profile.is_super_admin) {
        navigate("/admin");
      } else {
        navigate("/pages/products-list");
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Super Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          A comprehensive user management system with role-based permissions and page-level access control.
        </p>
        <div className="space-y-4">
          <div>
            <Link to="/login">
              <Button size="lg" className="w-48">
                Get Started
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Create an account or sign in to access the dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
