import { build } from "esbuild";
import { appendFileSync } from "fs";

const LOG_FILE = "build.log";

const catchBuildLog = (message) => {
  const timestamp = new Date().toISOString();
  appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
};

function runBuild(otherOptions) {
  return build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    keepNames: false,
    sourcemap: false,
    target: "esnext",
    platform: "node",
    ...otherOptions,
  });
}

// Build ESM & CJS
Promise.all([
  runBuild({
    outfile: "dist/index.min.mjs",
    format: "esm",
  }),
  runBuild({
    outfile: "dist/index.min.cjs",
    format: "cjs",
  }),
])
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
