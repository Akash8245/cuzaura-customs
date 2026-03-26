import { motion } from "framer-motion";
import { Shield, Leaf, Award, Clock } from "lucide-react";

const features = [
  { icon: Shield, title: "Full-Grain Leather", desc: "We use only 100% full-grain leather — the highest quality grade — sourced from world-renowned tanneries." },
  { icon: Leaf, title: "Sustainably Sourced", desc: "Every hide is ethically sourced and vegetable-tanned using traditional, eco-friendly processes." },
  { icon: Award, title: "Goodyear Welt", desc: "Our signature Goodyear welt construction ensures durability, water resistance, and easy re-soling for years to come." },
  { icon: Clock, title: "72 Hours of Craft", desc: "Each pair takes over 72 hours of meticulous handwork — from cutting to finishing — across 200+ individual steps." },
];

const MaterialsSection = () => (
  <section className="py-28 bg-card/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium mb-4 block">Quality</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Uncompromising <span className="text-gradient">Materials</span></h2>
        <p className="text-muted-foreground max-w-lg mx-auto">We believe luxury is in the details. Every material is chosen for its beauty, durability, and character.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="bg-secondary rounded-xl p-8 glow-border hover:glow-gold transition-all duration-500 group"
          >
            <f.icon className="w-10 h-10 text-gold mb-5 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-display text-lg font-bold mb-3">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default MaterialsSection;
