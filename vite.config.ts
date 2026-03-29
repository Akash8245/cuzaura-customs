import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk
          if (id.includes("node_modules")) {
            if (id.includes("@radix-ui")) return "radix-ui";
            if (id.includes("framer-motion")) return "framer-motion";
            if (id.includes("react")) return "react-vendor";
            if (id.includes("supabase")) return "supabase";
            return "vendor";
          }
        },
      },
    },
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "zustand",
      "@supabase/supabase-js",
      "framer-motion",
    ],
  },
}));
