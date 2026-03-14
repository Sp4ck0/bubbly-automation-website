import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/bubbly-automation/",
  resolve: {
    alias: {
      "@convex": path.resolve(__dirname, "src/_generated"),
    },
  },
});
