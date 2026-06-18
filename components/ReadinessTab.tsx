import { useState } from "react";
import type { CheckStatus, ReadinessOk } from "@/lib/readiness-types";
import { BAND_LABEL } from "@/lib/readiness-types";
import { bandTone } from "@/lib/tone";
import { CheckRow } from "./CheckRow";
import { ScoreRing } from "./ScoreRing";
import { Dimensions } from "./Dimensions";
import { Engines } from "./Engines";
import { Pill } from "./ui";
import { LINKS, openTab } from "@/lib/constants";
import { downloadDataUrl, renderScoreCard, tweetIntent } from "@/lib/share-card";

const STATUS_RANK: Record<CheckStatus, number> = { fail: 0, warn: 1, pass: 2 };

export function ReadinessTab({ domain, result }: { domain: string; result: ReadinessOk }) {
  const tone = bandTone(result.band);
  const band = BAND_LABEL[result.band];
  const checks = [...result.checks].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);
  const [copied, setCopied] = useState(false);

  function downloadCard() {
    const url = renderScoreCard({ domain, score: result.score, grade: band, tone });
    downloadDataUrl(url, `zene-${domain}-ai-readiness.png`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col">
      {/* Score header */}
      <div className="flex items-center gap-4 px-4 py-4">
        <ScoreRing score={result.score} tone={tone} grade={band} />
        <div className="min-w-0 flex-1">
          <div className="eyebrow">AI Readiness · {domain}</div>
          <p className="mt-1 text-[13px] leading-snug text-ink-2">
            {tone === "ok"
              ? "Strong foundation — AI engines can read this site."
              : tone === "bad"
                ? "AI engines may struggle to read this site. Fix the flags below."
                : "Some gaps could keep AI engines from fully reading this site."}
          </p>
          <p className="mt-1 text-[11px] text-ink-4">{result.checks.length} signals checked</p>
        </div>
      </div>

      <Dimensions dimensions={result.dimensions} />
      {result.engines && result.engines.length > 0 && <Engines engines={result.engines} />}

      {/* All checks, worst first */}
      <ul className="border-t border-line">
        {checks.map((c) => (
          <CheckRow key={c.id} check={c} />
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
          onClick={() => openTab(tweetIntent(domain, result.score, LINKS.checker(domain, "share_x")))}
          className="border border-line-strong px-3 py-2 text-[12px] font-semibold text-ink-1 transition hover:bg-subtle"
        >
          Share
        </button>
      </div>

      {/* Conversion CTA — full report + tracking lives on Zene */}
      <button
        onClick={() => openTab(LINKS.checker(domain, "readiness_cta"))}
        className="flex items-center justify-between gap-2 border-t border-line bg-brand-soft px-4 py-3 text-left transition hover:brightness-95"
      >
        <span>
          <span className="block text-[13px] font-semibold text-brand-ink">
            Full report & track over time →
          </span>
          <span className="block text-[11px] text-ink-3">
            Per-engine fixes, history & competitors on Zene
          </span>
        </span>
        <Pill tone="ok">Free</Pill>
      </button>
    </div>
  );
}
