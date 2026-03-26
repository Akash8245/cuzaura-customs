import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold mb-2">
            Cuz<span className="text-gradient">Aura</span>
          </h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Premium custom shoes for the bold generation. Design your own or explore our curated collection.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-foreground">Shop</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/collection" className="hover:text-primary transition-colors">Collection</Link>
            <Link to="/customize" className="hover:text-primary transition-colors">Customize</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-foreground">Company</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>About</span>
            <span>Contact</span>
            <span>FAQ</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
        © 2026 CuzAura. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
