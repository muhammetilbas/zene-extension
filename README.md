# Zene — AI Visibility Checker (Chrome extension)

Free, zero-signup Chrome extension that scores any website's **AI readiness** —
whether ChatGPT, Claude, Gemini, Perplexity & Grok can actually reach, read &
cite the brand. The viral, top-of-funnel companion to
[Zene](https://tryzene.com) (PEEX).

## How it works (single source of truth)

The extension is a **thin client over Zene's public readiness API**
(`/api/tools/ai-readiness`) — the **same endpoint the tryzene.com tool uses**. So
the score in the popup is identical to the score on the web, byte for byte. No
separate scoring logic to drift out of sync.

1. You click the icon on any site → the popup reads the active tab's URL
   (`activeTab`).
2. It `POST`s that URL to `https://tryzene.com/api/tools/ai-readiness`.
3. Zene fetches & scores the site server-side (deterministic, no LLM): 11 signals
   across 3 dimensions (**Access / Understand / Cite**) + a per-engine readiness
   verdict, each gap deep-linked to the tool that fixes it.
4. The popup renders the result; every "more" path hands off to
   `tryzene.com/tools/ai-visibility-checker?url=<domain>` (which auto-runs the
   full report) and on to signup for tracking over time.

## The free / paid line

> **Extension = "what's the state right now" (a snapshot). Zene = "what's
> happening over time, vs competitors, and what to do" (the film).**

| Free in the extension | Redirect to Zene |
| --- | --- |
| AI readiness score + band, instantly, no signup | Daily tracking of the score over time |
| 3 dimensions + per-engine readiness | Real AI **mention** scans (does an engine name you?) |
| Per-signal fixes (deep-linked to Zene tools) | Competitor comparison, history, alerts, PDF |
| Shareable score card (viral loop) | — |

## Permissions (minimal)

- `activeTab` — read the current tab's URL after you click the icon.
- `host_permissions: ["https://tryzene.com/*"]` — call the readiness API from the
  popup. A single, own-domain host (not `<all_urls>`), so Web Store review is easy.

The extension needs **no access to the sites it checks** — Zene fetches them
server-side. (Trade-off: it can't check `localhost`/intranet sites the server
can't reach; those fall back to "Open the full checker on Zene".)

## Layout

```
entrypoints/popup/   index.html · main.tsx · style.css (Zene tokens)
components/          App · ReadinessTab · AiVisibilityTab · ScoreRing
                     Dimensions · Engines · CheckRow · ui
lib/                 api (readiness client) · readiness-types (mirrors PEEX
                     ai-readiness-types.ts) · tone · constants · share-card
scripts/             gen-icons.mjs (dependency-free PNG icon generator)
```

`lib/readiness-types.ts` mirrors `PEEX/src/lib/tools/ai-readiness-types.ts` —
keep them in lockstep if the API's response shape changes.

## Develop

```bash
npm install
npm run dev          # launches Chrome (for Testing) with the extension + HMR
npm run compile      # tsc --noEmit
npm run build        # production build → .output/chrome-mv3
npm run zip          # packaged zip for the Web Store
```

- This machine has no normal Chrome installed, so `web-ext.config.ts` points the
  dev launcher at the puppeteer "Chrome for Testing" build. Install Chrome/Brave/
  Edge for real use, then set `CHROME_PATH` or delete that file.
- To develop against a **local PEEX**: run PEEX on `:3000`, set
  `VITE_ZENE_BASE=http://localhost:3000`, and add `http://localhost:3000/*` to
  `host_permissions` in `wxt.config.ts`.
- Manual load: `chrome://extensions` → Developer mode → Load unpacked →
  `.output/chrome-mv3`.

## Next steps

1. **Publish:** Web Store listing assets + privacy policy (strong story: the
   extension only sends the URL you're on to Zene; nothing else).
2. **Share/OG route** on PEEX so downloaded cards become indexable
   `tryzene.com/...` URLs (more places LLMs can learn the brand).
3. **Competitor compare** in the popup: scan a rival's domain too, show both —
   still one API call each, still free.

All outbound links carry `utm_source=extension` (see `lib/constants.ts`).
