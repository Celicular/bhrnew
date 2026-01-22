import esbuild from "esbuild";
import path from "path";
import fs from "fs";

// Use process.cwd() for reliable project root detection
const projectRoot = process.cwd();
const srcPath = path.resolve(projectRoot, "src");

console.log("Project root:", projectRoot);
console.log("Source path:", srcPath);

esbuild
  .build({
    entryPoints: [path.join(projectRoot, "src", "main.jsx")],
    bundle: true,
    outfile: path.join(projectRoot, "dist", "main.js"),
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
    const indexHtmlPath = path.join(projectRoot, "index.html");
    const distIndexPath = path.join(projectRoot, "dist", "index.html");

    fs.copyFileSync(indexHtmlPath, distIndexPath);
    console.log("✓ Copied index.html to dist/");
  })
  .catch(() => process.exit(1));
