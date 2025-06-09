
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommentSection from "@/components/CommentSection";
import UserNavigation from "@/components/UserNavigation";
import { ArrowLeft } from "lucide-react";

const UserPages = () => {
  const { pageName } = useParams();
  const navigate = useNavigate();

  const pageData = {
    "products-list": {
      title: "Products List",
      description: "Manage and view product inventory, specifications, and availability",
      color: "bg-blue-100 text-blue-800"
    },
    "marketing-list": {
      title: "Marketing List",
      description: "Campaign management, marketing strategies, and promotional content",
      color: "bg-green-100 text-green-800"
    },
    "order-list": {
      title: "Order List",
      description: "Track orders, manage fulfillment, and monitor order status",
      color: "bg-purple-100 text-purple-800"
    },
    "media-plans": {
      title: "Media Plans",
      description: "Strategic media planning, advertising schedules, and campaign execution",
      color: "bg-orange-100 text-orange-800"
    },
    "offer-pricing": {
      title: "Offer Pricing SKUs",
      description: "Pricing strategies, SKU management, and promotional offers",
      color: "bg-red-100 text-red-800"
    },
    "clients": {
      title: "Clients",
      description: "Client relationship management, contact information, and communication history",
      color: "bg-indigo-100 text-indigo-800"
    },
    "suppliers": {
      title: "Suppliers",
      description: "Supplier management, vendor relationships, and procurement processes",
      color: "bg-teal-100 text-teal-800"
    },
    "customer-support": {
      title: "Customer Support",
      description: "Support tickets, customer inquiries, and resolution tracking",
      color: "bg-yellow-100 text-yellow-800"
    },
    "sales-reports": {
      title: "Sales Reports",
      description: "Sales analytics, performance metrics, and revenue tracking",
      color: "bg-pink-100 text-pink-800"
    },
    "finance": {
      title: "Finance & Accounting",
      description: "Financial records, accounting processes, and budget management",
      color: "bg-emerald-100 text-emerald-800"
    }
  };

  const currentPage = pageData[pageName] || {
    title: "Page Not Found",
    description: "The requested page could not be found",
    color: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavigation currentPage={pageName} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentPage.title}</h1>
              <p className="text-gray-600 mt-1">{currentPage.description}</p>
            </div>
            <Badge variant="secondary" className={currentPage.color}>
              Active Page
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
                <CardDescription>
                  This is a sample page demonstrating the comment system and access control features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to the <strong>{currentPage.title}</strong> page. This page demonstrates 
                    how different users interact with content based on their assigned permissions.
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Users with <strong>View</strong> access can see comments and content</li>
                    <li>Users with <strong>Edit</strong> access can modify existing comments</li>
                    <li>Users with <strong>Create</strong> access can add new comments</li>
                    <li>Users with <strong>Delete</strong> access can remove comments</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Permissions</CardTitle>
                <CardDescription>
                  Current access level for this page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">View Content</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Granted
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Edit Comments</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Granted
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Create Comments</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Granted
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Delete Comments</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      Denied
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mt-8">
          <CommentSection pageName={pageName} />
        </div>
      </div>
    </div>
  );
};

export default UserPages;
