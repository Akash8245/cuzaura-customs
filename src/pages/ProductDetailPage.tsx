import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft } from "lucide-react";
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
        <Link to="/collection" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Collection
        </Link>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary rounded-2xl p-12 aspect-square flex items-center justify-center"
          >
            <img src={product.image} alt={product.name} width={800} height={800} className="w-full object-contain" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-2 font-medium">{product.color}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl text-primary font-bold mb-6">${product.price}</p>
            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>
            <Button size="lg" onClick={handleAdd} className="glow-primary px-8 py-6 text-base font-semibold gap-2">
              <ShoppingBag size={18} /> Add to Cart
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
