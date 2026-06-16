import type { RawProbe } from "./types";

// probeInPage — runs INSIDE the active tab via chrome.scripting.executeScript.
//
// CRITICAL: this function is serialized (.toString()) and injected, so it MUST be
// fully self-contained — no imports, no closures over module scope, no helpers
// from outside its own body. Because it executes in the page's origin, all three
// fetches are SAME-ORIGIN and need no host_permissions (activeTab is enough).
//
// It returns only raw data; the analysis (lib/site-health.ts) runs back in the
// popup. We fetch the ORIGIN ROOT, not the current URL — readiness is a
// site-level signal (robots.txt + homepage + llms.txt).
export async function probeInPage(): Promise<RawProbe> {
  const origin = location.origin;

  const fetchText = async (
    url: string,
    method: "GET" | "HEAD" = "GET",
    timeoutMs = 6000,
  ): Promise<{ ok: boolean; status: number; body: string } | null> => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { method, redirect: "follow", signal: ctrl.signal });
      const body = method === "GET" ? await res.text().catch(() => "") : "";
      return { ok: res.ok, status: res.status, body: body.slice(0, 200_000) };
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  const [robots, home, llms] = await Promise.all([
    fetchText(`${origin}/robots.txt`),
    fetchText(`${origin}/`),
    fetchText(`${origin}/llms.txt`, "HEAD"),
  ]);

  return {
    origin,
    robots: robots ? { status: robots.status, body: robots.body } : null,
    home: home ? { status: home.status, body: home.body } : null,
    llms: llms ? { ok: llms.ok, status: llms.status } : null,
  };
}
