import { motion } from "framer-motion";
import { products } from "@/lib/data";
import ShoeCard from "@/components/ShoeCard";
import { useState } from "react";

const categories = ["All", "Derby", "Brogue", "Monk Strap", "Chelsea Boot", "Loafer", "Chukka Boot"];

const CollectionPage = () => {
  const [filter, setFilter] = useState("All");
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
          {filtered.map((p, i) => (
            <ShoeCard key={p.id} product={p} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No shoes found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
