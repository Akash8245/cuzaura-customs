import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/data";

const CartPage = () => {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6">
        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
        <Button asChild variant="outline" className="border-gold/20 hover:bg-gold/5 text-foreground">
          <Link to="/collection">Browse Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-5xl font-bold mb-12">Cart</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary rounded-xl p-6 flex gap-6 items-center"
              >
                <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-contain" loading="lazy" width={96} height={96} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.customization ? "Bespoke Design" : item.product.color + " Leather"}</p>
                  <p className="text-gold font-bold mt-1">{formatPrice(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors"><Minus size={14} /></button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={18} /></button>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-secondary rounded-xl p-8 h-fit glow-border">
            <h3 className="font-display text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(total())}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="text-gold">Free</span></div>
              <div className="border-t border-border pt-3 flex justify-between text-lg font-bold"><span>Total</span><span className="text-gradient">{formatPrice(total())}</span></div>
            </div>
            <Button asChild size="lg" className="w-full mt-6 glow-gold py-6 font-semibold">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
