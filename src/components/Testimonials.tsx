import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

const Testimonials = () => (
  <section className="py-28">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium mb-4 block">Testimonials</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Worn By The <span className="text-gradient">Discerning</span></h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Hear from those who've experienced the CuzAura difference.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary rounded-xl p-7 glow-border relative"
          >
            <Quote className="w-8 h-8 text-gold/20 mb-4" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-foreground/90 text-sm leading-relaxed mb-6">"{t.text}"</p>
            <div>
              <p className="text-gold font-semibold text-sm">{t.name}</p>
              <p className="text-muted-foreground text-xs">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
