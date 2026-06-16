import { useState } from "react";
import type { SiteCheck } from "@/lib/types";
import type { ScoreResult } from "@/lib/scoring";
import { fixesFrom, rankChecks } from "@/lib/scoring";
import { fixLine } from "@/lib/copy";
import { CheckRow } from "./CheckRow";
import { ScoreRing } from "./ScoreRing";
import { Pill } from "./ui";
import { LINKS, openTab } from "@/lib/constants";
import { downloadDataUrl, renderScoreCard, tweetIntent } from "@/lib/share-card";

export function ReadinessTab({
  domain,
  checks,
  score,
}: {
  domain: string;
  checks: SiteCheck[];
  score: ScoreResult;
}) {
  const fixes = fixesFrom(checks);
  const ordered = rankChecks(checks);
  const [copied, setCopied] = useState(false);

  function downloadCard() {
    const url = renderScoreCard({ domain, score: score.score, grade: score.grade, tone: score.tone });
    downloadDataUrl(url, `zene-${domain}-ai-readiness.png`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col">
      {/* Score header */}
      <div className="flex items-center gap-4 px-4 py-4">
        <ScoreRing score={score.score} tone={score.tone} grade={score.grade} />
        <div className="min-w-0 flex-1">
          <div className="eyebrow">AI Readiness · {domain}</div>
          <p className="mt-1 text-[13px] leading-snug text-ink-2">
            {score.tone === "ok"
              ? "Strong foundation — AI engines can read this site."
              : score.tone === "bad"
                ? "AI engines may struggle to read this site. Fix the items below."
                : "Some gaps could keep AI engines from fully reading this site."}
          </p>
          <p className="mt-1 text-[11px] text-ink-4">
            {score.measured}/{score.total} checks measured
          </p>
        </div>
      </div>

      {/* Fixes */}
      {fixes.length > 0 && (
        <div className="border-t border-line bg-accent-warm/60 px-4 py-3">
          <div className="eyebrow mb-2">Top fixes</div>
          <ul className="flex flex-col gap-1.5">
            {fixes.slice(0, 3).map((c) => (
              <li key={c.key} className="flex items-start gap-2 text-[12px] leading-snug text-ink-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {fixLine(c)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All checks */}
      <ul className="border-t border-line">
        {ordered.map((c) => (
          <CheckRow key={c.key} check={c} />
        ))}
      </ul>

      {/* Share */}
      <div className="flex gap-2 border-t border-line px-4 py-3">
        <button
          onClick={downloadCard}
          className="flex-1 bg-ink-0 px-3 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
        >
          {copied ? "Saved ✓" : "Download score card"}
        </button>
        <button
          onClick={() => openTab(tweetIntent(domain, score.score, LINKS.freeChecker("share_x")))}
          className="border border-line-strong px-3 py-2 text-[12px] font-semibold text-ink-1 transition hover:bg-subtle"
        >
          Share
        </button>
      </div>

      {/* Conversion CTA — snapshot here, the film lives in Zene */}
      <button
        onClick={() => openTab(LINKS.freeChecker("readiness_cta"))}
        className="flex items-center justify-between gap-2 border-t border-line bg-brand-soft px-4 py-3 text-left transition hover:brightness-95"
      >
        <span>
          <span className="block text-[13px] font-semibold text-brand-ink">
            Track this score over time →
          </span>
          <span className="block text-[11px] text-ink-3">
            Daily monitoring, all 4 engines & competitors on Zene
          </span>
        </span>
        <Pill tone="ok">Free</Pill>
      </button>
    </div>
  );
}
