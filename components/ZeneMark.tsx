import {
  ZENE_GRAD_FROM,
  ZENE_GRAD_TO,
  ZENE_INK,
  ZENE_RADIUS,
  ZENE_VIEWBOX,
  ZENE_Z_PATH,
} from "@/lib/brand";

// The Zene logo mark — rounded-square indigo gradient tile + white "z".
export function ZeneMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${ZENE_VIEWBOX} ${ZENE_VIEWBOX}`}
      role="img"
      aria-label="Zene"
    >
      <defs>
        <linearGradient id="zene-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ZENE_GRAD_FROM} />
          <stop offset="1" stopColor={ZENE_GRAD_TO} />
        </linearGradient>
      </defs>
      <rect width={ZENE_VIEWBOX} height={ZENE_VIEWBOX} rx={ZENE_RADIUS} fill="url(#zene-grad)" />
      <path d={ZENE_Z_PATH} fill={ZENE_INK} />
    </svg>
  );
}
