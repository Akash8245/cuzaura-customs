import { motion } from "framer-motion";
import craftsmanshipImg from "@/assets/craftsmanship.jpg";

const BrandStory = () => (
  <section className="py-28 relative overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={craftsmanshipImg}
              alt="Master artisan crafting leather shoe"
              loading="lazy"
              width={1200}
              height={800}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Est. 2020</span>
            </div>
          </div>
        </motion.div>

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
              CuzAura was born from a single conviction: that exceptional leather footwear should be accessible to every discerning gentleman, not just the elite few.
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

export default BrandStory;
