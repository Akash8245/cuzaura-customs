import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, memo } from "react";
import { Loader } from "lucide-react";
import shoe1 from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-2.png";
import shoe3 from "@/assets/shoe-3.png";
import shoe4 from "@/assets/shoe-4.png";
import shoe5 from "@/assets/shoe-5.png";
import shoe6 from "@/assets/shoe-6.png";

const DEFAULT_SHOE_IMAGES = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6];

interface Product {
  id: string;
  name: string;
  price: number;
  color: string;
  category: string;
  image_url?: string;
  description: string;
  is_active: boolean;
}

const FeaturedShoeImage = memo(({ product, fallbackImage }: { product: Product; fallbackImage: string }) => {
  const [imageSrc, setImageSrc] = useState(product.image_url || fallbackImage);

  const handleImageError = () => {
    console.warn(`Featured image failed to load for ${product.name}:`, product.image_url);
    setImageSrc(fallbackImage);
  };

  return (
    <img
      src={imageSrc}
      onError={handleImageError}
      alt={product.name}
      loading="lazy"
      decoding="async"
      width={400}
      height={400}
      className="w-full h-full object-contain p-10 transition-transform duration-500 group-hover:scale-105 will-change-transform"
    />
  );
});
FeaturedShoeImage.displayName = "FeaturedShoeImage";

const FeaturedShoes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
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
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-8 h-8 text-gold animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground">Loading featured shoes...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-muted-foreground">No products available yet.</p>
          </div>
        ) : (
          products.map((p, i) => {
            const fallbackImage = DEFAULT_SHOE_IMAGES[
              (p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1)) % 
              DEFAULT_SHOE_IMAGES.length
            ];

            return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.1, 0.2), duration: 0.4 }}
            >
              <Link to={`/collection/${p.id}`} className="group block">
                <div className="relative bg-secondary rounded-xl overflow-hidden aspect-square mb-5">
                  <FeaturedShoeImage product={p} fallbackImage={fallbackImage} />
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
            );
          })
        )}
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
};

export default FeaturedShoes;
