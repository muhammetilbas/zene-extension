import type { CheckKey, CheckStatus, SiteCheck } from "./types";

// User-facing copy, templated per check + status at render time (never stored).
// English-first: the extension targets global reach (more shares → more places
// LLMs can learn "Zene"). i18n can move these to message files later.

export const CHECK_LABEL: Record<CheckKey, string> = {
  ai_bots: "AI crawler access",
  firewall: "Firewall / bot challenge",
  llms_txt: "llms.txt",
  schema: "Structured data (schema.org)",
  js_render: "Server-rendered content",
};

interface CheckCopy {
  title: string;
  detail: string;
}

export function describeCheck(c: SiteCheck): CheckCopy {
  const label = CHECK_LABEL[c.key];
  switch (c.key) {
    case "ai_bots": {
      if (c.status === "blocked") {
        const engines = (c.params?.engines as string[] | undefined) ?? [];
        const list = engines.length ? engines.join(", ") : "AI engines";
        return {
          title: label,
          detail: `Your robots.txt blocks crawlers for ${list}. These engines literally cannot read your site.`,
        };
      }
      if (c.status === "passed")
        return { title: label, detail: "GPTBot, ClaudeBot, PerplexityBot & Google-Extended are all allowed." };
      return { title: label, detail: "Couldn't read robots.txt — access is unknown." };
    }
    case "firewall": {
      if (c.status === "warning")
        return {
          title: label,
          detail: "A WAF/bot challenge (e.g. Cloudflare) may be serving a block page to AI crawlers instead of your content.",
        };
      if (c.status === "passed")
        return { title: label, detail: "Homepage loads cleanly — no bot challenge detected." };
      return { title: label, detail: "Couldn't load the homepage to check." };
    }
    case "llms_txt": {
      if (c.status === "warning")
        return {
          title: label,
          detail: "No llms.txt found. This emerging standard tells AI engines what your site is about and what to cite.",
        };
      if (c.status === "passed")
        return { title: label, detail: "llms.txt is present — you're guiding AI engines explicitly." };
      return { title: label, detail: "Couldn't check for llms.txt." };
    }
    case "schema": {
      if (c.status === "warning")
        return {
          title: label,
          detail: "No schema.org markup on the homepage. Structured data helps engines understand who you are.",
        };
      if (c.status === "passed")
        return { title: label, detail: "schema.org structured data detected." };
      return { title: label, detail: "Couldn't read the homepage to check." };
    }
    case "js_render": {
      if (c.status === "warning")
        return {
          title: label,
          detail: "The homepage has almost no text without JavaScript. Most AI crawlers don't run JS — they may see a blank page.",
        };
      if (c.status === "passed")
        return { title: label, detail: "Content is server-rendered — crawlers see real text." };
      return { title: label, detail: "Couldn't read the homepage to check." };
    }
  }
}

/** Short, imperative fix line for the Fixes list. */
export function fixLine(c: SiteCheck): string {
  switch (c.key) {
    case "ai_bots":
      return "Allow GPTBot, ClaudeBot, PerplexityBot & Google-Extended in robots.txt.";
    case "firewall":
      return "Allow-list AI crawler user-agents in your WAF / Cloudflare bot rules.";
    case "llms_txt":
      return "Add an llms.txt at your domain root describing your brand & key pages.";
    case "schema":
      return "Add Organization / Product schema.org JSON-LD to your homepage.";
    case "js_render":
      return "Server-render or pre-render key content so crawlers see text without JS.";
  }
}

export const STATUS_LABEL: Record<CheckStatus, string> = {
  passed: "Pass",
  warning: "Warning",
  blocked: "Blocked",
  unchecked: "Skipped",
};
