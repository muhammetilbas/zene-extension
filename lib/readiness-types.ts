// Mirror of PEEX src/lib/tools/ai-readiness-types.ts — kept in lockstep so the
// extension renders exactly what /api/tools/ai-readiness returns. No runtime
// logic beyond the pure helpers (safe, dependency-free). If the API's shape
// changes, update this file to match.

export type EngineId = "chatgpt" | "claude" | "gemini" | "perplexity" | "grok";

export type CheckStatus = "pass" | "warn" | "fail";
export type CheckSeverity = "critical" | "medium" | "minor";

export type ReadinessCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  fixHref?: string;
  fixLabel?: string;
  severity?: CheckSeverity;
  impact?: number;
};

export type EngineReadinessStatus = "ok" | "warn" | "blocked" | "unchecked";

export type EngineReadiness = {
  id: EngineId;
  label: string;
  status: EngineReadinessStatus;
  reason: string;
};

export type DimensionKey = "access" | "understand" | "cite";

export type ReadinessDimension = {
  key: DimensionKey;
  label: string;
  score: number; // 0-100
};

export type ReadinessBand = "excellent" | "good" | "needs-work" | "at-risk";

export type ReadinessOk = {
  ok: true;
  url: string;
  score: number; // 0-100 overall
  band: ReadinessBand;
  dimensions: ReadinessDimension[];
  checks: ReadinessCheck[];
  engines?: EngineReadiness[];
};

export type ReadinessResult = ReadinessOk | { ok: false; error: string };

export const BAND_LABEL: Record<ReadinessBand, string> = {
  excellent: "Excellent",
  good: "Good",
  "needs-work": "Needs work",
  "at-risk": "At risk",
};

export function letterFor(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}
