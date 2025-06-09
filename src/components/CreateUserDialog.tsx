
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateUser } from "@/hooks/useUsers";

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserDialog = ({ isOpen, onClose }: CreateUserDialogProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const createUserMutation = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUserMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8) + "A1!";
    setFormData(prev => ({ ...prev, password }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will receive login credentials via email.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex space-x-2">
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                required
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={generatePassword}
                size="sm"
              >
                Generate
              </Button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              disabled={createUserMutation.isPending} 
              className="flex-1"
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
