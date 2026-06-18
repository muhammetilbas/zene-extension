import type { ReadinessDimension } from "@/lib/readiness-types";
import { scoreTone } from "@/lib/tone";

const BAR: Record<string, string> = {
  ok: "bg-ok",
  watch: "bg-watch",
  bad: "bg-bad",
  muted: "bg-ink-5",
};

// The three readiness dimensions (Access / Understand / Cite) as mini bars.
export function Dimensions({ dimensions }: { dimensions: ReadinessDimension[] }) {
  return (
    <div className="flex gap-3 border-t border-line px-4 py-3">
      {dimensions.map((d) => (
        <div key={d.key} className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <span className="eyebrow truncate">{d.label}</span>
            <span className="num text-[12px] font-bold text-ink-1">{d.score}</span>
          </div>
          <div className="mt-1 h-1.5 w-full bg-subtle">
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
