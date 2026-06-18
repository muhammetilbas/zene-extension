import type { ReactNode } from "react";
import type { Tone } from "@/lib/tone";

// Tiny shared presentation helpers, keyed by the shared Tone palette.

const TONE_SOFT: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok-ink",
  watch: "bg-watch-soft text-watch-ink",
  bad: "bg-bad-soft text-bad-ink",
  muted: "bg-subtle text-ink-4",
};

const TONE_SOLID: Record<Tone, string> = {
  ok: "bg-ok text-white",
  watch: "bg-watch text-white",
  bad: "bg-bad text-white",
  muted: "bg-ink-5 text-white",
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`eyebrow inline-flex items-center px-1.5 py-0.5 ${TONE_SOFT[tone]}`}
      style={{ letterSpacing: "0.06em" }}
    >
      {children}
    </span>
  );
}

const GLYPH: Record<Tone, string> = { ok: "✓", watch: "!", bad: "✕", muted: "–" };

export function StatusDot({ tone }: { tone: Tone }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${TONE_SOLID[tone]}`}
      aria-hidden
    >
      {GLYPH[tone]}
    </span>
  );
}
