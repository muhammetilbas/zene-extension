import { ZENE_INK, ZENE_TILE_FROM, ZENE_TILE_TO, ZENE_Z_PATH } from "@/lib/brand";

// The Zene logo mark — periwinkle gradient tile + indigo "z", matching
// tryzene.com / PEEX exactly (no font dependency; the "z" is an outlined glyph).
export function ZeneMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Zene">
      <defs>
        <linearGradient id="zene-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ZENE_TILE_FROM} />
          <stop offset="1" stopColor={ZENE_TILE_TO} />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#zene-tile)" />
      <path d={ZENE_Z_PATH} fill={ZENE_INK} />
    </svg>
  );
}
