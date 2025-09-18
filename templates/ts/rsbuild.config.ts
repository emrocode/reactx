import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  environments: {
    web: {
      source: {
        entry: {
          index: "./src/app.tsx",
        },
      },
      plugins: [pluginReact()],
    },
  },
  html: {
    template: "./index.html",
  },
});
