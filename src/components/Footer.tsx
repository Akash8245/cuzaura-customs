import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-gold/10 bg-card/50">
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold mb-3">
            Cuz<span className="text-gradient">Aura</span>
          </h3>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            India's premier destination for bespoke leather footwear. Handcrafted by master artisans using the world's finest leathers.
          </p>
          <div className="flex gap-6 mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/50">
            <span>Free Shipping</span>
            <span>30-Day Returns</span>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-5 text-foreground text-sm uppercase tracking-wider">Shop</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <Link to="/collection" className="hover:text-gold transition-colors duration-300">Collection</Link>
            <Link to="/customize" className="hover:text-gold transition-colors duration-300">Bespoke</Link>
            <Link to="/cart" className="hover:text-gold transition-colors duration-300">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-5 text-foreground text-sm uppercase tracking-wider">Company</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <span>About Us</span>
            <span>Contact</span>
            <span>Shipping & Returns</span>
            <span>Care Guide</span>
          </div>
        </div>
      </div>
      <div className="line-gold mt-12 mb-8" />
      <div className="text-center text-xs text-muted-foreground/50 uppercase tracking-wider">
        © 2026 CuzAura. All rights reserved. Handcrafted in India.
      </div>
    </div>
  </footer>
);

export default Footer;
