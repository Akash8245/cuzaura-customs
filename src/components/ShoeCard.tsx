import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Product } from "@/lib/data";

const ShoeCard = ({ product, index = 0 }: { product: Product; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <Link to={`/collection/${product.id}`} className="group block">
      <div className="relative bg-secondary rounded-xl overflow-hidden aspect-square mb-4">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.color}</p>
        </div>
        <span className="text-primary font-bold">${product.price}</span>
      </div>
    </Link>
  </motion.div>
);

export default ShoeCard;
