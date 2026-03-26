import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroShoe from "@/assets/hero-shoe.png";
import { Button } from "@/components/ui/button";

const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden gradient-mesh">
    {/* Animated background orbs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-neon-blue/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
    </div>

    <div className="container mx-auto px-6 pt-24 pb-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm uppercase tracking-[0.3em] text-primary mb-4 font-medium"
          >
            Premium Custom Footwear
          </motion.p>
          <h1 className="font-display text-6xl md:text-8xl font-black leading-[0.9] mb-4">
            Cuz
            <span className="text-gradient">Aura</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
            Wear Your Aura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="glow-primary text-base px-8 py-6 font-semibold">
              <Link to="/customize">Customize Your Shoes</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 font-semibold border-border hover:bg-secondary">
              <Link to="/collection">Explore Collection</Link>
            </Button>
          </div>
        </motion.div>

        {/* Hero shoe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center"
        >
          <motion.img
            src={heroShoe}
            alt="CuzAura custom shoe"
            width={1024}
            height={1024}
            className="w-full max-w-lg drop-shadow-2xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
