
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Shield, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Super Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive user access control system with role-based permissions,
            comment management, and detailed modification history tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Create users, assign permissions, and manage access levels across all pages
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Fine-grained permission system with View, Edit, Create, and Delete access
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Manage comments across pages with complete modification history
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center space-x-4">
          <Button 
            onClick={() => navigate('/login')} 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Login as Admin
          </Button>
          <Button 
            onClick={() => navigate('/admin')} 
            variant="outline" 
            size="lg"
          >
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
