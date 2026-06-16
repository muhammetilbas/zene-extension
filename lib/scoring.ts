import type { CheckKey, CheckStatus, SiteCheck } from "./types";

// Turn structured checks into a single 0–100 GEO Readiness score.
//
// Weights reflect how much each signal actually gates whether an AI engine can
// read & represent a brand. ai_bots is dominant: if GPTBot/ClaudeBot is blocked,
// nothing else matters. "unchecked" checks are EXCLUDED from the denominator —
// we never penalize a site for something we couldn't measure.
export const WEIGHTS: Record<CheckKey, number> = {
  ai_bots: 35,
  schema: 20,
  js_render: 20,
  llms_txt: 15,
  firewall: 10,
};

const FRACTION: Record<Exclude<CheckStatus, "unchecked">, number> = {
  passed: 1,
  warning: 0.4,
  blocked: 0,
};

export type Tone = "ok" | "watch" | "bad";

export interface ScoreResult {
  score: number;
  grade: string;
  tone: Tone;
  measured: number; // how many checks contributed (non-unchecked)
  total: number; // total checks
}

export function scoreFromChecks(checks: SiteCheck[]): ScoreResult {
  let earned = 0;
  let max = 0;
  let measured = 0;
  for (const c of checks) {
    if (c.status === "unchecked") continue;
    measured++;
    const w = WEIGHTS[c.key];
    max += w;
    earned += w * FRACTION[c.status];
  }
  const score = max ? Math.round((earned / max) * 100) : 0;
  const { grade, tone } = gradeFor(score, measured);
  return { score, grade, tone, measured, total: checks.length };
}

function gradeFor(score: number, measured: number): { grade: string; tone: Tone } {
  if (measured === 0) return { grade: "Not measurable", tone: "watch" };
  if (score >= 80) return { grade: "Strong", tone: "ok" };
  if (score >= 50) return { grade: "Needs work", tone: "watch" };
  return { grade: "At risk", tone: "bad" };
}

/** Order checks for display + fixes: worst-status first, then by weight. */
export function rankChecks(checks: SiteCheck[]): SiteCheck[] {
  const statusRank: Record<CheckStatus, number> = {
    blocked: 0,
    warning: 1,
    unchecked: 2,
    passed: 3,
  };
  return [...checks].sort(
    (a, b) =>
      statusRank[a.status] - statusRank[b.status] || WEIGHTS[b.key] - WEIGHTS[a.key],
  );
}

/** The actionable subset: anything not passing, worst first (for the Fixes list). */
export function fixesFrom(checks: SiteCheck[]): SiteCheck[] {
  return rankChecks(checks).filter(
    (c) => c.status === "blocked" || c.status === "warning",
  );
}
