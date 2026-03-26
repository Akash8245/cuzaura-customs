import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, login, signup } = useAuthStore();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Please fill all fields",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    if (isSignup && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSignup) {
        await signup(email, password);
        toast({
          title: "Account created!",
          description: "Welcome to CusAura. You can now place orders.",
        });
      } else {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You're now logged in.",
        });
      }
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-secondary rounded-2xl p-8 glow-border">
          <h1 className="font-display text-3xl font-bold text-center mb-2">
            {isSignup ? "Join CusAura" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            {isSignup
              ? "Create your account to place orders"
              : "Sign in to your account"}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border py-6"
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-border py-6"
              required
              minLength={6}
              disabled={isLoading}
            />
            {isSignup && (
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-muted border-border py-6"
                required
                minLength={6}
                disabled={isLoading}
              />
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full glow-gold py-6 font-semibold"
              disabled={isLoading || !email || !password || (isSignup && !confirmPassword)}
            >
              {isLoading
                ? isSignup
                  ? "Creating account..."
                  : "Signing in..."
                : isSignup
                ? "Sign Up"
                : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-gold font-medium hover:underline disabled:opacity-50"
              disabled={isLoading}
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
