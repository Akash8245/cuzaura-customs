import { motion } from "framer-motion";
import ShoeCard from "@/components/ShoeCard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/data";
import { toast } from "@/hooks/use-toast";

const categories = ["All", "Derby", "Brogue", "Monk Strap", "Chelsea Boot", "Loafer", "Chukka Boot"];

const CollectionPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err: any) {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium mb-2 block">Shop</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-8">Collection</h1>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === c
                    ? "bg-gold text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-center text-muted-foreground py-20 col-span-full">Loading products...</p>
          ) : filtered.length > 0 ? (
            filtered.map((p, i) => (
              <ShoeCard key={p.id} product={p} index={i} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-20 col-span-full">No shoes found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
