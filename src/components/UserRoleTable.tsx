
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { useUsers, type User, type UserPermission } from "@/hooks/useUsers";

interface UserRoleTableProps {
  onEditUser: (user: any) => void;
}

const UserRoleTable = ({ onEditUser }: UserRoleTableProps) => {
  const { users, permissions, loading } = useUsers();

  const pages = [
    { key: "products-list", name: "Products" },
    { key: "marketing-list", name: "Marketing" },
    { key: "order-list", name: "Orders" },
    { key: "media-plans", name: "Media Plans" },
    { key: "offer-pricing", name: "Pricing" },
    { key: "clients", name: "Clients" },
    { key: "suppliers", name: "Suppliers" },
    { key: "customer-support", name: "Support" },
    { key: "sales-reports", name: "Sales" },
    { key: "finance", name: "Finance" }
  ];

  const getUserPermission = (userId: string, pageKey: string): string => {
    const userPermission = permissions.find(
      p => p.user_id === userId && p.page === pageKey
    );
    return userPermission ? userPermission.permission.charAt(0).toUpperCase() + userPermission.permission.slice(1) : "None";
  };

  const getPermissionColor = (permission: string) => {
    switch (permission.toLowerCase()) {
      case "view": return "bg-blue-100 text-blue-800";
      case "edit": return "bg-yellow-100 text-yellow-800";
      case "create": return "bg-green-100 text-green-800";
      case "delete": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditUser = (user: User) => {
    const userPermissions: Record<string, string> = {};
    pages.forEach(page => {
      userPermissions[page.key] = getUserPermission(user.id, page.key);
    });

    onEditUser({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
      email: `${user.first_name?.toLowerCase() || 'user'}@example.com`, // You might want to get actual email from auth.users
      permissions: userPermissions
    });
  };

  if (loading) {
    return <div className="text-center py-4">Loading users...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">User</TableHead>
            {pages.map((page) => (
              <TableHead key={page.key} className="text-center min-w-24">
                {page.name}
              </TableHead>
            ))}
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell>
                <div>
                  <p className="font-medium">
                    {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.is_super_admin ? 'Super Admin' : 'Regular User'}
                  </p>
                </div>
              </TableCell>
              {pages.map((page) => {
                const permission = getUserPermission(user.id, page.key);
                return (
                  <TableCell key={page.key} className="text-center">
                    <Badge 
                      variant="secondary" 
                      className={getPermissionColor(permission)}
                    >
                      {permission}
                    </Badge>
                  </TableCell>
                );
              })}
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserRoleTable;
