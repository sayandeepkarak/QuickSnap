import { build } from "esbuild";
import { appendFileSync, rmSync } from "fs";

const LOG_FILE = "build.log";

const catchBuildLog = (message) => {
  const timestamp = new Date().toISOString();
  appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
};

rmSync("dist", { recursive: true, force: true });

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/QuickSnap.min.mjs",
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "esm",
  target: "esnext",
  platform: "browser",
})
  .then(() => {
    const successMsg = "🔥 QuickSnap build successfull!";
    console.log(successMsg);
    catchBuildLog(successMsg);
  })
  .catch((error) => {
    const errorMsg = `❌ QuickSnap failed:, ${error}`;
    console.error(errorMsg);
    catchBuildLog(errorMsg);
    process.exit(1);
  });
