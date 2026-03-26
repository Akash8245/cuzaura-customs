import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: isSignup ? "Account created!" : "Welcome back!", description: "Authentication will be connected with Lovable Cloud." });
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
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            {isSignup ? "Join the Aura" : "Sign in to your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border py-6"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-border py-6"
              required
              minLength={6}
            />
            <Button type="submit" size="lg" className="w-full glow-primary py-6 font-semibold">
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-medium hover:underline">
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
