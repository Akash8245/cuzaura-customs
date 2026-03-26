import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "@/lib/data";

const FeaturedShoes = () => (
  <section className="py-24 bg-card/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-primary mb-2 font-medium">Curated</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Designs</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.slice(0, 3).map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <Link to={`/collection/${p.id}`} className="group block">
              <div className="relative bg-secondary rounded-xl overflow-hidden aspect-square mb-4">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">{p.name}</h3>
              <p className="text-primary font-semibold">${p.price}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link
          to="/collection"
          className="inline-block text-sm font-semibold text-primary border border-primary/30 rounded-full px-8 py-3 hover:bg-primary/10 transition-colors"
        >
          View All →
        </Link>
      </motion.div>
    </div>
  </section>
);

export default FeaturedShoes;
