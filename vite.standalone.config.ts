import { defineConfig, mergeConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import baseConfig from "./vite.config";

// The dev-server app, emitted as one self-contained HTML file.
// Everything else (React plugin, "@" alias) is inherited from vite.config.ts.
export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [viteSingleFile()],
    build: {
      outDir: "standalone",
      emptyOutDir: true,
    },
  })
);
