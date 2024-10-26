import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./index.html",
  },
  source: {
    alias: {
      "@": "./src/",
    },
    entry: {
      index: "./src/app.jsx",
    },
  },
});
