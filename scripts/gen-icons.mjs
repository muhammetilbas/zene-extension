// Generate the extension icons (no deps) — an indigo square with a white "Z".
// Chrome requires raster PNGs, so we hand-roll a minimal PNG encoder with zlib.
// Run: node scripts/gen-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icon");
mkdirSync(OUT, { recursive: true });

const BRAND = [0x63, 0x66, 0xf1]; // #6366F1
const WHITE = [0xff, 0xff, 0xff];

// CRC32 (PNG chunk checksums).
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

// Is pixel (x,y) part of the "Z" glyph? Three strokes inside a padded box.
function isZ(x, y, s) {
  const p = s * 0.24; // padding
  const inner = s - 2 * p;
  if (x < p || x > s - p) return false;
  const bar = s * 0.13;
  const topY0 = p;
  const topY1 = p + bar;
  const botY0 = s - p - bar;
  const botY1 = s - p;
  if (y >= topY0 && y <= topY1) return true; // top bar
  if (y >= botY0 && y <= botY1) return true; // bottom bar
  if (y > topY1 && y < botY0) {
    // diagonal from top-right to bottom-left
    const t = (y - topY1) / (botY0 - topY1);
    const center = s - p + (p - (s - p)) * t;
    return Math.abs(x - center) < inner * 0.13;
  }
  return false;
}

function makePng(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  let o = 0;
  for (let y = 0; y < size; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = isZ(x + 0.5, y + 0.5, size) ? WHITE : BRAND;
      raw[o++] = r;
      raw[o++] = g;
      raw[o++] = b;
      raw[o++] = 0xff;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [16, 32, 48, 96, 128]) {
  writeFileSync(join(OUT, `${size}.png`), makePng(size));
  console.log(`icon/${size}.png`);
}
