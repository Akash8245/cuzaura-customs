import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/data";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"address" | "payment" | "success">("address");
  const [address, setAddress] = useState({ name: "", street: "", city: "", zip: "", phone: "" });
  const [processing, setProcessing] = useState(false);

  if (items.length === 0 && step !== "success") {
    navigate("/cart");
    return null;
  }

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      clearCart();
      setStep("success");
      setProcessing(false);
      toast({ title: "Order placed!", description: "Your shoes are being handcrafted." });
    }, 2000);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle2 className="w-24 h-24 text-gold mx-auto" />
        </motion.div>
        <h1 className="font-display text-4xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground max-w-md">Your bespoke leather shoes are being handcrafted by our artisans. We'll notify you when they ship.</p>
        <Button onClick={() => navigate("/")} variant="outline" className="mt-4 border-gold/20 hover:bg-gold/5 text-foreground">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>
          <div className="flex gap-4 mb-10">
            {["Address", "Payment"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  (step === "address" && i === 0) || (step === "payment" && i <= 1) ? "bg-gold text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>{i + 1}</div>
                <span className="text-sm font-medium">{s}</span>
              </div>
            ))}
          </div>

          {step === "address" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Input placeholder="Full Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="bg-secondary border-border py-6" />
              <Input placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="bg-secondary border-border py-6" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="bg-secondary border-border py-6" />
                <Input placeholder="PIN Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="bg-secondary border-border py-6" />
              </div>
              <Input placeholder="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="bg-secondary border-border py-6" />
              <Button size="lg" className="w-full glow-gold py-6 font-semibold mt-4" onClick={() => setStep("payment")} disabled={!address.name || !address.street || !address.city}>
                Continue to Payment
              </Button>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-secondary rounded-xl p-6 glow-border">
                <h3 className="font-display font-semibold mb-4">Order Summary</h3>
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span className="text-gold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-border">
                  <span>Total</span>
                  <span className="text-gradient">{formatPrice(total())}</span>
                </div>
              </div>
              <div className="bg-secondary rounded-xl p-6">
                <h3 className="font-display font-semibold mb-4">Payment (Demo)</h3>
                <Input placeholder="Card Number" defaultValue="4242 4242 4242 4242" className="bg-muted border-border py-6 mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" defaultValue="12/28" className="bg-muted border-border py-6" />
                  <Input placeholder="CVC" defaultValue="123" className="bg-muted border-border py-6" />
                </div>
              </div>
              <Button size="lg" className="w-full glow-gold py-6 font-semibold" onClick={handlePayment} disabled={processing}>
                {processing ? "Processing..." : `Pay ${formatPrice(total())}`}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
