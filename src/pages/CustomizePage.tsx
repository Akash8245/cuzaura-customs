import { useState } from "react";
import { motion } from "framer-motion";
import { baseModels, colorOptions } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CustomizePage = () => {
  const [selectedModel, setSelectedModel] = useState(baseModels[0]);
  const [bodyColor, setBodyColor] = useState(colorOptions[0].value);
  const [soleColor, setSoleColor] = useState(colorOptions[2].value);
  const [laceColor, setLaceColor] = useState(colorOptions[6].value);
  const [customText, setCustomText] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(
      { id: `custom-${Date.now()}`, name: `Custom ${selectedModel.name}`, price: 259, image: selectedModel.image, color: "Custom", description: "Your custom designed shoe" },
      { baseModel: selectedModel.id, bodyColor, soleColor, laceColor, text: customText }
    );
    toast({ title: "Custom shoe added!", description: "Your design has been added to the cart." });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-2 font-medium">Design</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-12">Customize</h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-secondary rounded-2xl aspect-square flex items-center justify-center overflow-hidden"
          >
            {/* Color overlay to simulate customization */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-color transition-colors duration-500"
              style={{ backgroundColor: bodyColor }}
            />
            <img
              src={selectedModel.image}
              alt={selectedModel.name}
              width={800}
              height={800}
              className="w-3/4 object-contain relative z-10"
            />
            {customText && (
              <span className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-foreground font-display font-bold text-lg bg-background/80 px-4 py-1 rounded-full">
                {customText}
              </span>
            )}
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Base Model */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Base Model</h3>
              <div className="grid grid-cols-2 gap-3">
                {baseModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedModel.id === m.id
                        ? "bg-primary/20 border border-primary glow-border"
                        : "bg-secondary border border-transparent hover:border-border"
                    }`}
                  >
                    <img src={m.image} alt={m.name} className="w-16 h-16 mx-auto object-contain mb-2" loading="lazy" width={64} height={64} />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Color */}
            <ColorPicker label="Body Color" value={bodyColor} onChange={setBodyColor} />
            <ColorPicker label="Sole Color" value={soleColor} onChange={setSoleColor} />
            <ColorPicker label="Lace Color" value={laceColor} onChange={setLaceColor} />

            {/* Custom text */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-3">Custom Text</h3>
              <Input
                placeholder="Add your text (optional)"
                value={customText}
                onChange={(e) => setCustomText(e.target.value.slice(0, 20))}
                className="bg-secondary border-border"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground mt-1">{customText.length}/20 characters</p>
            </div>

            {/* Price & add */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Custom shoe price</span>
                <span className="text-3xl font-bold text-primary">$259</span>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="w-full glow-primary py-6 text-base font-semibold gap-2">
                <ShoppingBag size={18} /> Add to Cart
              </Button>
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
      {colorOptions.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          title={c.name}
          className={`w-10 h-10 rounded-full transition-all duration-200 ${
            value === c.value ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "hover:scale-110"
          }`}
          style={{ backgroundColor: c.value }}
        />
      ))}
    </div>
  </div>
);

export default CustomizePage;
