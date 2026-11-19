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

## Faris, in chat (2026-11-19)

Role: Senior Software Engineer at Netlify, previously Smallpdf. React version stated as 16.8 "for example" (scan read 16.14; slides say React 16).
About 50,000 users see a release within 30 minutes. Account system migrated more than once. Web views in mobile apps share views with the web.
Cross-browser support including Safari storage limits. No unit, integration or end-to-end tests. "Run out of Datadog observability in 2 weeks":
clarified 2026-11-19, retention capped at two weeks because longer retention cost too much. TrackJS, not Sentry, with limited filtering and querying. Custom analytics: Redshift queried through Metabase.
Three checkouts: mobile view, marketing emails, UTM landing pages. A/B tests run in versions; closed tests keep existing segments; assignment in
localStorage; account flags such as the payment gateway used to derive A/B state for parity. Internal MCP server on Redshift; AGENTS.md / CLAUDE.md
rule mapping PR hot paths to events. Deprecation analytics events. Lower cyclomatic complexity means fewer paths to instrument. Event cost at scale.
Confirmed 2026-11-19: the three checkouts were never merged; all three lived in the codebase. Migration slides are framed as the approach.

## Public sources

| Slide | Claim | Source |
|---|---|---|
| 3, 4 | `<Activity>` and `useEffectEvent` shipped in React 19.2 on 1 Oct 2025 | https://react.dev/blog/2025/10/01/react-19-2 (checked 2026-11-19) |
| 5 | React Compiler 1.0 stable, 7 Oct 2025 | https://react.dev/blog/2025/10/07/react-compiler-1 (checked 2026-11-19) |
| strangler fig | Martin Fowler's strangler fig application | https://martinfowler.com/bliki/StranglerFigApplication.html (not fetched; secondary sources agree) |
| branch by abstraction | Parallel change and branch by abstraction | https://martinfowler.com/bliki/ParallelChange.html (checked 2026-11-19) |
| cost | ~2.4M requests a day = 50,000 per 30 min × 48 | Arithmetic; assumes steady traffic and one session per user |

## Illustrative material

- Slide 2 diff: real change, simplified import names, labelled on the slide.
- Slide 14 prompt: example written for the slide 2 migration, not a prompt that was actually run. Labelled on the slide.

## Public-repo warning

This repo is public and published decks are served from faziz-dev.com. Anything copied from the Smallpdf codebase into slides or notes
becomes public: use library and pattern names, not internal paths, file names, flags or numbers Smallpdf has not cleared.

## Assets

None yet beyond the theme's `FarisBadge` and `FarisIllustration` poses.
