import type { EngineReadiness } from "@/lib/readiness-types";
import { engineTone } from "@/lib/tone";

const DOT: Record<string, string> = {
  ok: "bg-ok",
  watch: "bg-watch",
  bad: "bg-bad",
  muted: "bg-ink-5",
};

// Per-engine readiness — the signature of the report. One honest verdict per
// AI engine, derived from the same static signals (never a real LLM query).
export function Engines({ engines }: { engines: EngineReadiness[] }) {
  return (
    <div className="border-t border-line px-4 py-3">
      <div className="eyebrow mb-2">Per-engine readiness</div>
      <ul className="flex flex-col gap-2">
        {engines.map((e) => (
          <li key={e.id} className="flex items-start gap-2">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${DOT[engineTone(e.status)]}`} />
            <div className="min-w-0 flex-1">
              <span className="text-[12px] font-semibold text-ink-1">{e.label}</span>
              <span className="ml-1.5 text-[11px] text-ink-3">{e.reason}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
