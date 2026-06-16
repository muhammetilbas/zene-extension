import { defineWebExtConfig } from "wxt";
import { homedir } from "node:os";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// This machine has no normal Chrome/Brave/Edge installed, but puppeteer has
// already downloaded a "Google Chrome for Testing" build. Point WXT's dev
// launcher at it so `npm run dev` auto-opens the extension with HMR. If it ever
// disappears (or you install a real browser), set CHROME_PATH or just delete
// this file. When nothing is found we disable auto-open instead of crashing —
// you can still load .output/chrome-mv3-dev unpacked manually.

function findChromeForTesting(): string | undefined {
  const base = join(homedir(), ".cache", "puppeteer", "chrome");
  if (!existsSync(base)) return undefined;
  // Newest version dir first (e.g. "mac_arm-149.0.7827.22").
  const versions = readdirSync(base)
    .filter((d) => d.startsWith("mac"))
    .sort()
    .reverse();
  for (const v of versions) {
    for (const arch of ["chrome-mac-arm64", "chrome-mac-x64"]) {
      const bin = join(
        base,
        v,
        arch,
        "Google Chrome for Testing.app",
        "Contents",
        "MacOS",
        "Google Chrome for Testing",
      );
      if (existsSync(bin)) return bin;
    }
  }
  return undefined;
}

const chrome = process.env.CHROME_PATH || findChromeForTesting();

export default defineWebExtConfig(
  chrome ? { binaries: { chrome } } : { disabled: true },
);
