
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const UserNavigation = ({ currentPage }) => {
  const navigate = useNavigate();

  const pages = [
    { key: "products-list", name: "Products", access: "Edit" },
    { key: "marketing-list", name: "Marketing", access: "View" },
    { key: "order-list", name: "Orders", access: "Create" },
    { key: "media-plans", name: "Media", access: "View" },
    { key: "offer-pricing", name: "Pricing", access: "Edit" },
    { key: "clients", name: "Clients", access: "View" },
    { key: "suppliers", name: "Suppliers", access: "Create" },
    { key: "customer-support", name: "Support", access: "Delete" },
    { key: "sales-reports", name: "Sales", access: "View" },
    { key: "finance", name: "Finance", access: "View" }
  ];

  const getAccessColor = (access) => {
    switch (access) {
      case "View": return "bg-blue-100 text-blue-800";
      case "Edit": return "bg-yellow-100 text-yellow-800";
      case "Create": return "bg-green-100 text-green-800";
      case "Delete": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">User Dashboard</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {pages.slice(0, 6).map((page) => (
                <Button
                  key={page.key}
                  variant={currentPage === page.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(`/pages/${page.key}`)}
                  className="relative"
                >
                  {page.name}
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 text-xs ${getAccessColor(page.access)}`}
                  >
                    {page.access}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline">Regular User</Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavigation;
