import { build } from "esbuild";
import { appendFileSync } from "fs";

const LOG_FILE = "build.log";

const catchBuildLog = (message) => {
  const timestamp = new Date().toISOString();
  appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
};

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.min.mjs",
  bundle: true,
  minify: true,
  keepNames: true,
  sourcemap: false,
  format: "esm",
  target: "esnext",
  platform: "browser",
})
  .then(() => {
    const successMsg = "🔥 QuickSnap build successful!";
    console.log(successMsg);
    catchBuildLog(successMsg);
  })
  .catch((error) => {
    const errorMsg = `❌ QuickSnap build failed: ${error}`;
    console.error(errorMsg);
    catchBuildLog(errorMsg);
    process.exit(1);
  });
