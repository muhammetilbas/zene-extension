import type { SiteCheck } from "@/lib/types";
import { describeCheck, STATUS_LABEL } from "@/lib/copy";
import { Pill, StatusDot, statusTone } from "./ui";

export function CheckRow({ check }: { check: SiteCheck }) {
  const tone = statusTone(check.status);
  const { title, detail } = describeCheck(check);
  return (
    <li className="flex gap-2.5 border-t border-line px-4 py-3 first:border-t-0">
      <StatusDot tone={tone} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-ink-1">{title}</span>
          <Pill tone={tone}>{STATUS_LABEL[check.status]}</Pill>
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-ink-3">{detail}</p>
      </div>
    </li>
  );
}
