import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

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
      "@": path.join(projectRoot, "src"),
    },
  })
  .catch(() => process.exit(1));
