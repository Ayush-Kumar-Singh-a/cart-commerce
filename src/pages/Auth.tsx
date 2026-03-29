import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!" });
        navigate("/");
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "Please check your email to verify your account before signing in." });
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card flipkart-shadow rounded-sm overflow-hidden">
            <div className="bg-primary p-6">
              <h1 className="text-2xl font-bold text-primary-foreground">
                {isLogin ? "Login" : "Sign Up"}
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-1">
                {isLogin
                  ? "Get access to your Orders, Wishlist and Recommendations"
                  : "Sign up to access your Orders, Wishlist and Recommendations"}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Email *
                </label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 rounded-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Password *
                </label>
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 rounded-sm"
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold rounded-sm h-12 text-base"
              >
                {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Login" : "Sign Up")}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {isLogin ? "New to Flipkart? Create an account" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
