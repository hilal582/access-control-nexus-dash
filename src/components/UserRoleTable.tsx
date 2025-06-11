import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { useUsers, type User } from "@/hooks/useUsers";

interface UserRoleTableProps {
  onEditUser: (user: any) => void;
}

const UserRoleTable = ({ onEditUser }: UserRoleTableProps) => {
  const { users, loading, getUserPermissions } = useUsers();

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

  const getPermissionBadge = (permissions: string[]) => {
    if (permissions.length === 0) return <Badge variant="secondary" className="bg-gray-100 text-gray-600">None</Badge>;
    
    const highestPermission = permissions.includes('delete') ? 'delete' :
                             permissions.includes('create') ? 'create' :
                             permissions.includes('edit') ? 'edit' : 'view';
    
    const colors = {
      view: "bg-blue-100 text-blue-800",
      edit: "bg-yellow-100 text-yellow-800", 
      create: "bg-green-100 text-green-800",
      delete: "bg-red-100 text-red-800"
    };

    return (
      <Badge variant="secondary" className={colors[highestPermission as keyof typeof colors]}>
        {highestPermission.charAt(0).toUpperCase() + highestPermission.slice(1)}
      </Badge>
    );
  };

  const handleEditUser = (user: User) => {
    const userPermissions = getUserPermissions(user.id);
    
    onEditUser({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
      email: user.email,
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
          {users.map((user) => {
            const userPermissions = getUserPermissions(user.id);
            
            return (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.is_super_admin && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 mt-1">
                        Super Admin
                      </Badge>
                    )}
                  </div>
                </TableCell>
                {pages.map((page) => {
                  const permissions = userPermissions[page.key] || [];
                  return (
                    <TableCell key={page.key} className="text-center">
                      {getPermissionBadge(permissions)}
                    </TableCell>
                  );
                })}
                <TableCell>
                  {!user.is_super_admin && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserRoleTable;