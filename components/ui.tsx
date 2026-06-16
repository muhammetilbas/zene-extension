import type { ReactNode } from "react";
import type { CheckStatus } from "@/lib/types";
import type { Tone } from "@/lib/scoring";

// Tiny shared presentation helpers. Tones map onto the Zene status palette.

export type UiTone = Tone | "muted";

export function statusTone(status: CheckStatus): UiTone {
  switch (status) {
    case "passed":
      return "ok";
    case "warning":
      return "watch";
    case "blocked":
      return "bad";
    case "unchecked":
      return "muted";
  }
}

const TONE_SOFT: Record<UiTone, string> = {
  ok: "bg-ok-soft text-ok-ink",
  watch: "bg-watch-soft text-watch-ink",
  bad: "bg-bad-soft text-bad-ink",
  muted: "bg-subtle text-ink-4",
};

const TONE_SOLID: Record<UiTone, string> = {
  ok: "bg-ok text-white",
  watch: "bg-watch text-white",
  bad: "bg-bad text-white",
  muted: "bg-ink-5 text-white",
};

export function Pill({ tone, children }: { tone: UiTone; children: ReactNode }) {
  return (
    <span
      className={`eyebrow inline-flex items-center px-1.5 py-0.5 ${TONE_SOFT[tone]}`}
      style={{ letterSpacing: "0.06em" }}
    >
      {children}
    </span>
  );
}

const GLYPH: Record<UiTone, string> = {
  ok: "✓",
  watch: "!",
  bad: "✕",
  muted: "–",
};

export function StatusDot({ tone }: { tone: UiTone }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${TONE_SOLID[tone]}`}
      aria-hidden
    >
      {GLYPH[tone]}
    </span>
  );
}
