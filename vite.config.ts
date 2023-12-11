import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

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
  },
});
