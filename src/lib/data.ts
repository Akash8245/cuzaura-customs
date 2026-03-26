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
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: ShoeCustomization;
}

export interface ShoeCustomization {
  baseModel: string;
  bodyColor: string;
  soleColor: string;
  laceColor: string;
  text?: string;
}

export const products: Product[] = [
  { id: "1", name: "Aura Runner", price: 189, image: shoe1, color: "Blue", description: "Stealth meets speed. The Aura Runner features a breathable mesh upper with neon blue accents and a responsive cushion sole." },
  { id: "2", name: "Violet Flux", price: 219, image: shoe2, color: "Purple", description: "Command attention with the Violet Flux. A bold purple gradient upper with cloud-like comfort and futuristic design." },
  { id: "3", name: "Crimson Blaze", price: 199, image: shoe3, color: "Red", description: "Ignite your style with the Crimson Blaze. High-top silhouette with premium red leather and aggressive stance." },
  { id: "4", name: "Neon Surge", price: 179, image: shoe4, color: "Green", description: "Electric energy in every step. The Neon Surge features transparent sole technology with vibrant green highlights." },
  { id: "5", name: "Shadow Elite", price: 249, image: shoe5, color: "Black", description: "The ultimate stealth shoe. All-black premium leather with subtle gold details for those who lead from the shadows." },
  { id: "6", name: "Rose Wave", price: 199, image: shoe6, color: "Pink", description: "Soft power meets bold design. The Rose Wave combines pink satin-finish uppers with a clean white platform sole." },
];

export const baseModels = [
  { id: "runner", name: "Runner", image: shoe1 },
  { id: "high-top", name: "High Top", image: shoe3 },
  { id: "platform", name: "Platform", image: shoe4 },
  { id: "classic", name: "Classic", image: shoe5 },
];

export const colorOptions = [
  { name: "Obsidian Black", value: "#1a1a2e" },
  { name: "Neon Purple", value: "#8B5CF6" },
  { name: "Electric Blue", value: "#3B82F6" },
  { name: "Crimson Red", value: "#EF4444" },
  { name: "Neon Green", value: "#22C55E" },
  { name: "Hot Pink", value: "#EC4899" },
  { name: "Pure White", value: "#F8FAFC" },
  { name: "Sunset Orange", value: "#F97316" },
  { name: "Gold", value: "#EAB308" },
  { name: "Silver", value: "#94A3B8" },
];

export const testimonials = [
  { name: "Alex M.", text: "CuzAura shoes are literally the only ones I get compliments on every single time. The customization is next level.", rating: 5 },
  { name: "Jordan K.", text: "Finally a brand that gets Gen Z. The quality is insane and the design process was so fun.", rating: 5 },
  { name: "Sam T.", text: "Wore my custom CuzAuras to a festival and everyone was asking where I got them. Absolute fire 🔥", rating: 5 },
];
