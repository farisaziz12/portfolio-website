# UI rules: Design System v3 ("Panels & Bands, dark first")

Tokens: `apps/web/src/styles/tokens.css` (the only place hex lives, besides the satori OG renderer and email
styles). Primitives: `apps/web/src/styles/ds.css`. Components: `apps/web/src/components/v3/`. Page grammar and
the "why": [`taste.md`](./taste.md). The design handoff this implements: V3 Round 1 (Figtree, yellow accent, skewed
bands, numbered posters). If anything here disagrees with `tokens.css`, `tokens.css` wins. Mechanically enforced
subset: `apps/web/scripts/ui-guardrails.mjs` + `conventions.mjs` (`pnpm lint`).

## 1. Colour

| Token | Dark | Light | Use |
|---|---|---|---|
| `--ground` | `#0F0F10` ink | `#F8F4EB` cream | Page |
| `--surface` | `#191A1D` | `#FFFDF8` | Cards, panels, inputs |
| `--hairline` / `--hairline-strong` | `#2A2A2E` / `#44413C` | `#E2DBCD` / `#C9C0B0` | 1px borders / outline buttons, pills |
| `--text` / `--text-muted` / `--text-faint` | `#F8F4EB` / `#C8C1B5` / `#8A8378` | `#0F0F10` / `#57534E` / `#6B655D` | Primary / body / meta |
| `--yellow` | `#F4C63A` | same | **The single accent**: primary buttons, bands, active pills, big numbers |
| `--accent-text` | yellow | `#17688F` | Kickers and small accent text (yellow text fails on cream) |
| `--blue` | `#2E88B8` | same | Only as the band edge, video tiles |
| `--panel*` | cream panel, ink text | ink panel, cream text | The one invitation panel per page |

Rules: ink text on yellow, never white. Never ink-on-ink cards without a hairline. Blue is never text on ink below
18px. No gradients except the band devices and image placeholders. Never use raw palette values for text: use the
semantic tokens so the light theme works.

## 2. Type (Figtree, self-hosted variable 300–900)

| Role | Size / line / tracking / weight |
|---|---|
| Display H1 (`ds-h1`) | 52–56px / 0.95 / -0.045em / 800 (home up to 68px, `ds-h1--xl`) |
| H2 (`ds-h2`) | 30–40px / 1.0 / -0.04em / 800 |
| Small section heading (`ds-label`) | 14px / 700 / 0.12em / uppercase / accent |
| Kicker (`ds-kicker`) | 12px / 700 / 0.14em / uppercase / accent |
| Card title | 20–26px / 1.05 / -0.03em / 800 |
| Body | 17px / 1.5 intro (`ds-lede`), 14.5–15.5px cards, articles 17–18px / 1.65–1.7 at 65ch |
| Meta (`ds-meta`) | 12–13px, `--text-faint` |
| Big numbers | 34–88px / 800 / -0.05em / 0.85–1 |

`text-wrap: balance` on headlines, `pretty` on card text (both global).

## 3. Space and shape

Gutter 40px desktop / 20px phone (`--gutter`), max width 1200px (`ds-wrap`). Section padding 48–64px
(`--section-y`). Card padding 20–28px, card gap 14px. Radius: 4px buttons/inputs, 6px cards/images, 999px pills.
Nothing larger. **No shadows.** Separation is a hairline or a change of ground, never both.

## 4. Graphic devices (code-native)

1. **Band**: 8px bar under the nav, `var(--band)` (blue 12% → yellow). Pages opening with a skewed hero skip it
   (`<BaseLayout band={false}>`).
2. **Skewed panel**: `SkewHero` — yellow block at `skewX(-14deg)`, 8px blue edge, photo clipped in; stacks above
   the headline on phones.
3. **Stripe rule**: `ds-stripe`, 8px dashed yellow beside quotes and list items.
4. **Numbered posters**: `PosterCard`, huge 01/02/03 cropped off the card edge.
5. **Giant faded name**: "Faris" at ~540px, 3.5% opacity behind the home hero (`aria-hidden`).

Illustrations (`Illustration.astro`): used unmodified. Faris only on the cream invitation panel, at most once per
page. Celebrating duck only for genuine success/recognition. Curious duck for technical asides. Photos provide
evidence, illustrations provide character.

## 5. Interaction and motion

- Hover = colour swap only (yellow ↔ cream buttons, border → yellow on cards, text → yellow on rows). No hover motion.
- Focus: `outline: 3px solid yellow; outline-offset: 2px` on everything (global).
- Filters (`FilterPills`): instant, URL-synced (`?topic=`), items fade in 150ms; reduced motion = none.
- No scroll hijacking, cursor effects, looping decoration or autoplay video. `ds-reveal` is a fade only.
- The home opener: once per session, Skip + Esc from 0s, nav usable underneath, reduced motion → static frame.
- Mobile nav is a native `<dialog>`: focus trapped, Esc and backdrop tap close it.

## 6. Accessibility

WCAG 2.2 AA in both themes. Touch targets ≥ 44px. One `<h1>` per page; logical heading order. Every image has alt
text (decorative art gets `alt=""`). Filters are `<button aria-pressed>`; segmented controls have `aria-pressed`
or tab semantics; forms use `aria-invalid` + visible messages and move focus to the first error. Check 390px, 320px,
tablet and 200% zoom: no horizontal scroll.

## 7. Content rules in the UI

- **No emojis** (country flags excepted). Use `Icon.astro` for play / listen / external / arrow glyphs.
- **Numbers come from data.** Derived counts (`getSpeakingStats()`), dated metrics (`dateLabel`), never literals in copy.
- Never "most watched" without a dated source. Never "essays"/"notes" for writing. No newsletter signup UI.
- Forms show success only after the server confirms storage; failure says nothing was stored and keeps the text.
- No `mailto:` anywhere in site UI (see `apps/web/CLAUDE.md`).

## 8. Checklist for a new component or page

1. Tokens and `ds-*` primitives only; scoped `<style>`; no hex, no `style="…"` strings, no Tailwind palette classes.
2. Works at 320px with no overflow; grids collapse to one column below ~720px.
3. Light theme reads correctly (semantic tokens).
4. `data-track` on CTAs; `.md` mirror + OG card + `llms.txt` entry for new public pages (`add-site-page` skill).
5. `pnpm lint` and `pnpm --filter web typecheck` pass; screenshots before/after in the PR.
