import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="py-28 bg-card/30 relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium mb-4 block">Bespoke</span>
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Your Vision.<br />Our <span className="text-gradient">Craft.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-xl mx-auto">
          Design your dream pair from scratch. Choose your leather, colours, details, and monogram. We'll handcraft it just for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="glow-gold text-base px-10 py-6 font-semibold gap-2">
            <Link to="/customize">Start Designing <ArrowRight size={16} /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-10 py-6 font-semibold border-gold/20 hover:bg-gold/5 text-foreground">
            <Link to="/collection">Browse Ready-Made</Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-muted-foreground/50 text-xs uppercase tracking-[0.2em]">
          <span>Free Shipping</span>
          <span className="text-gold/20">•</span>
          <span>30-Day Returns</span>
          <span className="text-gold/20">•</span>
          <span>1-Year Warranty</span>
          <span className="text-gold/20">•</span>
          <span>Handcrafted in India</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
