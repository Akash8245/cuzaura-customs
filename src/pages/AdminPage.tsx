import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const fakeOrders = [
  { id: "ORD-001", customer: "Alex M.", product: "Custom Runner", total: 259, status: "Pending", date: "2026-03-20" },
  { id: "ORD-002", customer: "Jordan K.", product: "Violet Flux", total: 219, status: "Accepted", date: "2026-03-19" },
  { id: "ORD-003", customer: "Sam T.", product: "Crimson Blaze", total: 199, status: "Shipped", date: "2026-03-18" },
  { id: "ORD-004", customer: "Chris R.", product: "Shadow Elite", total: 249, status: "Delivered", date: "2026-03-15" },
];

const statuses = ["Pending", "Accepted", "Shipped", "Delivered"];

const AdminPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState(fakeOrders);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setLoggedIn(true);
    } else {
      toast({ title: "Invalid credentials", description: "Use admin/admin", variant: "destructive" });
    }
  };

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    toast({ title: "Status updated", description: `Order ${orderId} → ${newStatus}` });
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="bg-secondary rounded-2xl p-8 glow-border">
            <h1 className="font-display text-2xl font-bold text-center mb-6">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-muted border-border py-6" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-muted border-border py-6" />
              <Button type="submit" size="lg" className="w-full glow-primary py-6 font-semibold">Login</Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-4xl font-bold">Admin Panel</h1>
            <Button variant="outline" onClick={() => setLoggedIn(false)}>Logout</Button>
          </div>

          <div className="bg-secondary rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-muted-foreground">Order</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Product</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Total</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Date</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{order.id}</td>
                      <td className="p-4 text-muted-foreground">{order.customer}</td>
                      <td className="p-4 text-muted-foreground">{order.product}</td>
                      <td className="p-4 text-primary font-semibold">${order.total}</td>
                      <td className="p-4 text-muted-foreground">{order.date}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="bg-muted text-foreground border border-border rounded-lg px-3 py-1.5 text-sm"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
