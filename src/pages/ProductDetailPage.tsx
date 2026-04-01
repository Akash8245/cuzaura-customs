import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Shield, RotateCcw, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
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
  description: string;
  image_url?: string;
  image?: string;
  additional_images?: string;
  is_active: boolean;
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const getFallbackImage = useCallback((productId: string) => {
    return DEFAULT_SHOE_IMAGES[
      (productId.charCodeAt(0) + productId.charCodeAt(productId.length - 1)) % DEFAULT_SHOE_IMAGES.length
    ];
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) { setLoading(false); return; }
      try {
        const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
        if (error) throw error;
        setProduct(data);

        // Build image array
        const images: string[] = [];
        const mainImage = data.image_url || data.image || getFallbackImage(data.id);
        images.push(mainImage);

        // Parse additional images
        if (data.additional_images) {
          try {
            const additional = JSON.parse(data.additional_images);
            if (Array.isArray(additional)) {
              images.push(...additional);
            }
          } catch {}
        }

        setAllImages(images);
        setSelectedImageIndex(0);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, getFallbackImage]);

  const handleImageError = useCallback((index: number) => {
    if (product) {
      setAllImages(prev => {
        const updated = [...prev];
        updated[index] = getFallbackImage(product.id);
        return updated;
      });
    }
  }, [product, getFallbackImage]);

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found.</p>
          <Link to="/collection" className="text-gold hover:text-gold/80">← Back to Collection</Link>
        </div>
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
        <Link to="/collection" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-10 text-sm">
          <ArrowLeft size={14} /> Back to Collection
        </Link>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-28">
            {/* Main Image */}
            <div className="relative bg-secondary rounded-2xl overflow-hidden aspect-square flex items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={allImages[selectedImageIndex]}
                  onError={() => handleImageError(selectedImageIndex)}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-contain p-8"
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Image counter */}
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {selectedImageIndex + 1} / {allImages.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === selectedImageIndex
                        ? "border-gold ring-2 ring-gold/30"
                        : "border-border/30 hover:border-gold/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      onError={() => handleImageError(idx)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain p-1 bg-secondary"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-2 block">{product.category}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-6">{product.color} Leather</p>
            <p className="text-3xl text-gradient font-bold mb-8">{formatPrice(product.price)}</p>
            <p className="text-muted-foreground mb-10 leading-relaxed">{product.description}</p>

            <Button size="lg" onClick={handleAdd} className="glow-gold px-10 py-6 text-base font-semibold gap-2 w-full sm:w-auto">
              <ShoppingBag size={18} /> Add to Cart
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-border">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: RotateCcw, label: "30-Day Returns" },
                { icon: Shield, label: "1-Year Warranty" },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <f.icon className="w-5 h-5 text-gold/60 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
