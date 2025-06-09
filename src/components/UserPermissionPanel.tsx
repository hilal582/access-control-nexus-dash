
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useUserPermissions, useUpdateUserPermissions, User } from "@/hooks/useUsers";

interface UserPermissionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserPermissionPanel = ({ isOpen, onClose, user }: UserPermissionPanelProps) => {
  const { data: userPermissions = [] } = useUserPermissions(user?.id || '');
  const updatePermissionsMutation = useUpdateUserPermissions();
  
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

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
    if (userPermissions.length > 0) {
      const permissionMap: Record<string, string[]> = {};
      
      userPermissions.forEach(perm => {
        if (!permissionMap[perm.page]) {
          permissionMap[perm.page] = [];
        }
        permissionMap[perm.page].push(perm.permission);
      });
      
      setPermissions(permissionMap);
    } else {
      setPermissions({});
    }
  }, [userPermissions]);

  const handlePermissionChange = (pageKey: string, permission: string, checked: boolean) => {
    setPermissions(prev => {
      const pagePermissions = prev[pageKey] || [];
      
      if (checked) {
        return {
          ...prev,
          [pageKey]: [...pagePermissions, permission]
        };
      } else {
        return {
          ...prev,
          [pageKey]: pagePermissions.filter(p => p !== permission)
        };
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;

    const permissionsList: { page: string; permission: string }[] = [];
    
    Object.entries(permissions).forEach(([page, perms]) => {
      perms.forEach(permission => {
        permissionsList.push({ page, permission });
      });
    });

    await updatePermissionsMutation.mutateAsync({
      userId: user.id,
      permissions: permissionsList,
    });
    
    onClose();
  };

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit User Permissions</SheetTitle>
          <SheetDescription>
            Modify access levels for {user.first_name} {user.last_name} across all pages
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
                <AvatarFallback>
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.first_name} {user.last_name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Badge variant={user.is_super_admin ? "default" : "secondary"} className="mt-1">
                  {user.is_super_admin ? "Super Admin" : "Regular User"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.is_super_admin ? (
          <div className="text-center py-8">
            <p className="text-lg font-medium">Super Admin</p>
            <p className="text-sm text-gray-500">
              Super admins have access to all pages and features automatically.
            </p>
          </div>
        ) : (
          <>
            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Page Permissions</h3>
              {pages.map((page) => (
                <div key={page.key} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {page.name}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {permissionLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${page.key}-${level}`}
                          checked={permissions[page.key]?.includes(level) || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(page.key, level, !!checked)
                          }
                        />
                        <Label
                          htmlFor={`${page.key}-${level}`}
                          className="text-sm capitalize"
                        >
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-8">
              <Button 
                onClick={handleSave} 
                className="flex-1"
                disabled={updatePermissionsMutation.isPending}
              >
                {updatePermissionsMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserPermissionPanel;
