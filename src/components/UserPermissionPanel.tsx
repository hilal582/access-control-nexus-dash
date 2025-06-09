
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

const UserPermissionPanel = ({ isOpen, onClose, user }) => {
  const [permissions, setPermissions] = useState(user?.permissions || {});

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

  const permissionLevels = ["View", "Edit", "Create", "Delete"];

  const handlePermissionChange = (pageKey, permission) => {
    setPermissions(prev => ({
      ...prev,
      [pageKey]: permission
    }));
  };

  const handleSave = () => {
    toast.success("User permissions updated successfully");
    onClose();
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
                  {user.name.split(' ').map(n => n[0]).join('')}
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Page Permissions</h3>
          {pages.map((page) => (
            <div key={page.key} className="space-y-2">
              <Label htmlFor={page.key} className="text-sm font-medium">
                {page.name}
              </Label>
              <Select
                value={permissions[page.key] || "View"}
                onValueChange={(value) => handlePermissionChange(page.key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select permission level" />
                </SelectTrigger>
                <SelectContent>
                  {permissionLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-8">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
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
