
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

const UserRoleTable = ({ onEditUser }) => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      permissions: {
        "products-list": "Edit",
        "marketing-list": "View",
        "order-list": "Create",
        "media-plans": "Delete",
        "offer-pricing": "View",
        "clients": "Edit",
        "suppliers": "View",
        "customer-support": "Create",
        "sales-reports": "View",
        "finance": "View"
      }
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      permissions: {
        "products-list": "View",
        "marketing-list": "Edit",
        "order-list": "View",
        "media-plans": "Create",
        "offer-pricing": "Edit",
        "clients": "View",
        "suppliers": "Create",
        "customer-support": "Delete",
        "sales-reports": "Edit",
        "finance": "View"
      }
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      permissions: {
        "products-list": "Create",
        "marketing-list": "View",
        "order-list": "Edit",
        "media-plans": "View",
        "offer-pricing": "Create",
        "clients": "Delete",
        "suppliers": "Edit",
        "customer-support": "View",
        "sales-reports": "Create",
        "finance": "Edit"
      }
    }
  ];

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

  const getPermissionColor = (permission) => {
    switch (permission) {
      case "View": return "bg-blue-100 text-blue-800";
      case "Edit": return "bg-yellow-100 text-yellow-800";
      case "Create": return "bg-green-100 text-green-800";
      case "Delete": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </TableCell>
              {pages.map((page) => (
                <TableCell key={page.key} className="text-center">
                  <Badge 
                    variant="secondary" 
                    className={getPermissionColor(user.permissions[page.key])}
                  >
                    {user.permissions[page.key]}
                  </Badge>
                </TableCell>
              ))}
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEditUser(user)}
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
