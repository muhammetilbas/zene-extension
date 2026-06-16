// site-health — deterministic, LLM-free readiness analysis.
//
// Ported almost verbatim from PEEX supabase/functions/run-scan/site-health-checks.ts.
// The ONE structural change: fetching is split out. On the server the probe
// fetched robots/home/llms itself; here those fetches happen inside the page
// (see lib/collector.ts, same-origin) and we analyze the RawProbe it returns.
// Pure parsing (parseRobots / isBotBlocked) is kept identical and unit-testable.
//
// Invariant preserved from the original: a fetch failure NEVER yields "blocked",
// it yields "unchecked" — a false "your site is blocked" would destroy the signal.

import type { CheckStatus, RawProbe, SiteCheck } from "./types";

// AI crawlers we care about → the engine each one feeds.
export const AI_BOTS: { ua: string; engine: string }[] = [
  { ua: "GPTBot", engine: "ChatGPT" },
  { ua: "OAI-SearchBot", engine: "ChatGPT" },
  { ua: "ChatGPT-User", engine: "ChatGPT" },
  { ua: "ClaudeBot", engine: "Claude" },
  { ua: "PerplexityBot", engine: "Perplexity" },
  { ua: "Google-Extended", engine: "Gemini" },
];

interface RobotsGroup {
  agents: string[];
  rules: { allow: boolean; path: string }[];
}

/** Parse robots.txt into user-agent groups. Consecutive user-agent lines share
 *  the rule block that follows them (standard grouping). */
export function parseRobots(text: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let cur: RobotsGroup | null = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (field === "user-agent") {
      if (!cur || !lastWasAgent) {
        cur = { agents: [], rules: [] };
        groups.push(cur);
      }
      cur.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (field === "allow" || field === "disallow") {
      if (!cur) {
        cur = { agents: ["*"], rules: [] };
        groups.push(cur);
      }
      cur.rules.push({ allow: field === "allow", path: value });
      lastWasAgent = false;
    } else {
      lastWasAgent = false;
    }
  }
  return groups;
}

/** Is `ua` disallowed from the site root "/"? Most-specific group wins (exact UA
 *  over "*"); for path "/", longest match wins with ties going to Allow. */
export function isBotBlocked(groups: RobotsGroup[], ua: string): boolean {
  const want = ua.toLowerCase();
  const exact = groups.find((g) => g.agents.includes(want));
  const star = groups.find((g) => g.agents.includes("*"));
  const group = exact ?? star;
  if (!group) return false;
  let disallowLen = -1;
  let allowLen = -1;
  for (const r of group.rules) {
    if (r.path === "/") {
      if (r.allow) allowLen = Math.max(allowLen, 1);
      else disallowLen = Math.max(disallowLen, 1);
    }
  }
  return disallowLen > allowLen;
}

const CHALLENGE =
  /just a moment|attention required|cf-browser-verification|cf-challenge|enable javascript and cookies/i;

/** Analyze a RawProbe into structured checks. Mirrors runSiteHealth's body. */
export function analyzeProbe(raw: RawProbe): SiteCheck[] {
  const { robots, home, llms } = raw;
  const checks: SiteCheck[] = [];

  // 1) AI bot blocking (the only check that can be "blocked"/red).
  if (!robots) {
    checks.push({ key: "ai_bots", status: "unchecked" });
  } else if (robots.status === 404 || !robots.body.trim()) {
    checks.push({ key: "ai_bots", status: "passed" }); // no robots = nothing blocked
  } else {
    const groups = parseRobots(robots.body);
    const blocked = AI_BOTS.filter((b) => isBotBlocked(groups, b.ua));
    if (blocked.length) {
      const engines = [...new Set(blocked.map((b) => b.engine))];
      checks.push({
        key: "ai_bots",
        status: "blocked",
        params: { bots: blocked.map((b) => b.ua), engines },
      });
    } else {
      checks.push({ key: "ai_bots", status: "passed" });
    }
  }

  // 2) Firewall / WAF suspicion (warning only — never a hard "blocked").
  if (!home) {
    checks.push({ key: "firewall", status: "unchecked" });
  } else if (home.status === 403 || CHALLENGE.test(home.body)) {
    checks.push({ key: "firewall", status: "warning" });
  } else {
    checks.push({ key: "firewall", status: "passed" });
  }

  // 3) llms.txt existence.
  if (!llms) checks.push({ key: "llms_txt", status: "unchecked" });
  else checks.push({ key: "llms_txt", status: llms.ok ? "passed" : "warning" });

  // 4) Structured data (schema.org JSON-LD) on the homepage.
  if (!home) {
    checks.push({ key: "schema", status: "unchecked" });
  } else {
    const hasLd =
      /application\/ld\+json/i.test(home.body) || /itemscope|itemtype=/i.test(home.body);
    checks.push({ key: "schema", status: hasLd ? "passed" : "warning" });
  }

  // 5) JS-render suspicion: almost no server-rendered text → AI crawlers (which
  //    mostly don't execute JS) may see an empty page.
  if (!home) {
    checks.push({ key: "js_render", status: "unchecked" });
  } else {
    const visible = home.body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    checks.push({ key: "js_render", status: visible.length < 200 ? "warning" : "passed" });
  }

  return checks;
}

export type { CheckStatus };
