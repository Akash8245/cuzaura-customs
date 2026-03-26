import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Product, formatPrice } from "@/lib/data";

const ShoeCard = ({ product, index = 0 }: { product: Product; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <Link to={`/collection/${product.id}`} className="group block">
      <div className="relative bg-secondary rounded-xl overflow-hidden aspect-square mb-4">
        {product.image_url || product.image ? (
          <img
            src={product.image_url || product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.03] transition-colors duration-500" />
        <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] text-gold/50 font-medium">{product.category}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground group-hover:text-gold transition-colors duration-300">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.color} Leather</p>
        </div>
        <span className="text-gold font-bold">{formatPrice(product.price)}</span>
      </div>
    </Link>
  </motion.div>
);

export default ShoeCard;
