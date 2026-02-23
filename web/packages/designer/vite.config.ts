import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const libName = "RadDesignComponents";

function copyToResources() {
  const generatedResourcesDir = path.resolve(
    __dirname,
    "../..",
    "build/generated-resources/mounted/"
  );

  const jsFrom = path.resolve(__dirname, "dist", `${libName}.js`);
  const jsTo = path.resolve(generatedResourcesDir, `${libName}.js`);

  fs.mkdirSync(generatedResourcesDir, { recursive: true });

  if (fs.existsSync(jsFrom)) {
    fs.copyFileSync(jsFrom, jsTo);
  }
}

export default defineConfig(({ mode }) => {
  const isDev = mode !== "production";

  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(isDev ? "development" : "production"),
    },
    plugins: [
      react(),
      {
        name: "copy-to-generated-resources",
        closeBundle() {
          copyToResources();
        },
      },
    ],

    build: {
      outDir: "dist",
      sourcemap: isDev,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(__dirname, "typescript/rad-designer-components.ts"),
        name: libName,
        formats: ["iife"],
        fileName: () => `${libName}.js`,
      },
      rollupOptions: {
        external: [
          "react",
          "react-dom",
          "mobx",
          "mobx-react",
          "@inductiveautomation/perspective-client",
          "@inductiveautomation/perspective-designer",
        ],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            mobx: "mobx",
            "mobx-react": "mobxReact",
            "@inductiveautomation/perspective-client": "PerspectiveClient",
            "@inductiveautomation/perspective-designer": "PerspectiveDesigner",
          },
        },
      },
    },
  };
});
