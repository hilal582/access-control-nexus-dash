import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";

interface UserPermissionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const UserPermissionPanel = ({ isOpen, onClose, user }: UserPermissionPanelProps) => {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const { updateUserPermissions } = useUsers();

  const pages = [
    { key: "products-list", name: "Products List" },
    { key: "marketing-list", name: "Marketing List" },
    { key: "order-list", name: "Order List" },
    { key: "media-plans", name: "Media Plans" },
    { key: "offer-pricing", name: "Offer Pricing SKUs" },
    { key: "clients", name: "Clients" },
    { key: "suppliers", name: "Suppliers" },
    { key: "customer-support", name: "Customer Support" },
    { key: "sales-reports", name: "Sales Reports" },
    { key: "finance", name: "Finance & Accounting" }
  ];

  const permissionLevels = ["view", "edit", "create", "delete"];

  useEffect(() => {
    if (user?.permissions) {
      setPermissions(user.permissions);
    }
  }, [user]);

  const handlePermissionChange = (pageKey: string, permission: string, checked: boolean) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      if (!newPermissions[pageKey]) {
        newPermissions[pageKey] = [];
      }
      
      if (checked) {
        if (!newPermissions[pageKey].includes(permission)) {
          newPermissions[pageKey] = [...newPermissions[pageKey], permission];
        }
      } else {
        newPermissions[pageKey] = newPermissions[pageKey].filter(p => p !== permission);
        if (newPermissions[pageKey].length === 0) {
          delete newPermissions[pageKey];
        }
      }
      
      return newPermissions;
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const result = await updateUserPermissions(user.id, permissions);
    
    if (result.success) {
      onClose();
    }
    
    setLoading(false);
  };

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit User Permissions</SheetTitle>
          <SheetDescription>
            Modify access levels for {user.name} across all pages
          </SheetDescription>
        </SheetHeader>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  Regular User
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Page Permissions</h3>
          {pages.map((page) => (
            <Card key={page.key}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{page.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {permissionLevels.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${page.key}-${permission}`}
                        checked={permissions[page.key]?.includes(permission) || false}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(page.key, permission, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`${page.key}-${permission}`}
                        className="text-sm font-medium capitalize"
                      >
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-8">
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserPermissionPanel;