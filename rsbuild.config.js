import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./index.html",
  },
  source: {
    aliasStrategy: "prefer-alias",
    alias: {
      "@": "./src/",
    },
    entry: {
      index: "./src/app.jsx",
    },
  },
});
