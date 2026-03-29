import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import storyShoe1 from "@/assets/story-shoe-1.jpg";
import storyShoe2 from "@/assets/story-shoe-2.jpg";
import storyShoe3 from "@/assets/story-shoe-3.jpg";
import storyShoe4 from "@/assets/story-shoe-4.jpg";
import storyShoe5 from "@/assets/story-shoe-5.jpg";

const slides = [
  { image: storyShoe1, name: "Noir Oxford", tagline: "Timeless Elegance" },
  { image: storyShoe2, name: "Cognac Brogue", tagline: "Heritage Craft" },
  { image: storyShoe3, name: "Oxblood Monk", tagline: "Bold Refinement" },
  { image: storyShoe4, name: "Chelsea Espresso", tagline: "Modern Classic" },
  { image: storyShoe5, name: "Sahara Chukka", tagline: "Desert Luxury" },
];

const BrandStory = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 4000);
    return () => clearInterval(timer);
  }, [paginate]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
  };

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Slider */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-card aspect-square">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={current}
                  src={slides[current].image}
                  alt={slides[current].name}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />

              {/* Slide info */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
                      {slides[current].tagline}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                      {slides[current].name}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={() => paginate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-gold" : "w-3 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 justify-center">
              {slides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    i === current
                      ? "border-gold ring-1 ring-gold/30 scale-110"
                      : "border-border opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={56}
                    height={56}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium mb-4 block">Our Story</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Where Heritage<br />Meets <span className="text-gradient">Modernity</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                CusAura was born from a single conviction: that exceptional leather footwear should be accessible to every discerning gentleman, not just the elite few.
              </p>
              <p>
                Our master artisans bring over three decades of experience to every pair, using time-honoured techniques passed down through generations of Indian shoemakers — combined with contemporary design sensibilities.
              </p>
              <p>
                Every shoe is crafted from hand-selected, full-grain leather sourced from the finest tanneries. No shortcuts. No compromises. Just pure craftsmanship.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-10">
              {[
                { num: "50+", label: "Master Artisans" },
                { num: "10K+", label: "Pairs Crafted" },
                { num: "98%", label: "Happy Customers" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl md:text-3xl font-bold text-gradient">{stat.num}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
