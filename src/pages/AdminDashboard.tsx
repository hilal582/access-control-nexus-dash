
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserRoleTable from "@/components/UserRoleTable";
import UserPermissionPanel from "@/components/UserPermissionPanel";
import CreateUserDialog from "@/components/CreateUserDialog";
import DashboardHeader from "@/components/DashboardHeader";
import { Users, Shield, Eye, Settings } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { users, permissions, loading } = useUsers();

  const stats = [
    { 
      title: "Total Users", 
      value: users.length.toString(), 
      icon: Users, 
      color: "text-blue-600" 
    },
    { 
      title: "Active Permissions", 
      value: permissions.length.toString(), 
      icon: Shield, 
      color: "text-green-600" 
    },
    { 
      title: "Pages Managed", 
      value: "10", 
      icon: Eye, 
      color: "text-purple-600" 
    },
    { 
      title: "Recent Changes", 
      value: "0", 
      icon: Settings, 
      color: "text-orange-600" 
    },
  ];

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsPanelOpen(true);
  };

  const handleBulkPermissions = () => {
    toast.info("Bulk permissions feature coming soon!");
  };

  const handleViewAuditLog = () => {
    toast.info("Audit log feature coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleBulkPermissions}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Bulk Permissions
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleViewAuditLog}
                >
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
                {users.slice(0, 3).map((user, index) => (
                  <div key={user.id} className="text-sm">
                    <p className="font-medium">
                      {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User'}
                    </p>
                    <p className="text-gray-600">User registered</p>
                    <p className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
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
