# Zene — AI Visibility Checker 👻

A free Chrome extension that tells you whether AI engines can actually read your
site. Open any page, click the icon, and get an instant AI Readiness score for
ChatGPT, Claude, Gemini, Perplexity and Grok.

No signup, no account, nothing to install beyond the extension.

[![License: MIT](https://img.shields.io/badge/license-MIT-10b981.svg)](./LICENSE)
[![Built with WXT](https://img.shields.io/badge/built%20with-WXT-6366F1)](https://wxt.dev)
&nbsp;·&nbsp; [tryzene.com](https://tryzene.com)

## Why 🤔

People increasingly ask an AI assistant instead of scrolling a results page. If
the engine can't crawl, parse or cite your site, it can't recommend you — and
nothing tells you that's happening. This extension checks the signals that decide
it, so you can see (and fix) the gaps.

## What you get 📊

- An AI Readiness score from 0–100 with a letter grade
- 11 signals grouped into three dimensions: **Access**, **Understand**, **Cite**
- A readiness verdict per engine (ChatGPT, Claude, Gemini, Perplexity, Grok)
- A score card you can download and share
- Per-signal fixes that deep-link to the matching tool on Zene

## How it works ⚙️

The popup doesn't score anything itself. It calls Zene's public readiness API —
the same endpoint the checker on tryzene.com uses — so you get the exact same
result you'd get on the web.

```
1. you click the icon      → the popup reads the active tab's URL
2. it POSTs the origin      → https://tryzene.com/api/tools/ai-readiness
3. Zene scores it server-side (deterministic, no LLM)
4. the popup renders the score, dimensions, per-engine verdict and fixes
```

For history, competitor comparisons and real mention scans, the "more" links
open the full report on Zene.

## Privacy & permissions 🔐

The extension keeps its footprint small on purpose, and you can verify every line
of that here.

| Permission | What it's for |
| --- | --- |
| `activeTab` | Read the current tab's URL, only after you click the icon |
| `host_permissions: https://tryzene.com/*` | Call the readiness API (a single domain, not `<all_urls>`) |

It sends only the **origin** of the page you choose to check (e.g.
`https://example.com`). It never sends the full path, never reads page content,
never touches your browsing history, and saves nothing on your device. Full
policy at <https://tryzene.com/privacy>.

One trade-off: since Zene fetches sites server-side, it can't reach
`localhost` or intranet pages. Those fall back to opening the full checker on the
web.

## Develop 🧑‍💻

```bash
npm install
npm run dev        # launch a browser with the extension + hot reload
npm run compile    # tsc --noEmit
npm run build      # production build → .output/chrome-mv3
npm run zip        # packaged zip for the Web Store
```

A few notes:

- If you don't have Chrome/Brave/Edge installed, `web-ext.config.ts` falls back to
  a puppeteer "Chrome for Testing" build (or whatever `$CHROME_PATH` points to).
- To run against a local backend, set `VITE_ZENE_BASE=http://localhost:3000` and
  add `http://localhost:3000/*` to `host_permissions` in `wxt.config.ts`.
- To load it by hand: `chrome://extensions` → Developer mode → Load unpacked →
  `.output/chrome-mv3`.
- Assets are generated: `node scripts/gen-icons.mjs` for the icons and
  `node scripts/gen-screenshots.mjs` for the store screenshots.

## Project layout 🗂️

```
entrypoints/popup/   index.html · main.tsx · style.css (design tokens)
components/          App · ReadinessTab · AiVisibilityTab · ScoreRing ·
                     Dimensions · Engines · CheckRow · ReadinessSkeleton · ui
lib/                 api · readiness-types · tone · constants · share-card · brand
scripts/             gen-icons.mjs · gen-screenshots.mjs · icon-source.png
```

`lib/readiness-types.ts` mirrors the API's response shape, so keep the two in sync
if the API ever changes.

## Roadmap 🗺️

- A share/OG route so downloaded score cards become indexable links
- Competitor comparison inside the popup — scan a rival's domain side by side

## License 📄

[MIT](./LICENSE) © Muhammet İlbaş. The Zene name and logo, and the engine logos
used to label each engine, belong to their respective owners and are used
nominatively.
