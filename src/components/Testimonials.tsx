import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/data";

const Testimonials = () => (
  <section className="py-24 bg-card/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-primary mb-2 font-medium">Reviews</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold">What They Say</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-secondary rounded-xl p-8 glow-border"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground mb-6 text-sm leading-relaxed">"{t.text}"</p>
            <p className="text-primary font-semibold text-sm">{t.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
