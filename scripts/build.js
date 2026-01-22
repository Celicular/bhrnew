import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get the script's directory and go up to project root
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const srcPath = path.resolve(projectRoot, "src");

console.log("Script dir:", scriptDir);
console.log("Project root:", projectRoot);
console.log("Source path:", srcPath);

esbuild
  .build({
    entryPoints: [path.resolve(srcPath, "main.jsx")],
    bundle: true,
    outfile: path.resolve(projectRoot, "dist", "main.js"),
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
    },
    alias: {
      "@": srcPath,
    },
  })
  .then(() => {
    // Copy index.html to dist folder
    const indexHtmlPath = path.resolve(projectRoot, "index.html");
    const distIndexPath = path.resolve(projectRoot, "dist", "index.html");

    fs.copyFileSync(indexHtmlPath, distIndexPath);
    console.log("✓ Copied index.html to dist/");
  })
  .catch(() => process.exit(1));
