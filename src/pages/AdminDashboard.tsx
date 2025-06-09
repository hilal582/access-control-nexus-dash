
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserRoleTable from "@/components/UserRoleTable";
import UserPermissionPanel from "@/components/UserPermissionPanel";
import CreateUserDialog from "@/components/CreateUserDialog";
import DashboardHeader from "@/components/DashboardHeader";
import { Users, Shield, Eye, Settings } from "lucide-react";

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data for demonstration
  const stats = [
    { title: "Total Users", value: "24", icon: Users, color: "text-blue-600" },
    { title: "Active Permissions", value: "156", icon: Shield, color: "text-green-600" },
    { title: "Pages Managed", value: "10", icon: Eye, color: "text-purple-600" },
    { title: "Recent Changes", value: "8", icon: Settings, color: "text-orange-600" },
  ];

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* User Role Table */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Role Management</CardTitle>
                  <CardDescription>
                    Manage user permissions across all pages. Click edit to modify access levels.
                  </CardDescription>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Add New User
                </Button>
              </CardHeader>
              <CardContent>
                <UserRoleTable onEditUser={handleEditUser} />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Create User
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Bulk Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Audit Log
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">John Doe</p>
                  <p className="text-gray-600">Updated permissions</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-gray-600">Created new comment</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Mike Johnson</p>
                  <p className="text-gray-600">Login successful</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Permission Panel */}
      <UserPermissionPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        user={selectedUser}
      />

      {/* Create User Dialog */}
      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
