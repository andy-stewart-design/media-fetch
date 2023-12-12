import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { Features } from "lightningcss";

const root = resolve(__dirname, "src", "app");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  plugins: [react(), viteSingleFile()],
  build: {
    outDir,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
      },
    },
    cssMinify: "lightningcss",
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      include: Features.Nesting,
      drafts: {
        customMedia: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
