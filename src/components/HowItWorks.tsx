import { motion } from "framer-motion";
import { Ruler, Palette, Package, Sparkles } from "lucide-react";

const steps = [
  { icon: Ruler, title: "Select", desc: "Choose your base silhouette from our curated range of timeless designs — Oxford, Derby, Monk Strap, or Chelsea." },
  { icon: Palette, title: "Customise", desc: "Select your leather, sole, lace colours and add a personal monogram. Every detail is yours to decide." },
  { icon: Sparkles, title: "Handcraft", desc: "Our master artisans bring your vision to life, hand-stitching every detail with precision and care." },
  { icon: Package, title: "Deliver", desc: "Your bespoke pair arrives in our signature packaging, ready to make a lasting impression." },
];

const HowItWorks = () => (
  <section className="py-28">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium mb-4 block">Process</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">The CusAura Experience</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">From vision to creation — a seamless journey to your perfect pair.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center group"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary flex items-center justify-center glow-border group-hover:glow-gold transition-all duration-500">
                <step.icon className="w-8 h-8 text-gold" />
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs font-bold text-gold">
                {i + 1}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
