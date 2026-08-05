import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// URL.pathname is percent-encoded, so a project path containing spaces yields an
// alias target that does not exist on disk. Decoding it back is what makes the
// alias resolvable.
const srcPath = decodeURIComponent(new URL("./src", import.meta.url).pathname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
});
