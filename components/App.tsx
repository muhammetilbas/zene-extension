import { useEffect, useState, type ReactNode } from "react";
import { browser } from "wxt/browser";
import type { ReadinessOk } from "@/lib/readiness-types";
import { fetchReadiness } from "@/lib/api";
import { ReadinessTab } from "./ReadinessTab";
import { ReadinessSkeleton } from "./ReadinessSkeleton";
import { AiVisibilityTab } from "./AiVisibilityTab";
import { LINKS, openTab } from "@/lib/constants";

type Scan =
  | { kind: "loading" }
  | { kind: "unsupported" }
  | { kind: "rate_limited"; retryAfter: number; domain: string }
  | { kind: "error"; message: string; domain: string }
  | { kind: "done"; result: ReadinessOk; domain: string };

type TabKey = "readiness" | "visibility";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

async function runScan(): Promise<Scan> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url || !/^https?:\/\//i.test(tab.url)) {
    return { kind: "unsupported" };
  }
  // Send only the ORIGIN, never the full URL — the API scores the site at
  // origin level, so the path/query (which can carry tokens or private data)
  // never leaves the browser.
  let origin: string;
  try {
    origin = new URL(tab.url).origin;
  } catch {
    return { kind: "unsupported" };
  }
  const domain = hostOf(origin);
  const outcome = await fetchReadiness(origin);
  if (outcome.kind === "ok") return { kind: "done", result: outcome.result, domain };
  if (outcome.kind === "rate_limited")
    return { kind: "rate_limited", retryAfter: outcome.retryAfter, domain };
  return { kind: "error", message: outcome.message, domain };
}

export function App() {
  const [scan, setScan] = useState<Scan>({ kind: "loading" });
  const [tab, setTab] = useState<TabKey>("readiness");

  useEffect(() => {
    runScan().then(setScan);
  }, []);

  const domain = scan.kind === "loading" || scan.kind === "unsupported" ? "" : scan.domain;

  function retry() {
    setScan({ kind: "loading" });
    runScan().then(setScan);
  }

  return (
    <div className="bg-app text-ink-1">
      <Header />

      <nav className="flex border-b border-line">
        <TabButton active={tab === "readiness"} onClick={() => setTab("readiness")}>
          Readiness
        </TabButton>
        <TabButton active={tab === "visibility"} onClick={() => setTab("visibility")}>
          AI Visibility
        </TabButton>
      </nav>

      {tab === "readiness" ? (
        <ReadinessBody scan={scan} onRetry={retry} />
      ) : (
        <AiVisibilityTab domain={domain} />
      )}

      <Footer />
    </div>
  );
}

function ReadinessBody({ scan, onRetry }: { scan: Scan; onRetry: () => void }) {
  if (scan.kind === "loading") return <ReadinessSkeleton />;

  if (scan.kind === "unsupported")
    return <Centered>Open any website (http/https) and click the Zene icon to check it.</Centered>;

  if (scan.kind === "rate_limited")
    return (
      <Centered>
        Too many checks — try again in {scan.retryAfter}s.
        <button onClick={onRetry} className="mt-2 text-brand-ink underline">
          Retry
        </button>
      </Centered>
    );

  if (scan.kind === "error")
    return (
      <Centered>
        {scan.message}
        <div className="mt-3 flex flex-col items-center gap-2">
          <button onClick={onRetry} className="text-brand-ink underline">
            Try again
          </button>
          {scan.domain && (
            <button
              onClick={() => openTab(LINKS.checker(scan.domain, "error_fallback"))}
              className="text-[12px] text-ink-4 underline"
            >
              Open the full checker on Zene
            </button>
          )}
        </div>
      </Centered>
    );

  return <ReadinessTab domain={scan.domain} result={scan.result} />;
}

function Header() {
  return (
    <header className="flex items-center gap-2 border-b border-line px-4 py-3">
      <span className="text-[15px] font-bold tracking-tight text-ink-0">Zene</span>
      <span className="eyebrow ml-auto">AI Visibility Checker</span>
    </header>
  );
}

function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-line px-4 py-2.5">
      <span className="text-[11px] text-ink-4">Free · no signup</span>
      <button
        onClick={() => openTab(LINKS.home())}
        className="text-[11px] font-semibold text-ink-3 underline-offset-2 hover:underline"
      >
        tryzene.com
      </button>
    </footer>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2.5 text-[13px] font-semibold transition ${
        active
          ? "border-b-2 border-brand text-ink-0"
          : "border-b-2 border-transparent text-ink-4 hover:text-ink-2"
      }`}
    >
      {children}
    </button>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center px-6 py-8 text-center text-[13px] text-ink-3">
      {children}
    </div>
  );
}
