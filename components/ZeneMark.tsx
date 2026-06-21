import { ZENE_BG, ZENE_CIRCLE, ZENE_INK, ZENE_VIEWBOX, ZENE_Z_PATH } from "@/lib/brand";

// The Zene logo mark — black circle + white "z", matching tryzene.com.
export function ZeneMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${ZENE_VIEWBOX} ${ZENE_VIEWBOX}`} role="img" aria-label="Zene">
      <circle cx={ZENE_CIRCLE.cx} cy={ZENE_CIRCLE.cy} r={ZENE_CIRCLE.r} fill={ZENE_BG} />
      <path d={ZENE_Z_PATH} fill={ZENE_INK} />
    </svg>
  );
}
