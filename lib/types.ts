// Shared types for the readiness audit. Mirrors PEEX
// supabase/functions/run-scan/site-health-checks.ts so the two stay in lockstep.

export type CheckStatus = "passed" | "warning" | "blocked" | "unchecked";
export type CheckKey = "ai_bots" | "firewall" | "llms_txt" | "schema" | "js_render";

export interface SiteCheck {
  key: CheckKey;
  status: CheckStatus;
  params?: Record<string, unknown>;
}

/** Raw, un-analyzed probe gathered INSIDE the page (same-origin fetches). */
export interface RawProbe {
  origin: string;
  robots: { status: number; body: string } | null;
  home: { status: number; body: string } | null;
  llms: { ok: boolean; status: number } | null;
}
