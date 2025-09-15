import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios"
const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const passwordMatch = formData.password === formData.confirmPassword;
  const passwordValid = formData.password.length >= 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!passwordValid) {
    toast({
      title: "Invalid Password",
      description: "Password must be at least 6 characters long.",
      variant: "destructive",
    });
    return;
  }

  if (!passwordMatch) {
    toast({
      title: "Passwords Don't Match",
      description: "Please make sure your passwords match.",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    toast({
      title: "Account Created Successfully",
      description: "Welcome to storeCart! You can now start shopping.",
    });
    navigate("/signin");
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Signup Failed",
      description: err.response?.data?.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">storeCart</span>
          </Link>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join storeCart and start your shopping journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border-border pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.password && (
                  <div className="flex items-center space-x-2 text-sm">
                    {passwordValid ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className={passwordValid ? "text-primary" : "text-destructive"}>
                      At least 6 characters
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="border-border pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center space-x-2 text-sm">
                    {passwordMatch ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className={passwordMatch ? "text-primary" : "text-destructive"}>
                      Passwords match
                    </span>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !passwordValid || !passwordMatch}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;