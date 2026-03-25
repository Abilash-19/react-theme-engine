import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    external: ["react", "react-dom"],
    treeshake: true,
    splitting: false,
  },
  {
    entry: ["src/tailwind/plugin.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "dist/tailwind",
    minify: true,
    external: ["react", "react-dom"],
    treeshake: true,
    splitting: false,
  },
]);
