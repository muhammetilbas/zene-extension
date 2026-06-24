// Loading placeholder for the Readiness tab. Mirrors the real result layout
// (score ring + copy, three dimension bars, a few check rows) so the popup
// doesn't jump when data arrives. Pure shimmer — no text.

function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-line ${className}`} />;
}

export function ReadinessSkeleton() {
  return (
    <div className="flex animate-pulse flex-col" aria-hidden>
      {/* Score header: ring + copy lines */}
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="h-[72px] w-[72px] shrink-0 rounded-full bg-line" />
        <div className="min-w-0 flex-1 space-y-2">
          <Bar className="h-2.5 w-2/5" />
          <Bar className="h-3 w-full" />
          <Bar className="h-3 w-4/5" />
          <Bar className="h-2 w-1/3" />
        </div>
      </div>

      {/* Dimensions: three labelled bars */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Bar className="h-2.5 w-24" />
              <Bar className="h-2.5 w-8" />
            </div>
            <Bar className="h-1.5 w-full" />
          </div>
        ))}
      </div>

      {/* Check rows */}
      <ul className="border-t border-line">
        {["w-3/4", "w-5/6", "w-2/3", "w-4/5", "w-3/5"].map((w, i) => (
          <li key={i} className="flex items-center gap-3 border-b border-line px-4 py-3">
            <div className="h-4 w-4 shrink-0 rounded-full bg-line" />
            <Bar className={`h-3 ${w}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
