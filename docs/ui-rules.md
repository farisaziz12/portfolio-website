# UI Design System Rules (DS v2.1)

Source of truth for tokens and primitives. Taste and page grammar live in [`taste.md`](./taste.md). All components and pages follow these rules.

Dark-first. Same brand as v2 (electric blue, teal signal, Space Grotesk / Hanken Grotesk / IBM Plex Mono). v2.1 tunes contrast, reading rhythm, and quieter chrome.

## Core Principles

1. **Reduce visual noise** — Neutrals first; one object per beat
2. **Clear hierarchy** — One thing draws attention at a time
3. **Honest interactivity** — If it looks clickable, it is clickable
4. **Accessibility first** — WCAG AA in both themes
5. **Sentence over label** — Headings are claims; kickers are status only

---

## 1. Color Tokens

Canonical values live in `apps/web/src/styles/global.css`. Use `rgb(var(--token))` or the Tailwind bridges (`bg-surface`, `text-ink`, `text-ink-on-accent`). Never raw Tailwind palettes (`slate-800`, `violet-500`).

### Semantic Tokens

| Token | Purpose | Dark | Light | Target ratio |
|-------|---------|------|-------|--------------|
| `--bg` | Page | `#0A0C10` | `#FBFBFA` | — |
| `--surface-1` | Raised chrome (header, terminal) | `#0F131A` | `#FFFFFF` | — |
| `--surface-2` | Cards | `#151A23` | `#F4F5F7` | — |
| `--surface-3` | Hover / overlay | `#1C232E` | `#E8EBF0` | — |
| `--ink` | Primary text | `#F3F5F8` | `#11151C` | 12:1+ |
| `--ink-muted` | Secondary / body lead | `#A9B4C2` | `#424E5E` | 7:1+ |
| `--ink-faint` | Captions, crumbs | `#8B97A6` | `#5C6877` | ≥4.5:1 |
| `--ink-on-accent` | Text on accent fills | `#F3F5F8` | `#FFFFFF` | ≥4.5:1 |
| `--ink-on-signal` | Text on signal fills | `#04110E` | `#04110E` | ≥4.5:1 |
| `--edge` / `--edge-strong` | Borders | `#232B36` / `#34404F` | `#E5E8EC` / `#CDD3DB` | — |
| `--accent` | Links, focus | `#3D7BFF` | `#2862E0` | — |
| `--accent-bright` | Link text on dark | `#6AA1FF` | `#2862E0` | ≥4.5:1 on bg |
| `--accent-deep` | Filled button | `#2862E0` | `#1A4BC0` | — |
| `--accent-press` | Button hover | `#1A4BC0` | `#163E9A` | — |
| `--signal` / `--signal-deep` | Live / available | `#1FCFA6` / `#0E9C7E` | `#0E9C7E` / `#0B7E66` | — |
| `--danger` | Errors | `#FF6B6B` | `#DC2626` | — |
| `--warn` | Community / limited (large/bold only) | `#F2C94C` | `#8F6E0F` | — |

Aliases: `--surface` → surface-1, `--surface-raised` → surface-2, `--surface-overlay` → surface-3, `--accent-hover` → accent-press.

### Accent Usage

**DO:** primary CTAs, link underlines, focus rings. One `.accent-word` or `.mark` per page hero, max.

**DON'T:** accent as a section background; colored emphasis in body copy; blue on every heading.

### Backgrounds

- Section backgrounds: neutrals only. Hairline `--edge` separates sections — do not add alternating `--surface-1` bands on Home / Speaking / About.
- Gradients only for image scrims, decorative opacity < 10%, or skeletons.

---

## 2. Typography

| Role | Family | Size / measure |
|------|--------|----------------|
| Sentence display (`.heading-sentence`) | Space Grotesk 700 | `clamp(2.25rem, 5vw, 3.4rem)`, LH 1.08, max 22–28ch |
| Page title (`.heading-1`) | Space Grotesk | 2–2.5rem |
| Section claim (`.heading-2`, `.home-h2`) | Space Grotesk 600 | `clamp(1.5rem, 2.4vw, 2rem)`, LH 1.2 |
| Card / FAQ evidence | Space Grotesk 600 | 1.15–1.35rem |
| Prose / FAQ / lead | Hanken Grotesk | 1.0625rem, LH 1.7, **62–68ch** |
| Kicker / tags / terminal | IBM Plex Mono | 0.72–0.8rem |

**Kickers are status only** (Next up, Available, Booking). Color `--ink-muted`, not faint. Sentence headings replace “Topics / Global reach / From the community.”

