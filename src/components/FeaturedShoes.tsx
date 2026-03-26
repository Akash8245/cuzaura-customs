import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { products, formatPrice } from "@/lib/data";

const FeaturedShoes = () => (
  <section className="py-28 bg-card/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium mb-4 block">Collection</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Signature Pieces</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Each design tells a story of heritage, precision, and uncompromising quality.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.slice(0, 3).map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            <Link to={`/collection/${p.id}`} className="group block">
              <div className="relative bg-secondary rounded-xl overflow-hidden aspect-square mb-5">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="w-full h-full object-contain p-10 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.03] transition-colors duration-500" />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] text-gold/60 font-medium">{p.category}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-gold transition-colors duration-300">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.color} Leather</p>
                </div>
                <span className="text-gold font-bold text-lg">{formatPrice(p.price)}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <Link
          to="/collection"
          className="inline-block text-sm font-semibold text-gold border border-gold/20 rounded-full px-10 py-4 hover:bg-gold/5 transition-all duration-300"
        >
          View Full Collection →
        </Link>
      </motion.div>
    </div>
  </section>
);

export default FeaturedShoes;
