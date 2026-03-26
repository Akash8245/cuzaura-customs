import { motion } from "framer-motion";
import { Palette, Sparkles, Package } from "lucide-react";

const steps = [
  { icon: Palette, title: "Choose", desc: "Pick your base model from our curated selection" },
  { icon: Sparkles, title: "Customize", desc: "Make it yours with colors, laces, and personal touches" },
  { icon: Package, title: "Order", desc: "We craft your custom pair and deliver it to your door" },
];

const HowItWorks = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-primary mb-2 font-medium">Process</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold">How It Works</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="text-center group"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center glow-border group-hover:glow-primary transition-all duration-300">
              <step.icon className="w-8 h-8 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary mb-2 block">0{i + 1}</span>
            <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
