import type { ReadinessCheck } from "@/lib/readiness-types";
import { statusTone } from "@/lib/tone";
import { LINKS, openTab } from "@/lib/constants";
import { StatusDot } from "./ui";

const STATUS_LABEL = { pass: "Pass", warn: "Warn", fail: "Fail" } as const;

export function CheckRow({ check }: { check: ReadinessCheck }) {
  const tone = statusTone(check.status);
  return (
    <li className="flex gap-2.5 border-t border-line px-4 py-3 first:border-t-0">
      <StatusDot tone={tone} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-ink-1">{check.label}</span>
          <span className="eyebrow shrink-0 text-ink-4">{STATUS_LABEL[check.status]}</span>
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-ink-3">{check.detail}</p>
        {check.fixHref && check.status !== "pass" && (
          <button
            onClick={() => openTab(LINKS.fix(check.fixHref!))}
            className="mt-1 text-[12px] font-semibold text-brand-ink underline-offset-2 hover:underline"
          >
            {check.fixLabel ?? "Fix this"} →
          </button>
        )}
      </div>
    </li>
  );
}
