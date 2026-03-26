import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, formatPrice } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Shield, RotateCcw, Truck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product);
    toast({ title: "Added to cart", description: `${product.name} has been added.` });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <Link to="/collection" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-10 text-sm">
          <ArrowLeft size={14} /> Back to Collection
        </Link>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary rounded-2xl p-12 aspect-square flex items-center justify-center sticky top-28"
          >
            <img src={product.image} alt={product.name} width={800} height={800} className="w-full object-contain" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-2 block">{product.category}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-6">{product.color} Leather</p>
            <p className="text-3xl text-gradient font-bold mb-8">{formatPrice(product.price)}</p>
            <p className="text-muted-foreground mb-10 leading-relaxed">{product.description}</p>

            <Button size="lg" onClick={handleAdd} className="glow-gold px-10 py-6 text-base font-semibold gap-2 w-full sm:w-auto">
              <ShoppingBag size={18} /> Add to Cart
            </Button>

            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-border">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: RotateCcw, label: "30-Day Returns" },
                { icon: Shield, label: "1-Year Warranty" },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <f.icon className="w-5 h-5 text-gold/60 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
