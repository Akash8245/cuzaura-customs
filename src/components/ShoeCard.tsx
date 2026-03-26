import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Product, formatPrice } from "@/lib/data";
import shoe1 from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-2.png";
import shoe3 from "@/assets/shoe-3.png";
import shoe4 from "@/assets/shoe-4.png";
import shoe5 from "@/assets/shoe-5.png";
import shoe6 from "@/assets/shoe-6.png";
import { useState } from "react";

// Default shoe images for fallback
const DEFAULT_SHOE_IMAGES = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6];

const ShoeCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  // Get a consistent fallback image based on product ID
  const fallbackImage = DEFAULT_SHOE_IMAGES[
    (product.id.charCodeAt(0) + product.id.charCodeAt(product.id.length - 1)) % 
    DEFAULT_SHOE_IMAGES.length
  ];

  const [imageSrc, setImageSrc] = useState(product.image_url || product.image || fallbackImage);

  const handleImageError = () => {
    console.warn(`Image failed to load for ${product.name}:`, product.image_url);
    setImageSrc(fallbackImage);
  };

  return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <Link to={`/collection/${product.id}`} className="group block">
      <div className="relative bg-secondary rounded-xl overflow-hidden aspect-square mb-4">
        <img
          src={imageSrc}
          onError={handleImageError}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
        />
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
}

export default ShoeCard;
