
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, profile, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    console.log('Login useEffect - user:', user, 'profile:', profile, 'loading:', loading);
    
    if (user && profile && !loading) {
      console.log('Redirecting user - is_super_admin:', profile.is_super_admin);
      
      if (profile.is_super_admin) {
        console.log('Redirecting to admin dashboard');
        navigate("/admin");
      } else {
        console.log('Redirecting to user dashboard');
        navigate("/pages/products-list");
      }
    }
  }, [user, profile, loading, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoginLoading(true);
    const result = await signIn(email, password);
    
    if (result.success) {
      toast.success("Logged in successfully!");
      // Navigation will be handled by the useEffect above
    } else {
      toast.error(result.error || "Login failed");
    }
    
    setLoginLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
