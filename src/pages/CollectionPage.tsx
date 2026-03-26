import { motion } from "framer-motion";
import { products } from "@/lib/data";
import ShoeCard from "@/components/ShoeCard";
import { useState } from "react";

const colors = ["All", "Blue", "Purple", "Red", "Green", "Black", "Pink"];

const CollectionPage = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? products : products.filter((p) => p.color === filter);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-2 font-medium">Shop</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Collection</h1>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
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
          <p className="text-center text-muted-foreground py-20">No shoes found for this filter.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
