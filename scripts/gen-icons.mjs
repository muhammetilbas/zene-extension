// Generate public/icon/{16,32,48,96,128}.png from the master logo
// (scripts/icon-source.png, 128×128) using macOS `sips`. The master lives
// outside public/ so it is NOT bundled into the shipped extension; it is the
// single source of truth for the toolbar / Web Store icon.
// Run: node scripts/gen-icons.mjs
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SRC = join(HERE, "icon-source.png");
const OUT = join(ROOT, "public", "icon");

if (!existsSync(SRC)) {
  console.error("Missing master logo at public/icon-source.png");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

for (const size of [16, 32, 48, 96, 128]) {
  const dest = join(OUT, `${size}.png`);
  copyFileSync(SRC, dest);
  execFileSync("sips", ["-z", String(size), String(size), dest], { stdio: "ignore" });
  console.log(`icon/${size}.png`);
}
