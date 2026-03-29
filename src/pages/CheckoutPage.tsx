import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useOrdersStore } from "@/store/ordersStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Lock } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { processPayment, formatAmountForRazorpay } from "@/lib/razorpay";

const CheckoutPage = () => {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const { user } = useAuthStore();
  const { createOrder } = useOrdersStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"address" | "payment" | "success">("address");
  const [address, setAddress] = useState({ name: "", street: "", city: "", zip: "", phone: "" });
  const [processing, setProcessing] = useState(false);

  if (items.length === 0 && step !== "success") {
    navigate("/cart");
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 text-center px-6">
        <h1 className="font-display text-4xl font-bold">Login Required</h1>
        <p className="text-muted-foreground max-w-md">
          Please log in or create an account to proceed with your order.
        </p>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => navigate("/login")} className="glow-gold px-8 py-6">
            Login / Sign Up
          </Button>
          <Button
            onClick={() => navigate("/cart")}
            variant="outline"
            className="border-gold/20 hover:bg-gold/5 text-foreground px-8 py-6"
          >
            Back to Cart
          </Button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to place an order",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      // Prepare payment options for Razorpay with UPI enabled
      const paymentOptions = {
        amount: formatAmountForRazorpay(total), // Amount in paise
        currency: "INR",
        description: `Order for ${items.length} customized shoe${items.length > 1 ? "s" : ""}`,
        
        // Prefill customer details
        prefill: {
          name: address.name,
          email: user.email || "customer@cuzaura.com",
          contact: address.phone || "9000000000",
        },
        
        // Additional order details
        notes: {
          items_count: items.length,
          delivery_address: `${address.street}, ${address.city} - ${address.zip}`,
          customer_name: address.name,
        },
        
        // Theme customization
        theme: {
          color: "#D4AF37", // Gold color
        },
      };

      // Process payment through Razorpay
      const paymentVerified = await processPayment(paymentOptions);

      if (paymentVerified) {
        // Payment verified successfully, now create order
        await createOrder(user.id, items, total, address);
        
        clearCart();
        setStep("success");
        toast({
          title: "Order Placed Successfully!",
          description: "Payment verified. Your shoes are being handcrafted.",
        });
      } else {
        toast({
          title: "Payment Verification Failed",
          description: "The payment signature could not be verified. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Payment Failed",
        description: err.message || "An error occurred during payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle2 className="w-24 h-24 text-gold mx-auto" />
        </motion.div>
        <h1 className="font-display text-4xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground max-w-md">
          Your bespoke leather shoes are being handcrafted by our artisans. We'll notify you when they ship.
        </p>
        <div className="flex gap-4 mt-6 flex-wrap justify-center">
          <Button onClick={() => navigate("/")} variant="outline" className="border-gold/20 hover:bg-gold/5 text-foreground">
            Back to Home
          </Button>
          <Button onClick={() => navigate("/orders")} className="glow-gold">
            View My Orders
          </Button>
        </div>
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
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    (step === "address" && i === 0) || (step === "payment" && i <= 1) ? "bg-gold text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-medium">{s}</span>
              </div>
            ))}
          </div>

          {step === "address" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Input
                placeholder="Full Name"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="bg-secondary border-border py-6"
              />
              <Input
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="bg-secondary border-border py-6"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="bg-secondary border-border py-6"
                />
                <Input
                  placeholder="PIN Code"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="bg-secondary border-border py-6"
                />
              </div>
              <Input
                placeholder="Phone"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="bg-secondary border-border py-6"
              />
              <Button
                size="lg"
                className="w-full glow-gold py-6 font-semibold mt-4"
                onClick={() => setStep("payment")}
                disabled={!address.name || !address.street || !address.city}
              >
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
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-gold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-border">
                  <span>Total</span>
                  <span className="text-gradient">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="bg-secondary rounded-xl p-6">
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gold" />
                  Secure Payment Gateway
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Your payment will be processed securely through <span className="font-semibold text-foreground">Razorpay</span>, India's leading payment service.
                </p>
                <div className="bg-muted rounded-lg p-4 border border-border mb-4">
                  <p className="text-xs text-muted-foreground">
                    💳 <span className="font-semibold">Payment Method:</span> Debit/Credit Cards, UPI, Wallets, and more
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    🔒 <span className="font-semibold">Security:</span> Your payment details are encrypted and secured
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full glow-gold py-6 font-semibold text-base flex items-center justify-center gap-2"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay {formatPrice(total)} Securely
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By clicking pay, you agree to place this order. No charges will be made until payment is verified.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
