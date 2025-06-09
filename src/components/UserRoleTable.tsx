
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Crown } from "lucide-react";
import { useUsers, useMakeSuperAdmin } from "@/hooks/useUsers";

interface UserRoleTableProps {
  onEditUser: (user: any) => void;
}

const UserRoleTable = ({ onEditUser }: UserRoleTableProps) => {
  const { data: users = [], isLoading } = useUsers();
  const makeSuperAdminMutation = useMakeSuperAdmin();

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

  const handleMakeSuperAdmin = async (userId: string) => {
    if (window.confirm("Are you sure you want to make this user a super admin?")) {
      await makeSuperAdminMutation.mutateAsync(userId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading users...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">User</TableHead>
            <TableHead className="w-32">Role</TableHead>
            {pages.map((page) => (
              <TableHead key={page.key} className="text-center min-w-24">
                {page.name}
              </TableHead>
            ))}
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell>
                <div>
                  <p className="font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={user.is_super_admin ? "default" : "secondary"}
                  className={user.is_super_admin ? "bg-purple-100 text-purple-800" : ""}
                >
                  {user.is_super_admin ? "Super Admin" : "User"}
                </Badge>
              </TableCell>
              {pages.map((page) => (
                <TableCell key={page.key} className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {user.is_super_admin ? "All" : "Custom"}
                  </Badge>
                </TableCell>
              ))}
              <TableCell>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEditUser(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!user.is_super_admin && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMakeSuperAdmin(user.id)}
                      disabled={makeSuperAdminMutation.isPending}
                    >
                      <Crown className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserRoleTable;
