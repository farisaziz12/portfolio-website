# No Rewrite, No Safety Net: sources

No claims verified yet. Opinions and illustrative examples are labelled in outline.md.

## Claims needing Faris's confirmation

| Slide | Claim | Source | Status |
|---|---|---|---|
| 1, 3 | Smallpdf named as the case study | CFP abstract | Confirm still OK after the move to Netlify |
| 3 | React app in production for 13 years | CFP abstract | Unverified |
| 3 | Tens of millions of monthly users | CFP abstract | Unverified, confirm public |
| 3 | Tens of millions in annual revenue | CFP abstract | Unverified, confirm public |
| 3 | Five developers across three squads | CFP abstract | Unverified |
| 4 | No dedicated QA, no automated testing, limited observability | CFP abstract | Unverified |
| 18 | Monthly page views for the cost formula | none | Missing |

## Codebase scan (2026-11-17)

Source: a read-only scan Faris ran with Claude Code in his local smallpdf-web checkout, pasted into chat on 2026-11-17.
Scope: files Faris changed since August 2024 that still exist (about 470 files, about 175 commits), nearly all in auth,
checkout, payments, account, plans and pricing, the header and the A/B experiment service. Counts are approximate (grep-based).
Generic names only on slides; no internal paths, flags or vendor names on slides.

| Slide | Claim | Status |
|---|---|---|
| 2 | Plans fetch still uses a deprecated 2017 API-response helper; new code uses a typed fetch wrapper | From scan |
| 2 notes | Old helper maps to named errors (not found, unsubscribed, internal server error); new wrapper has one generic error | From scan. Whether any caller branches on a named error is NOT verified |
| 5 | Generations table and file counts | From scan, Faris's area only |
| 6 notes | React 16.14; pre-hydration scripts edit server HTML; React 18 hydrateRoot would treat mismatches as errors; legacy-peer-deps hides conflicts | From scan. The React 18 effect is reasoned from React's documented behaviour, not run |
| 8 | Payment-methods service v1 has 1 importer, v2 about 54 | From scan |
| 9 | Checkout flow and "about six generations" | From scan |
| 9 notes | Three payment providers' SDKs are dependencies | From scan. Vendors deliberately not named |

## Illustrative material

- Slide 2 diff: real change, simplified import names, labelled on the slide.
- Slide 14 prompt: example written for the slide 2 migration, not a prompt that was actually run. Labelled on the slide.

## Public-repo warning

This repo is public and published decks are served from faziz-dev.com. Anything copied from the Smallpdf codebase into slides or notes
becomes public: use library and pattern names, not internal paths, file names, flags or numbers Smallpdf has not cleared.

## Assets

None yet beyond the theme's `FarisBadge` and `FarisIllustration` poses.
