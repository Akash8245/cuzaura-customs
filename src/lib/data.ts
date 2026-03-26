import shoe1 from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-2.png";
import shoe3 from "@/assets/shoe-3.png";
import shoe4 from "@/assets/shoe-4.png";
import shoe5 from "@/assets/shoe-5.png";
import shoe6 from "@/assets/shoe-6.png";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  category: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: ShoeCustomization;
}

export interface ShoeCustomization {
  baseModel: string;
  leatherColor: string;
  soleColor: string;
  laceColor: string;
  monogram?: string;
}

export const products: Product[] = [
  { id: "1", name: "Noir Derby", price: 14999, image: shoe1, color: "Black", category: "Derby", description: "Handcrafted from the finest Italian calfskin leather. The Noir Derby features a classic cap-toe design with Goodyear welt construction for unmatched durability and elegance." },
  { id: "2", name: "Cognac Brogue", price: 18999, image: shoe2, color: "Cognac", category: "Brogue", description: "A masterpiece of traditional British shoemaking. Full brogue wingtip detailing on rich cognac leather, hand-burnished for a museum-quality finish." },
  { id: "3", name: "Oxblood Monk", price: 21999, image: shoe3, color: "Burgundy", category: "Monk Strap", description: "Double monk strap in deep oxblood burgundy. Hand-polished brass buckles and a sleek silhouette make this a boardroom essential." },
  { id: "4", name: "Chelsea Bordeaux", price: 16999, image: shoe4, color: "Brown", category: "Chelsea Boot", description: "The ultimate statement boot. Premium pull-up leather in dark bordeaux with elastic side panels and a refined slim profile." },
  { id: "5", name: "Midnight Loafer", price: 13999, image: shoe5, color: "Navy", category: "Loafer", description: "Effortless Italian sophistication. Deep midnight leather penny loafer with hand-stitched apron and butter-soft calfskin lining." },
  { id: "6", name: "Sahara Chukka", price: 15999, image: shoe6, color: "Tan", category: "Chukka Boot", description: "Desert-inspired elegance in premium suede. The Sahara Chukka features a two-eyelet design, leather sole, and a silhouette that bridges casual and formal." },
];

export const baseModels = [
  { id: "oxford", name: "Oxford", image: shoe1 },
  { id: "brogue", name: "Brogue", image: shoe2 },
  { id: "monk", name: "Monk Strap", image: shoe3 },
  { id: "chelsea", name: "Chelsea", image: shoe4 },
];

export const leatherColors = [
  { name: "Jet Black", value: "#1a1a1a" },
  { name: "Dark Brown", value: "#3B2314" },
  { name: "Cognac", value: "#8B4513" },
  { name: "Oxblood", value: "#4A0E0E" },
  { name: "Tan", value: "#C68E5B" },
  { name: "Midnight Navy", value: "#1B2638" },
  { name: "Olive", value: "#3D3B2F" },
  { name: "Ivory", value: "#F0E6D3" },
];

export const testimonials = [
  { name: "Arjun M.", role: "CEO, TechVenture", text: "CuzAura shoes are the finest I've ever owned. The craftsmanship is on par with Italian houses charging three times the price. Every stitch speaks quality.", rating: 5 },
  { name: "Priya K.", role: "Fashion Editor", text: "In my 15 years reviewing luxury footwear, CuzAura stands out. The bespoke service is exceptional, and the leather quality is world-class.", rating: 5 },
  { name: "Vikram S.", role: "Entrepreneur", text: "I've ordered four pairs now. Each one feels like it was made just for me. The attention to detail is something you won't find anywhere else at this price.", rating: 5 },
  { name: "Rahul D.", role: "Senior Advocate", text: "From the courtroom to evening events, my CuzAura oxfords never fail to impress. The patina they develop over time is simply beautiful.", rating: 5 },
];

export const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
