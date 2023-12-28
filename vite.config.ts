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
      drafts: {
        customMedia: true,
      },
      include: Features.Nesting,
    },
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "src"),
      "@plugin": resolve(__dirname, "src", "plugin"),
      "@utils": resolve(__dirname, "src", "utils"),
      "@types": resolve(__dirname, "src", "types"),
      "@app": resolve(__dirname, "src", "app"),
      "@components": resolve(__dirname, "src", "app", "components"),
      "@styles": resolve(__dirname, "src", "app", "styles"),
    },
  },
});
