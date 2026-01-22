import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import * as esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// Ensure dist directory exists
const distDir = path.join(projectRoot, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read and compile CSS
async function compileCss() {
  const inputCssPath = path.join(projectRoot, "src/styles/index.css");
  const outputCssPath = path.join(projectRoot, "dist/index.css");

  try {
    const cssContent = fs.readFileSync(inputCssPath, "utf-8");

    const result = await postcss([
      tailwindcss(path.join(projectRoot, "tailwind.config.js")),
      autoprefixer(),
    ]).process(cssContent, { from: inputCssPath, to: outputCssPath });

    fs.writeFileSync(outputCssPath, result.css);
    console.log("✅ CSS compiled successfully");
  } catch (error) {
    console.error("❌ CSS compilation error:", error.message);
  }
}

// Bundle JSX with esbuild
async function bundleJs() {
  try {
    await esbuild.build({
      entryPoints: [path.join(projectRoot, "src/main.jsx")],
      bundle: true,
      outfile: path.join(projectRoot, "dist/main.js"),
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
      },
      jsx: "automatic",
      alias: {
        "@": path.join(projectRoot, "src"),
      },
      resolveExtensions: [".jsx", ".js", ".json"],
    });
    console.log("✅ JavaScript bundled successfully");
  } catch (error) {
    console.error("❌ JavaScript bundling error:", error.message);
  }
}

// Initial compilation
await compileCss();
await bundleJs();

// Watch for CSS changes
console.log("🎨 Watching for CSS changes...");
fs.watch(path.join(projectRoot, "src/styles"), { recursive: true }, () => {
  compileCss();
});

// Watch for JS changes
console.log("📦 Watching for JS changes...");
fs.watch(
  path.join(projectRoot, "src"),
  { recursive: true },
  (eventType, filename) => {
    if (filename && (filename.endsWith(".jsx") || filename.endsWith(".js"))) {
      bundleJs();
    }
  },
);

// Also watch tailwind config
fs.watch(path.join(projectRoot, "tailwind.config.js"), () => {
  compileCss();
});

// Serve files
const server = http.createServer((req, res) => {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(projectRoot, filePath);

  // Handle .jsx files - serve as is (browser will handle JSX through dynamic import or bundler)
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      res.end("404 Not found");
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    const ext = path.extname(filePath);
    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".jsx": "application/javascript; charset=utf-8",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".gif": "image/gif",
      ".woff2": "font/woff2",
    };

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("500 Server error");
        return;
      }

      res.writeHead(200, {
        "Content-Type": contentTypes[ext] || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(data);
    });
  });
});

const PORT = 5173;
server.listen(PORT, () => {
  console.log(`\n✅ Dev server running at http://localhost:${PORT}\n`);
});
