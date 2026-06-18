import { LINKS, openTab } from "@/lib/constants";

// AI Visibility = the actual product value (does ChatGPT/Perplexity NAME the
// brand). That needs real LLM calls = cost, so it's the redirect surface, not a
// free unlimited tool. v1 routes to the /free-ai-checker landing for the single
// free mention check; the in-popup `extension-check` endpoint is a later step.

const ENGINES: { name: string; color: string }[] = [
  { name: "ChatGPT", color: "var(--eng-chatgpt)" },
  { name: "Claude", color: "var(--eng-claude)" },
  { name: "Gemini", color: "var(--eng-gemini)" },
  { name: "Perplexity", color: "var(--eng-perplexity)" },
];

const ROWS = [
  "Does each engine name your brand — or a competitor?",
  "All 4 engines, tracked daily (not a one-time snapshot)",
  "Side-by-side competitor comparison",
  "History, trend alerts & PDF reports",
];

export function AiVisibilityTab({ domain }: { domain: string }) {
  return (
    <div className="flex flex-col px-4 py-4">
      <div className="eyebrow">AI Visibility · {domain || "your brand"}</div>
      <h2 className="mt-1 text-[15px] font-bold text-ink-0">
        Do AI engines actually mention you?
      </h2>
      <p className="mt-1 text-[12px] leading-snug text-ink-3">
        Readiness shows if engines <em>can</em> read your site. Visibility shows if they
        actually <em>name</em> you when people ask. That needs live answers from each engine.
      </p>

      <div className="mt-3 flex gap-1.5">
        {ENGINES.map((e) => (
          <span
            key={e.name}
            className="flex-1 border border-line px-1.5 py-1.5 text-center text-[11px] font-semibold"
            style={{ color: e.color }}
          >
            {e.name}
          </span>
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
