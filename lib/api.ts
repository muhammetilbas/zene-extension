import { API_BASE } from "./constants";
import type { ReadinessResult } from "./readiness-types";

// Thin client over Zene's public, no-auth, rate-limited readiness API — the SAME
// endpoint the tryzene.com tool uses, so the extension's score is identical to
// the web's (one source of truth). Called from the popup (an extension page)
// which holds host_permissions for tryzene.com, so the cross-origin request is
// privileged and not subject to CORS.

export type ApiOutcome =
  | { kind: "ok"; result: Extract<ReadinessResult, { ok: true }> }
  | { kind: "rate_limited"; retryAfter: number }
  | { kind: "error"; message: string };

export async function fetchReadiness(url: string): Promise<ApiOutcome> {
  const endpoint = `${API_BASE}/api/tools/ai-readiness`;
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch (e) {
    console.error("[Zene] fetch threw for", endpoint, e);
    return { kind: "error", message: `Couldn’t reach Zene (${(e as Error).message}).` };
  }

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("Retry-After") ?? "60") || 60;
    return { kind: "rate_limited", retryAfter };
  }

  // Read as text first so a non-JSON body (e.g. a Cloudflare/WAF challenge page)
  // becomes a diagnosable message instead of a silent "unexpected response".
  const text = await res.text().catch(() => "");
  let data: ReadinessResult | null = null;
  try {
    data = JSON.parse(text) as ReadinessResult;
  } catch {
    console.error("[Zene] non-JSON response", res.status, text.slice(0, 1000));
    const snippet = text.replace(/\s+/g, " ").trim().slice(0, 80);
    return {
      kind: "error",
      message: `Zene returned ${res.status}, not JSON${snippet ? `: ${snippet}…` : "."}`,
    };
  }

  if (data && data.ok) return { kind: "ok", result: data };
  const err = data && data.ok === false ? data.error : `Zene returned ${res.status}.`;
  return { kind: "error", message: err };
}
