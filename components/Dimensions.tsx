import type { ReadinessDimension } from "@/lib/readiness-types";
import { scoreTone } from "@/lib/tone";

const BAR: Record<string, string> = {
  ok: "bg-ok",
  watch: "bg-watch",
  bad: "bg-bad",
  muted: "bg-ink-5",
};

// The three readiness dimensions (Access / Understandability / Citeability),
// stacked so full labels never truncate and each gets room to breathe.
export function Dimensions({ dimensions }: { dimensions: ReadinessDimension[] }) {
  return (
    <div className="flex flex-col gap-3 border-t border-line px-4 py-3.5">
      {dimensions.map((d) => (
        <div key={d.key}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[12px] font-semibold text-ink-2">{d.label}</span>
            <span className="num text-[13px] font-bold text-ink-1">{d.score}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-subtle">
            <div
              className={`h-full ${BAR[scoreTone(d.score)]}`}
              style={{ width: `${Math.max(0, Math.min(100, d.score))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
