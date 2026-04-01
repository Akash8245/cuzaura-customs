import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroShoe from "@/assets/hero-shoe.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { memo } from "react";

const Hero = memo(() => (
  <section className="relative min-h-screen flex items-center overflow-hidden gradient-mesh">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.03] blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-copper/[0.03] blur-[100px]" />
    </div>

    <div className="container mx-auto px-6 pt-28 pb-20">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center md:text-left order-2 md:order-1"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-gold/70 font-medium border border-gold/20 rounded-full px-5 py-2">
              Walk Beyond Ordinary
            </span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6">
            Cus<span className="text-gradient">Aura</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-3 font-light italic">
            Step Into Your Aura
          </p>
          <p className="text-base text-muted-foreground/70 mb-10 max-w-lg leading-relaxed">
            India's premier destination for bespoke leather footwear. Every pair is handcrafted by master artisans using the world's finest leathers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="glow-gold text-base px-8 py-6 font-semibold gap-2">
              <Link to="/customize">Customize Your Pair <ArrowRight size={16} /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 font-semibold border-gold/20 hover:bg-gold/5 text-foreground">
              <Link to="/collection">Explore Collection</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex justify-center relative order-1 md:order-2"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full bg-gold/[0.04] blur-[60px]" />
          </div>
          <motion.img
            src={heroShoe}
            alt="CusAura handcrafted leather shoe"
            width={512}
            height={512}
            decoding="async"
            loading="eager"
            className="w-full max-w-lg drop-shadow-2xl relative z-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>

    {/* Bottom line */}
    <div className="absolute bottom-0 left-0 right-0 line-gold" />
  </section>
));

Hero.displayName = "Hero";
export default Hero;
