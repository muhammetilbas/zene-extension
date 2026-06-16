// Single source of truth for outbound links. Everything points at our own
// domain (Web Store links are nofollow) and carries UTM so we can see what the
// extension drives. The /free-ai-checker landing is where "see the full picture"
// conversion happens.

export const SITE_URL = "https://tryzene.com";

export function zeneUrl(path: string, campaign: string): string {
  const base = `${SITE_URL}${path}`;
  const params = new URLSearchParams({
    utm_source: "extension",
    utm_medium: "popup",
    utm_campaign: campaign,
  });
  return `${base}?${params.toString()}`;
}

export const LINKS = {
  freeChecker: (campaign: string) => zeneUrl("/free-ai-checker", campaign),
  signup: () => zeneUrl("/signup", "extension_cta"),
  home: () => zeneUrl("/", "extension_footer"),
};

import { browser } from "wxt/browser";

export function openTab(url: string): void {
  if (browser?.tabs?.create) {
    browser.tabs.create({ url });
  } else {
    window.open(url, "_blank", "noopener");
  }
}
