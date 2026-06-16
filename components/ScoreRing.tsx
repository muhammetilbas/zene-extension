import type { Tone } from "@/lib/scoring";

const TONE_STROKE: Record<Tone, string> = {
  ok: "var(--ok)",
  watch: "var(--watch)",
  bad: "var(--bad)",
};

// SVG circular gauge for the readiness score.
export function ScoreRing({
  score,
  tone,
  grade,
  size = 132,
}: {
  score: number;
  tone: Tone;
  grade: string;
  size?: number;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = c * pct;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TONE_STROKE[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="num text-4xl font-bold text-ink-0 leading-none">{score}</span>
        <span className="eyebrow mt-1" style={{ color: TONE_STROKE[tone] }}>
          {grade}
        </span>
      </div>
    </div>
  );
}
