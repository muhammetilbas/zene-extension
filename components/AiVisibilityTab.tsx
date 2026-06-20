import type { EngineId } from "@/lib/readiness-types";
import { LINKS, openTab } from "@/lib/constants";
import { EngineLogo } from "./EngineLogo";

// AI Visibility = the actual product value (does ChatGPT/Perplexity NAME the
// brand). That needs real LLM calls = cost, so it's the redirect surface, not a
// free unlimited tool. v1 routes to the /tools/ai-visibility-checker landing
// (which auto-runs on ?url=) for the deeper check.

const ENGINES: { id: EngineId; name: string }[] = [
  { id: "chatgpt", name: "ChatGPT" },
  { id: "claude", name: "Claude" },
  { id: "gemini", name: "Gemini" },
  { id: "perplexity", name: "Perplexity" },
  { id: "grok", name: "Grok" },
];

const ROWS = [
  "Does each engine name your brand — or a competitor?",
  "All 5 engines, tracked daily (not a one-time snapshot)",
  "Side-by-side competitor comparison",
  "History, trend alerts & PDF reports",
];

export function AiVisibilityTab({ domain }: { domain: string }) {
  return (
    <div className="flex flex-col px-4 py-4">
      <div className="eyebrow">AI Visibility · {domain || "your brand"}</div>
      <h2 className="mt-1 text-[15px] font-bold leading-snug text-ink-0">
        Do AI engines actually mention you?
      </h2>
      <p className="mt-1.5 text-[12px] leading-snug text-ink-3">
        Readiness shows if engines <em>can</em> read your site. Visibility shows if they
        actually <em>name</em> you when people ask — across every major engine.
      </p>

      {/* Engine logos */}
      <div className="mt-3 grid grid-cols-5 overflow-hidden border border-line">
        {ENGINES.map((e, i) => (
          <div
            key={e.id}
            className={`flex flex-col items-center gap-1.5 bg-subtle px-1 py-2.5 ${
              i > 0 ? "border-l border-line" : ""
            }`}
          >
            <EngineLogo id={e.id} size={22} />
            <span className="text-[9.5px] font-semibold leading-none text-ink-3">{e.name}</span>
          </div>
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {ROWS.map((r) => (
          <li key={r} className="flex items-start gap-2 text-[12px] leading-snug text-ink-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {r}
          </li>
        ))}
      </ul>

      <button
        onClick={() => openTab(LINKS.checker(domain, "visibility_cta"))}
        className="mt-4 w-full bg-brand px-3 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110"
      >
        Run a free AI mention check →
      </button>
      <p className="mt-2 text-center text-[11px] text-ink-4">
        1 free check · full tracking on tryzene.com
      </p>
    </div>
  );
}
