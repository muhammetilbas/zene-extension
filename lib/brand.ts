// Zene brand mark — single source of truth. Black circle + white "z".
// Used by the popup header (ZeneMark), the share card (lib/share-card.ts) and
// the toolbar icon (public/icon.svg → scripts/gen-icons.mjs). The path lives in
// a 512×512 coordinate space (ZENE_VIEWBOX). Keep all consumers in sync.

export const ZENE_VIEWBOX = 512;
export const ZENE_Z_PATH =
  "M150 140 H370 V190 L235 322 H370 V372 H150 V322 L285 190 H150 Z";
export const ZENE_BG = "#000000";
export const ZENE_INK = "#ffffff";
export const ZENE_CIRCLE = { cx: 256, cy: 256, r: 240 };
