import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/data";
import shoe1 from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-2.png";
import shoe3 from "@/assets/shoe-3.png";
import shoe4 from "@/assets/shoe-4.png";
import shoe5 from "@/assets/shoe-5.png";
import shoe6 from "@/assets/shoe-6.png";
import { useState, memo, useCallback } from "react";

const DEFAULT_SHOE_IMAGES = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6];

const CartItemImage = memo(({ item, fallbackImage }: { item: any; fallbackImage: string }) => {
  const [imageSrc, setImageSrc] = useState(item.product.image_url || item.product.image || fallbackImage);

  const handleImageError = useCallback(() => {
    setImageSrc(fallbackImage);
  }, [fallbackImage]);

  return (
    <img
      src={imageSrc}
      onError={handleImageError}
      alt={item.product.name}
      className="w-24 h-24 object-contain"
      loading="lazy"
      decoding="async"
      width={96}
      height={96}
    />
  );
}, (prev, next) => prev.item.product.id === next.item.product.id && prev.fallbackImage === next.fallbackImage);
CartItemImage.displayName = "CartItemImage";

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

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
            {items.map((item, i) => {
              const fallbackImage = DEFAULT_SHOE_IMAGES[
                (item.product.id.charCodeAt(0) + item.product.id.charCodeAt(item.product.id.length - 1)) % 
                DEFAULT_SHOE_IMAGES.length
              ];

              return (
              <motion.div
                key={item.product.id + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary rounded-xl p-6 flex gap-6 items-center"
              >
                <CartItemImage item={item} fallbackImage={fallbackImage} />
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
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-secondary rounded-xl p-8 h-fit glow-border">
            <h3 className="font-display text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="text-gold">Free</span></div>
              <div className="border-t border-border pt-3 flex justify-between text-lg font-bold"><span>Total</span><span className="text-gradient">{formatPrice(total)}</span></div>
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
