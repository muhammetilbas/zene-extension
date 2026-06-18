import { browser } from "wxt/browser";

// Single source of truth for the Zene origin + outbound links.
//
// API_BASE is where the public readiness API lives. To develop against a local
// PEEX (`npm run dev` on :3000), set VITE_ZENE_BASE=http://localhost:3000 and add
// that host to host_permissions in wxt.config.ts.
export const SITE_URL = "https://tryzene.com";
const ENV = import.meta.env as unknown as Record<string, string | undefined>;
export const API_BASE = ENV.VITE_ZENE_BASE || SITE_URL;

function withUtm(url: string, campaign: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "extension");
  u.searchParams.set("utm_medium", "popup");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

export const LINKS = {
  /** The web tool — auto-runs the full report via ?url=. The seamless handoff. */
  checker: (domain: string, campaign: string) =>
    withUtm(`${SITE_URL}/tools/ai-visibility-checker?url=${encodeURIComponent(domain)}`, campaign),
  /** A check's fix deep-link (e.g. /tools/llms-txt-generator), absolutized. */
  fix: (fixHref: string) =>
    withUtm(fixHref.startsWith("http") ? fixHref : `${SITE_URL}${fixHref}`, "readiness_fix"),
  signup: () => withUtm(`${SITE_URL}/signup`, "extension_cta"),
  home: () => withUtm(`${SITE_URL}/`, "extension_footer"),
};

export function openTab(url: string): void {
  if (browser?.tabs?.create) {
    browser.tabs.create({ url });
  } else {
    window.open(url, "_blank", "noopener");
  }
}