No serif. No Inter / JetBrains in the live UI (those names remain fallbacks only).

---

## 3. Spacing & Layout

| Class | Width | Use |
|-------|-------|-----|
| `container` | 1140px | Main layout |
| `container-wide` / `.wide` | 920px | Wide objects |
| `container-narrow` | 680px | Article / FAQ / bio |

Home / Speaking / About section padding: `clamp(3.25rem, 7vw, 5.5rem)`.

Related items: 1–2 spacing units. Groups: 4–6. Do not invent a second column measure on a prose page.

---

## 4. Interactive Components

### Buttons — three variants

| Class | Style | Use |
|-------|-------|-----|
| `ds-btn ds-btn-primary` | `--accent-deep` fill, `--ink-on-accent` text | Primary CTAs |
| `ds-btn ds-btn-secondary` | Neutral outline | Secondary |
| `ds-btn-ghost` / text | Transparent | Tertiary / nav |

Min-height 44px. Visible `:focus-visible` ring (`--accent` + `--bg` offset). Never `text-white` — use `text-ink-on-accent`.

### Links

| Type | Style |
|------|-------|
| Inline | Accent, underline **at rest** (not only hover) |
| `ds-link` | Arrow + underline; hover draws emphasis, not the only cue |

### Cards

**Interactive:** hover/focus is border + background. No `translateY` lift. Cursor pointer. Whole card is the hit target.

**Informational:** no hover elevation, no pointer, no click. Never mix.

### New primitives (v2.1)

| Class | Role |
|-------|------|
| `ds-claim` | First-person sentence link (replaces audience-router cards) |
| `ds-proof` | Live numbers inside a prose line |
| `ds-quote` | Unedited author + quote + source. No platform-color carnival on Home / Speaking |
| `ds-faq` | Question `h2` + prose answer + optional evidence list |
| `ds-bio` | Paste-ready short bio + copy button (`aria-label="Copy short bio"`, live region) |

Platform chrome on social cards is allowed on `/appreciation` only.

### Tags / chips

Neutral outline + `text-ink-muted` by default. Selected: `bg-accent` + `text-ink-on-accent`. Interactive tags must do something.

---

## 5. Images & Media

Default: static. No hover zoom, no pointer, no click.

Lightbox: icon overlay + zoom cursor, consistent across similar images.

Hero mosaic is static. Do not imply a carousel unless it is one (keyboard, controls).

---

## 6. Icons

16–20px, 1–1.5 units from the label. Neutral unless the icon *is* the status (signal dot).

**No emojis** in nav, card headers, tags, section titles, or CTAs. SVG only.

---

## 7. Navigation

Labels: 1–2 words. Talks, Workshops, Events, Blog, Projects.

Parent mega-menu label is a link. Dropdown items are labels, no emoji.

---

## 8. Motion

Allowed: fade, small translate, subtle scale, hover color/border.

Duration: 150–300ms interactions, up to 600ms reveals. `prefers-reduced-motion` respected. No new infinite motion except status pulse dots.

Forbidden: layout-shifting width animations; bounce on primary UI; carousel motion without a carousel.

---

## 9. Contrast checklist (both themes)

- [ ] `--ink` on `--bg` / `--surface-1` / `--surface-2`
- [ ] `--ink-muted` on `--bg` (body lead, kickers)
- [ ] `--ink-faint` on `--bg` (captions only; ≥4.5:1)
- [ ] `--ink-on-accent` on `--accent-deep` (buttons, skip link, selected chips)
- [ ] `--ink-on-signal` on signal fills (agenda numbers)
- [ ] Links ≥4.5:1; underline at rest for inline
- [ ] Focus ring ≥3:1 against adjacent (WCAG 2.2)
- [ ] `--warn` only at large/bold sizes on dark

Do not use hardcoded `text-white`. Do not use `--ink-faint` for anything smaller than 14px if a check fails.

---

## 10. Component checklist

1. No emojis
2. Semantic tokens only
3. Contrast passes in light **and** dark
4. Visible `:focus-visible`
5. Hover matches interactive vs informational
6. If it looks clickable, it is
7. `prefers-reduced-motion`
8. Correct button variant
9. Tags neutral unless selected
10. One `h1` per page; FAQ questions are `h2`

## Page audit

1. Visual noise — too much competing?
2. Hierarchy — is the sentence obvious?
3. Interactivity honest?
4. Contrast in both themes?
5. Alignment and measure (62–68ch for prose)?
6. Kickers only for status?
7. Primary action reachable and 44px?
8. Accent used once, not everywhere?
