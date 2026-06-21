// Rasterize public/icon.svg → public/icon/{16,32,48,96,128}.png using a real
// browser renderer (so the periwinkle gradient + "z" glyph come out pixel-perfect;
// ImageMagick's internal SVG renderer mangles the gradient). Uses the puppeteer
// "Chrome for Testing" build (or $CHROME_PATH). Run: node scripts/gen-icons.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG = readFileSync(join(ROOT, "public", "icon.svg"), "utf8");
const OUT = join(ROOT, "public", "icon");
mkdirSync(OUT, { recursive: true });

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const base = join(homedir(), ".cache", "puppeteer", "chrome");
  if (!existsSync(base)) return null;
  for (const v of readdirSync(base).filter((d) => d.startsWith("mac")).sort().reverse()) {
    for (const arch of ["chrome-mac-arm64", "chrome-mac-x64"]) {
      const bin = join(base, v, arch, "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing");
      if (existsSync(bin)) return bin;
    }
  }
  return null;
}

const chrome = findChrome();
if (!chrome) {
  console.error("No Chrome found. Set CHROME_PATH to a Chromium binary.");
  process.exit(1);
}

for (const size of [16, 32, 48, 96, 128]) {
  const svg = SVG.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`);
  const html = join(tmpdir(), `zene-icon-${size}.html`);
  writeFileSync(
    html,
    `<!doctype html><html><head><meta charset=utf-8><style>html,body{margin:0;padding:0}svg{display:block}</style></head><body>${svg}</body></html>`,
  );
  execFileSync(chrome, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--default-background-color=00000000",
    `--window-size=${size},${size}`,
    `--screenshot=${join(OUT, `${size}.png`)}`,
    html,
  ]);
  console.log(`icon/${size}.png`);
}
