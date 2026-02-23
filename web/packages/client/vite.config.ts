import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const libName = "RadComponents";

function copyToResources() {
  const generatedResourcesDir = path.resolve(
    __dirname,
    "../..",
    "build/generated-resources/mounted/"
  );

  const jsFrom = path.resolve(__dirname, "dist", `${libName}.js`);
  const cssFrom = path.resolve(__dirname, "dist", `${libName}.css`);

  const jsTo = path.resolve(generatedResourcesDir, `${libName}.js`);
  const cssTo = path.resolve(generatedResourcesDir, `${libName}.css`);

  fs.mkdirSync(generatedResourcesDir, { recursive: true });

  if (fs.existsSync(jsFrom)) {
    fs.copyFileSync(jsFrom, jsTo);
  }

  if (fs.existsSync(cssFrom)) {
    fs.copyFileSync(cssFrom, cssTo);
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
      cssCodeSplit: false,
      lib: {
        entry: path.resolve(__dirname, "typescript/rad-client-components.ts"),
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
        ],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            mobx: "mobx",
            "mobx-react": "mobxReact",
            "@inductiveautomation/perspective-client": "PerspectiveClient",
          },
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name ?? "";
            if (name.endsWith(".css")) {
              return `${libName}[extname]`;
            }
            return "assets/[name][extname]";
          },
        },
      },
    },
  };
});
