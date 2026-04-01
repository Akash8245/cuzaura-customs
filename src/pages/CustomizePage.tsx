import { useState } from "react";
import { motion } from "framer-motion";
import { baseModels, leatherColors, formatPrice } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CustomizePage = () => {
  const [selectedModel, setSelectedModel] = useState(baseModels[0]);
  const [leatherColor, setLeatherColor] = useState(leatherColors[2].value);
  const [soleColor, setSoleColor] = useState(leatherColors[0].value);
  const [laceColor, setLaceColor] = useState(leatherColors[0].value);
  const [monogram, setMonogram] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(
      { id: `custom-${Date.now()}`, name: `Bespoke ${selectedModel.name}`, price: 24999, image: selectedModel.image, color: "Custom", category: "Bespoke", description: "Your custom designed leather shoe" },
      { baseModel: selectedModel.id, leatherColor, soleColor, laceColor, monogram }
    );
    toast({ title: "Bespoke order added!", description: "Your custom design has been added to the cart." });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium mb-2 block">Bespoke</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-12">Design Your Pair</h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-secondary rounded-2xl aspect-square flex items-center justify-center overflow-hidden lg:sticky top-28"
          >
            <div
              className="absolute inset-0 opacity-15 mix-blend-color transition-colors duration-700"
              style={{ backgroundColor: leatherColor }}
            />
            <img src={selectedModel.image} alt={selectedModel.name} width={800} height={800} className="w-3/4 object-contain relative z-10" />
            {monogram && (
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-gold font-display font-bold text-lg bg-background/80 px-4 py-1.5 rounded-full border border-gold/20">
                {monogram}
              </span>
            )}
          </motion.div>

          {/* Controls */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-10">
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Silhouette</h3>
              <div className="grid grid-cols-2 gap-3">
                {baseModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedModel.id === m.id
                        ? "bg-gold/10 border border-gold/30 glow-border"
                        : "bg-secondary border border-transparent hover:border-border"
                    }`}
                  >
                    <img src={m.image} alt={m.name} className="w-16 h-16 mx-auto object-contain mb-2" loading="lazy" width={64} height={64} />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <ColorPicker label="Leather Colour" value={leatherColor} onChange={setLeatherColor} />
            <ColorPicker label="Sole Colour" value={soleColor} onChange={setSoleColor} />
            <ColorPicker label="Lace Colour" value={laceColor} onChange={setLaceColor} />

            <div>
              <h3 className="font-display font-semibold text-lg mb-3">Monogram (Optional)</h3>
              <Input
                placeholder="Your initials, e.g. A.M."
                value={monogram}
                onChange={(e) => setMonogram(e.target.value.slice(0, 10))}
                className="bg-secondary border-border"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground mt-1">{monogram.length}/10 characters</p>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-6">
                <span className="text-muted-foreground">Bespoke price</span>
                <span className="text-3xl font-bold text-gradient">{formatPrice(24999)}</span>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="w-full glow-gold py-6 text-base font-semibold gap-2">
                <ShoppingBag size={18} /> Add to Cart
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">Crafted and delivered in 3-4 weeks</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <h3 className="font-display font-semibold text-lg mb-3">{label}</h3>
    <div className="flex flex-wrap gap-3">
      {leatherColors.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          title={c.name}
          className={`w-10 h-10 rounded-full transition-all duration-300 border-2 ${
            value === c.value ? "border-gold scale-110 shadow-lg" : "border-transparent hover:scale-110"
          }`}
          style={{ backgroundColor: c.value }}
        />
      ))}
    </div>
  </div>
);

export default CustomizePage;
