# Zene — AI Visibility Checker (Chrome extension)

Free, zero-signup Chrome extension that scores any website's **GEO readiness** —
whether ChatGPT, Claude, Gemini & Perplexity can actually read & represent the
brand. The viral, top-of-funnel companion to [Zene](https://tryzene.com) (PEEX).

## The free / paid line

The whole product strategy lives in one rule:

> **Extension = "what's the state right now" (a snapshot). Zene = "what's
> happening over time, vs competitors, and what to do" (the film).**

| Free in the extension (instant, no signup, $0) | Redirect to Zene |
| --- | --- |
| GEO Readiness score 0–100 (robots / llms.txt / schema / JS-render / firewall) | Daily tracking of the score over time |
| 3 concrete fixes | All 10+ prompts (extension shows a teaser) |
| Shareable score card (viral loop) | All 4 engines, side-by-side |
| 1 free AI mention check (later, via `extension-check`) | Competitor comparison, history, alerts, PDF |

The free readiness audit runs **entirely in the browser** (same-origin fetches),
so it has zero marginal cost and no abuse surface. The expensive part (do engines
actually *name* you?) is the redirect surface.

## Architecture

- **WXT** (MV3 framework) + **React 19** + **Tailwind v4**, Zene design tokens
  ported from `PEEX/src/styles/globals.css`.
- **Minimal permissions:** `activeTab` + `scripting` only. No `host_permissions`.
  The readiness probe (`lib/collector.ts → probeInPage`) is injected into the
  active tab via `chrome.scripting.executeScript`, so its `robots.txt` / homepage
  / `llms.txt` fetches are **same-origin** to the page the user is already on.
- **`lib/site-health.ts`** is ported almost verbatim from
  `PEEX/supabase/functions/run-scan/site-health-checks.ts` — same `parseRobots` /
  `isBotBlocked` / check semantics, so the extension and the SaaS never disagree
  on what "blocked" means. Keep them in sync when either changes.
- **`lib/scoring.ts`** turns checks → 0–100 (weights: ai_bots 35, schema 20,
  js_render 20, llms_txt 15, firewall 10; `unchecked` is excluded, never penalized).
- **`lib/share-card.ts`** renders a 1200×630 OG card client-side. Every card says
  "measured by Zene · tryzene.com" — each share is a contextual brand mention.

```
entrypoints/popup/   index.html · main.tsx · style.css (tokens)
components/          App · ReadinessTab · AiVisibilityTab · ScoreRing · CheckRow · ui
lib/                 site-health · collector · scoring · copy · constants · share-card · types
scripts/            gen-icons.mjs (dependency-free PNG icon generator)
```

## Develop

```bash
npm install
npm run dev          # launches Chrome with the extension + HMR
npm run compile      # tsc --noEmit
npm run build        # production build → .output/chrome-mv3
npm run zip          # packaged zip for the Web Store
```

To load the build manually: `chrome://extensions` → enable Developer mode →
"Load unpacked" → select `.output/chrome-mv3`.

## Next steps

1. **`extension-check` Edge Function** in PEEX: a public, no-auth, hard
   rate-limited (1 / install) wrapper over the existing `canonical_scan` cache so
   the AI Visibility tab can show one real mention result at ~$0 (cache hits).
2. **`tryzene.com/free-ai-checker`** landing (the dofollow link target) + an
   OG-image share route so cards become indexable URLs, not just downloads.
3. Open-source the deterministic readiness checks (no secrets) for GitHub reach.

All outbound links carry `utm_source=extension` (see `lib/constants.ts`).
