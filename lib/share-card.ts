import type { Tone } from "./tone";
import { SITE_URL } from "./constants";

// Shareable score card — the viral loop. Renders an OG-sized (1200×630) PNG
// entirely client-side so people can drop it on X / LinkedIn. Every card says
// "measured by Zene · tryzene.com", so each share is another contextual mention
// of the brand on the open web (which is exactly how LLMs learn a brand exists).

const TONE_COLOR: Record<Tone, string> = {
  ok: "#10b981",
  watch: "#f59e0b",
  bad: "#ef4444",
  muted: "#9a9aa3",
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function renderScoreCard(opts: {
  domain: string;
  score: number;
  grade: string;
  tone: Tone;
}): string {
  const { domain, score, grade, tone } = opts;
  const W = 1200;
  const H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const mono = "'SF Mono', 'JetBrains Mono', ui-monospace, monospace";
  const sans = "ui-sans-serif, system-ui, -apple-system, sans-serif";

  // Background — warm cream (Zene sidebar tone).
  ctx.fillStyle = "#f5f3ee";
  ctx.fillRect(0, 0, W, H);
  // Inset card.
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 48, 48, W - 96, H - 96, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(15,15,20,0.10)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const accent = TONE_COLOR[tone];

  // Eyebrow.
  ctx.fillStyle = "#9a9aa3";
  ctx.font = `600 22px ${mono}`;
  ctx.fillText("AI READINESS SCORE", 96, 132);

  // Domain.
  ctx.fillStyle = "#0a0a0b";
  ctx.font = `700 52px ${sans}`;
  ctx.fillText(truncate(domain, 26), 96, 196);

  // Big score number.
  ctx.fillStyle = accent;
  ctx.font = `700 230px ${mono}`;
  ctx.fillText(String(score), 92, 470);
  // "/100" suffix.
  const scoreW = ctx.measureText(String(score)).width;
  ctx.fillStyle = "#c4c4cc";
  ctx.font = `700 64px ${mono}`;
  ctx.fillText("/100", 92 + scoreW + 20, 470);

  // Grade pill.
  ctx.font = `600 30px ${sans}`;
  const gradeW = ctx.measureText(grade).width;
  ctx.fillStyle = accent;
  roundRect(ctx, 96, 500, gradeW + 56, 56, 4);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(grade, 124, 538);

  // Indigo "Z" mark, top-right.
  ctx.fillStyle = "#6366f1";
  roundRect(ctx, W - 200, 96, 104, 104, 6);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 70px ${sans}`;
  ctx.fillText("Z", W - 168, 174);

  // Footer attribution — the mention that does the work.
  ctx.fillStyle = "#6b6b73";
  ctx.font = `500 28px ${sans}`;
  ctx.textAlign = "right";
  ctx.fillText(`measured by Zene · ${SITE_URL.replace("https://", "")}`, W - 96, 560);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Pre-filled X/Twitter share intent linking back to our landing page. */
export function tweetIntent(domain: string, score: number, landingUrl: string): string {
  const text = `${domain} scored ${score}/100 on AI Readiness — can ChatGPT, Claude & Perplexity actually read it? Check yours free with Zene 👇`;
  const params = new URLSearchParams({ text, url: landingUrl });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}
