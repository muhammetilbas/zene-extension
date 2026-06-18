import { API_BASE } from "./constants";
import type { ReadinessOk, ReadinessResult } from "./readiness-types";

// Thin client over Zene's public, no-auth, rate-limited readiness API — the SAME
// endpoint the tryzene.com tool uses, so the extension's score is identical to
// the web's (one source of truth). Called from the popup (an extension page)
// which holds host_permissions for tryzene.com, so the cross-origin request is
// privileged and not subject to CORS.

export type ApiOutcome =
  | { kind: "ok"; result: ReadinessOk }
  | { kind: "rate_limited"; retryAfter: number }
  | { kind: "error"; message: string };

export async function fetchReadiness(url: string): Promise<ApiOutcome> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/tools/ai-readiness`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    return { kind: "error", message: "Couldn’t reach Zene. Check your connection." };
  }

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("Retry-After") ?? "60") || 60;
    return { kind: "rate_limited", retryAfter };
  }

  const data = (await res.json().catch(() => null)) as ReadinessResult | null;
  if (!data) return { kind: "error", message: "Unexpected response from Zene." };
  if (data.ok) return { kind: "ok", result: data };
  return { kind: "error", message: data.error };
}
