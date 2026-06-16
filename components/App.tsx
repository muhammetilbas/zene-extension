import { useEffect, useState, type ReactNode } from "react";
import { browser } from "wxt/browser";
import type { RawProbe, SiteCheck } from "@/lib/types";
import { analyzeProbe } from "@/lib/site-health";
import { scoreFromChecks, type ScoreResult } from "@/lib/scoring";
import { probeInPage } from "@/lib/collector";
import { ReadinessTab } from "./ReadinessTab";
import { AiVisibilityTab } from "./AiVisibilityTab";
import { LINKS, openTab } from "@/lib/constants";

type Scan =
  | { kind: "loading" }
  | { kind: "unsupported" }
  | { kind: "error" }
  | { kind: "done"; domain: string; checks: SiteCheck[]; score: ScoreResult };

type TabKey = "readiness" | "visibility";

async function runScan(): Promise<Scan> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url || !/^https?:\/\//i.test(tab.url)) {
    return { kind: "unsupported" };
  }
  try {
    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: probeInPage,
    });
    const raw = results[0]?.result as RawProbe | undefined;
    if (!raw) return { kind: "error" };
    const checks = analyzeProbe(raw);
    const score = scoreFromChecks(checks);
    const domain = new URL(raw.origin).hostname.replace(/^www\./, "");
    return { kind: "done", domain, checks, score };
  } catch {
    // Restricted pages (chrome://, the Web Store, PDF viewer) reject injection.
    return { kind: "unsupported" };
  }
}

export function App() {
  const [scan, setScan] = useState<Scan>({ kind: "loading" });
  const [tab, setTab] = useState<TabKey>("readiness");

  useEffect(() => {
    runScan().then(setScan);
  }, []);

  const domain = scan.kind === "done" ? scan.domain : "";

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
        <ReadinessBody scan={scan} onRetry={() => { setScan({ kind: "loading" }); runScan().then(setScan); }} />
      ) : (
        <AiVisibilityTab domain={domain} />
      )}

      <Footer />
    </div>
  );
}

function ReadinessBody({ scan, onRetry }: { scan: Scan; onRetry: () => void }) {
  if (scan.kind === "loading") return <Centered>Scanning this site…</Centered>;
  if (scan.kind === "unsupported")
    return (
      <Centered>
        Open any website (http/https) and click the Zene icon to scan it.
      </Centered>
    );
  if (scan.kind === "error")
    return (
      <Centered>
        Couldn’t scan this page.
        <button onClick={onRetry} className="mt-2 text-brand-ink underline">
          Try again
        </button>
      </Centered>
    );
  return <ReadinessTab domain={scan.domain} checks={scan.checks} score={scan.score} />;
}

function Header() {
  return (
    <header className="flex items-center gap-2 border-b border-line px-4 py-3">
      <span className="grid h-6 w-6 place-items-center bg-brand text-[14px] font-extrabold text-white">
        Z
      </span>
      <span className="text-[14px] font-bold tracking-tight text-ink-0">Zene</span>
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
