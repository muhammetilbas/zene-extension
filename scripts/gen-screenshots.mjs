// Generate Chrome Web Store screenshots (1280×800, 24-bit PNG, no alpha) by
// rendering marketing mockups of the real popup UI with headless Chrome, then
// flattening the alpha channel. Run: node scripts/gen-screenshots.mjs
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "store-assets");
mkdirSync(OUT, { recursive: true });

const LOGO = "data:image/png;base64," + readFileSync(join(ROOT, "scripts", "icon-source.png")).toString("base64");

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const base = join(homedir(), ".cache", "puppeteer", "chrome");
  if (!existsSync(base)) return null;
  for (const v of readdirSync(base).filter((d) => d.startsWith("mac")).sort().reverse()) {
    for (const arch of ["chrome-mac-arm64", "chrome-mac-x64"]) {
      const bin = join(base, v, arch, "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing");
      if (existsSync(bin)) return bin;
    }
  }
  return null;
}
const chrome = findChrome();
if (!chrome) { console.error("No Chrome found. Set CHROME_PATH."); process.exit(1); }

// --- engine marks (from components/EngineLogo.tsx) ---
const ENG = {
  chatgpt: { c: "#10a37f", d: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" },
  claude: { c: "#c96442", d: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" },
  gemini: { c: "#4285f4", d: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" },
  perplexity: { c: "#20808d", d: "M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" },
  grok: { c: "#1a1a1c", d: "M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z", evenodd: true },
};
function engSvg(id, size = 30) {
  const e = ENG[id];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${e.c}"><path d="${e.d}"${e.evenodd ? ' fill-rule="evenodd"' : ""}/></svg>`;
}

function ring(score, color) {
  const r = 34, c = 2 * Math.PI * r, off = c * (1 - score / 100);
  return `<svg width="84" height="84" viewBox="0 0 84 84">
    <circle cx="42" cy="42" r="${r}" fill="none" stroke="#ececec" stroke-width="9"/>
    <circle cx="42" cy="42" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 42 42)"/>
    <text x="42" y="46" text-anchor="middle" font-family="'SF Mono',monospace" font-weight="700" font-size="26" fill="#1a1a1c">${score}</text>
    <text x="42" y="62" text-anchor="middle" font-family="ui-sans-serif,system-ui" font-weight="600" font-size="10" fill="#9a9aa3">/100</text>
  </svg>`;
}

const dim = (label, val, color) => `
  <div style="display:flex;flex-direction:column;gap:5px">
    <div style="display:flex;justify-content:space-between;font-size:12px">
      <span style="color:#3a3a3f;font-weight:600">${label}</span>
      <span style="color:${color};font-weight:700;font-family:'SF Mono',monospace">${val}</span>
    </div>
    <div style="height:6px;background:#eee;border-radius:99px;overflow:hidden">
      <div style="height:100%;width:${val}%;background:${color};border-radius:99px"></div>
    </div>
  </div>`;

const check = (label, status) => {
  const map = { pass: ["#10b981", "✓"], warn: ["#f59e0b", "!"], fail: ["#ef4444", "✕"] };
  const [c, g] = map[status];
  return `<li style="display:flex;align-items:center;gap:10px;padding:11px 16px;border-bottom:1px solid rgba(15,15,20,.08)">
    <span style="width:18px;height:18px;border-radius:99px;background:${c};color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">${g}</span>
    <span style="font-size:12.5px;color:#1a1a1c">${label}</span>
  </li>`;
};

const tabs = (active) => `
  <div style="display:flex;border-bottom:1px solid rgba(15,15,20,.08)">
    <div style="flex:1;text-align:center;padding:12px;font-size:13px;font-weight:${active === 0 ? 700 : 500};color:${active === 0 ? "#0a0a0b" : "#9a9aa3"};${active === 0 ? "border-bottom:2px solid #6366f1" : ""}">Readiness</div>
    <div style="flex:1;text-align:center;padding:12px;font-size:13px;font-weight:${active === 1 ? 700 : 500};color:${active === 1 ? "#0a0a0b" : "#9a9aa3"};${active === 1 ? "border-bottom:2px solid #6366f1" : ""}">AI Visibility</div>
  </div>`;

const popupHeader = `
  <div style="display:flex;align-items:center;gap:8px;padding:13px 16px;border-bottom:1px solid rgba(15,15,20,.08)">
    <span style="font-size:15px;font-weight:800;letter-spacing:-.02em;color:#0a0a0b">Zene</span>
    <span style="margin-left:auto;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9a9aa3">AI Visibility Checker</span>
  </div>`;

const popupFooter = `
  <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-top:1px solid rgba(15,15,20,.08)">
    <span style="font-size:11px;color:#9a9aa3">Free · no signup</span>
    <span style="font-size:11px;font-weight:700;color:#6b6b73">tryzene.com</span>
  </div>`;

// popup card 1 — Readiness
const popup1 = `
<div style="width:420px;background:#fff;border:1px solid rgba(15,15,20,.1);border-radius:14px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(40,30,90,.45)">
  ${popupHeader}${tabs(0)}
  <div style="display:flex;align-items:center;gap:16px;padding:18px 16px">
    ${ring(63, "#f59e0b")}
    <div style="flex:1">
      <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9a9aa3">AI Readiness · yoursite.com</div>
      <p style="margin:6px 0 0;font-size:13px;line-height:1.4;color:#3a3a3f">Some gaps could keep AI engines from fully reading this site.</p>
      <p style="margin:6px 0 0;font-size:11px;color:#9a9aa3">11 signals checked</p>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:12px;padding:0 16px 16px">
    ${dim("Access", 82, "#10b981")}
    ${dim("Understandability", 64, "#f59e0b")}
    ${dim("Citeability", 38, "#ef4444")}
  </div>
  <ul style="margin:0;padding:0;list-style:none;border-top:1px solid rgba(15,15,20,.08)">
    ${check("robots.txt allows AI crawlers", "pass")}
    ${check("Structured data (Schema.org)", "warn")}
    ${check("Author & citation metadata", "fail")}
  </ul>
  ${popupFooter}
</div>`;

// popup card 2 — AI Visibility (engines)
const engRow = Object.keys(ENG).map((id) => `
  <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
    <div style="width:54px;height:54px;border:1px solid rgba(15,15,20,.1);border-radius:12px;display:flex;align-items:center;justify-content:center;background:#faf9f7">${engSvg(id, 28)}</div>
  </div>`).join("");
const popup2 = `
<div style="width:420px;background:#fff;border:1px solid rgba(15,15,20,.1);border-radius:14px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(40,30,90,.45)">
  ${popupHeader}${tabs(1)}
  <div style="padding:22px 16px">
    <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9a9aa3">Across all 5 engines</div>
    <p style="margin:8px 0 18px;font-size:14px;line-height:1.45;color:#1a1a1c;font-weight:600">Can the AI engines people actually ask find and cite your brand?</p>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:6px">${engRow}</div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;font-size:10px;color:#6b6b73;text-align:center">
      <span>ChatGPT</span><span>Claude</span><span>Gemini</span><span>Perplexity</span><span>Grok</span>
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;border-top:1px solid rgba(15,15,20,.08);background:#eef0ff">
    <div>
      <div style="font-size:13px;font-weight:700;color:#4f46e5">Run the full visibility check →</div>
      <div style="font-size:11px;color:#6b6b73">Per-engine mentions & fixes on Zene</div>
    </div>
    <span style="font-size:11px;font-weight:700;color:#fff;background:#10b981;padding:3px 9px;border-radius:99px">Free</span>
  </div>
</div>`;

function page(headline, sub, popup) {
  return `<!doctype html><html><head><meta charset=utf-8>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:1280px;height:800px;font-family:'Inter',ui-sans-serif,system-ui,-apple-system,sans-serif}
    .wrap{width:1280px;height:800px;display:flex;align-items:center;gap:60px;padding:0 80px;
      background:linear-gradient(135deg,#f5f3ee 0%,#eef0ff 55%,#e7e9ff 100%);overflow:hidden;position:relative}
    .blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.5}
    .left{flex:1;max-width:560px;z-index:2}
    .badge{display:inline-flex;align-items:center;gap:9px;background:#fff;border:1px solid rgba(15,15,20,.08);
      padding:8px 14px 8px 8px;border-radius:99px;box-shadow:0 6px 20px -8px rgba(40,30,90,.3)}
    .badge img{width:30px;height:30px;border-radius:8px;display:block}
    .badge span{font-size:14px;font-weight:800;letter-spacing:-.01em;color:#0a0a0b}
    h1{margin:26px 0 0;font-size:52px;line-height:1.08;font-weight:800;letter-spacing:-.03em;color:#0a0a0b}
    h1 .hl{color:#4f46e5}
    p.sub{margin:22px 0 0;font-size:21px;line-height:1.45;color:#3a3a3f;font-weight:500}
    .pills{margin:30px 0 0;display:flex;gap:10px;flex-wrap:wrap}
    .pill{font-size:13px;font-weight:600;color:#4f46e5;background:#fff;border:1px solid rgba(99,102,241,.25);padding:7px 14px;border-radius:99px}
    .right{z-index:2;display:flex;justify-content:center;flex:0 0 auto}
  </style></head>
  <body><div class="wrap">
    <div class="blob" style="width:420px;height:420px;background:#a5b4fc;top:-120px;right:280px"></div>
    <div class="blob" style="width:360px;height:360px;background:#c7d2fe;bottom:-140px;right:-60px"></div>
    <div class="left">
      <div class="badge"><img src="${LOGO}"/><span>Zene</span></div>
      <h1>${headline}</h1>
      <p class="sub">${sub}</p>
      <div class="pills"><span class="pill">100% Free</span><span class="pill">No signup</span><span class="pill">Instant score</span></div>
    </div>
    <div class="right">${popup}</div>
  </div></body></html>`;
}

const SHOTS = [
  { file: "screenshot-1.png", html: page(`Can AI actually <span class="hl">read your site?</span>`, `Get an instant AI Readiness score for any page — see exactly what's blocking ChatGPT, Claude & friends.`, popup1) },
  { file: "screenshot-2.png", html: page(`Built for the <span class="hl">5 engines</span> people ask`, `Check how visible your brand is to ChatGPT, Claude, Gemini, Perplexity and Grok — in one click.`, popup2) },
];

for (const s of SHOTS) {
  const html = join(tmpdir(), `zene-${s.file}.html`);
  writeFileSync(html, s.html);
  const raw = join(OUT, "_raw-" + s.file);
  execFileSync(chrome, [
    "--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--window-size=1280,800", "--default-background-color=ffffffff",
    `--screenshot=${raw}`, html,
  ]);
  // Flatten alpha → 24-bit PNG (Web Store rejects PNGs with an alpha channel).
  const dest = join(OUT, s.file);
  try {
    execFileSync("magick", [raw, "-background", "white", "-alpha", "remove", "-alpha", "off", dest], { stdio: "ignore" });
  } catch {
    execFileSync("convert", [raw, "-background", "white", "-alpha", "remove", "-alpha", "off", dest], { stdio: "ignore" });
  }
  console.log(`store-assets/${s.file}`);
}
