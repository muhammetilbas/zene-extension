// Zene brand mark — single source of truth. Rounded-square tile in the indigo
// brand gradient with a tall, well-proportioned white "z". Used by the popup
// header (ZeneMark), the share card (lib/share-card.ts) and the toolbar icon
// (public/icon.svg → scripts/gen-icons.mjs). Path lives in a 512×512 space.

export const ZENE_VIEWBOX = 512;
export const ZENE_RADIUS = 120; // ~23% — rounded-square, app-icon style
// Tall Z (160×272 within the 512 box) so the letter never looks squashed.
export const ZENE_Z_PATH =
  "M176 120 H336 V172 L222 340 H336 V392 H176 V340 L290 172 H176 Z";
export const ZENE_GRAD_FROM = "#6366F1"; // brand indigo
export const ZENE_GRAD_TO = "#4F46E5"; // brand-ink
export const ZENE_INK = "#FFFFFF";
