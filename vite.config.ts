import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      "^/.*\\.php$": "http://localhost:8080",
      "/assets/uploaded": "http://localhost:8080",
    },
  },
  // Tailwind v4 runs via the Vite plugin above, not PostCSS — pass an empty
  // config so Vite doesn't walk up parent directories looking for one (a
  // stray postcss.config.js outside this project was otherwise picked up).
  css: {
    postcss: {},
  },
});
