# UI Design System Rules

This document defines the design system rules for the portfolio website. All components and pages must follow these rules to ensure consistency, accessibility, and good UX.

## Core Principles

1. **Reduce visual noise** - Prefer neutrals, remove unnecessary decoration
2. **Clear hierarchy** - One thing draws attention at a time
3. **Honest interactivity** - If it looks clickable, it must be clickable
4. **Accessibility first** - WCAG AA contrast in both light and dark modes

---

## 1. Color Tokens

### Semantic Tokens

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|------------|-----------|
| `--surface` | Page background | White | Deep blue-black |
| `--surface-raised` | Cards, elevated elements | Off-white | Slate-900 |
| `--surface-overlay` | Hover states, overlays | Light gray | Slate-800 |
| `--ink` | Primary text | Slate-900 | Slate-50 |
| `--ink-muted` | Secondary text | Slate-500 | Slate-300 |
| `--ink-faint` | Metadata, captions | Slate-400 | Slate-400 |
| `--accent` | Primary CTAs, interactive focus | Blue-600 | Blue-400 |
| `--accent-hover` | Accent hover state | Blue-700 | Blue-300 |
| `--accent-muted` | Subtle accent backgrounds (buttons, badges) | Blue-50 | Blue-950 |
| `--edge` | Subtle borders | Slate-200 | Slate-700 |
| `--edge-strong` | Emphasis borders | Slate-300 | Slate-600 |

### Accent Usage Rules

**DO:**
- Use accent for primary CTAs (filled buttons)
- Use accent for link underlines and hover states
- Use accent-muted for subtle button backgrounds
- Use accent sparingly for interactive focus indicators

**DON'T:**
- Use accent as a full section background
- Use accent for large decorative areas
- Use multiple accent colors (stick to one)
- Use colored text for emphasis in body copy

### Background Rules

- **Section backgrounds**: Use neutrals only (`surface`, `surface-raised`)
- **No gradient section backgrounds** for primary content areas
- Gradients allowed only for:
  - Hero image overlays (for readability)
  - Decorative backgrounds with very low opacity (< 10%)
  - Loading/skeleton states

---

## 2. Typography

### Type Scale

| Class | Use Case | Size |
|-------|----------|------|
| `heading-display` | Hero headlines | 3.5-4.5rem |
| `heading-1` | Page titles | 2-2.5rem |
| `heading-2` | Section titles | 1.75-2rem |
| `heading-3` | Subsections, card titles | 1.25-1.5rem |
| `text-lead` | Intro paragraphs | 1.25rem |
| `text-secondary` | Body text | 1rem |
| `text-tertiary` | Captions, metadata | 0.875rem |

### Typography Rules

- **Headlines**: Font-display (Space Grotesk), bold weight
- **Body**: Font-sans (Inter), regular weight
- **Code**: Font-mono (JetBrains Mono)
- **No colored text** for emphasis in body copy
- Use underlines, bold, or visual hierarchy instead

---

## 3. Spacing & Layout

### Content Widths

| Class | Width | Use Case |
|-------|-------|----------|
| `container` | 1120px | Main layout |
| `container-wide` | 920px | Wide content |
| `container-narrow` | 680px | Article/text content |

### Spacing Scale

- Use Tailwind spacing scale
- Related items: 1-2 units apart (icon + text, tag + label)
- Groups: 4-6 units apart
- Sections: 16-24 units (py-16, py-24)

### Grid Rules

- Use consistent column counts per breakpoint
- Cards should fill space evenly (no floating/orphan cards)
- All metadata blocks align to main content column

---

## 4. Interactive Components

### Buttons

Three variants only:

| Variant | Style | Use Case |
|---------|-------|----------|
| `btn-primary` | Accent filled, white text | Primary actions, CTAs |
| `btn-secondary` | Neutral outline | Secondary actions |
| `btn-ghost` | Transparent, text only | Tertiary actions, navigation |

**Button Rules:**
- CTAs must have strong contrast against background
- Never place primary buttons on accent/gradient backgrounds without contrast adjustment
- Hover states: subtle background shift or border change (no random colors)

### Links

| Type | Style |
|------|-------|
| Inline link | Accent underline, neutral text preferred |
| Arrow link | Text with animated arrow, used for "View all" actions |

### Cards

**Interactive Cards:**
- Has hover/focus states (elevation, border change)
- Has cursor pointer
- Full-card is clickable
- Clear destination or action

**Informational Cards:**
- No hover elevation
- No pointer cursor
- No click handlers
- Static content display only

**Every card must be one or the other. Never mix.**

### Tags/Badges

**Default Style:**
- Simple text labels OR subtle outlined pills
- Neutral borders (`border-edge`)
- Neutral text (`text-ink-muted`)
- No colored backgrounds by default

**Interactive Tags:**
- Add hover border change
- Add cursor pointer
- Must have a click action

---

## 5. Images & Media

### Interaction Model: Static with Optional Lightbox

Images follow one consistent model:

**Default (Static):**
- No hover zoom effects
- No cursor pointer
- No click handlers
- Standard appearance

**With Lightbox:**
- Clear visual indicator (icon overlay, zoom cursor)
- Click opens lightbox/modal
- Must be consistent across similar image types

**Rules:**
- Hero/mosaic images: Static unless they open to gallery
- Project screenshots: Can have lightbox
- Never add carousel-like animations unless it's an actual carousel
- Never add hover effects that imply interactivity if there's no action

### Carousels/Sliders

If something visually implies a carousel:
- Make it a real carousel (keyboard accessible, controls, dots)
- OR redesign to look like static content or links

---

## 6. Icons

### Usage Rules

- Keep icons small (4-5 units / 16-20px)
- Align icons close to their labels (1-1.5 units gap)
- Remove icons where they don't add usability
- Use neutral colors for decorative icons

### No Emojis

**Emojis are banned from the UI:**
- Navigation labels
- Card headers
- Tags/badges
- Section titles
- CTAs

Use simple SVG icons if visual distinction is needed.

---

## 7. Navigation

### Labels

- Keep labels concise (1-2 words)
- Avoid verbose/descriptive labels
- Use standard terminology:
  - "Talks" (not "Speaking Engagements")
  - "Workshops"
  - "Events"
  - "Blog"
  - "Projects"

### Dropdown Structure

- Parent label is also a link
- Dropdown items have label only (no descriptions in most cases)
- No emoji icons in dropdowns

---

## 8. Animations & Transitions

### Allowed Animations

- Fade in (opacity)
- Slide in (small translateY/X)
- Scale in (subtle, 0.95-1)
- Hover transitions (transform, opacity, border)

### Rules

- Keep motion subtle and consistent
- No width-changing animations that cause layout shifts
- Respect `prefers-reduced-motion`
- Animation duration: 150-300ms for interactions, up to 600ms for reveals

### Forbidden

- Carousel-like transitions without carousel functionality
- Bounce/wiggle effects on important UI elements
- Infinite animations (except subtle indicators like pulse dots)

---

## 9. Light Mode Contrast Checklist

All text must pass WCAG AA (4.5:1 for normal text, 3:1 for large text):

- [ ] Body text on `surface` background
- [ ] Muted text on `surface` background
- [ ] Text on `surface-raised` background
- [ ] Text on `surface-overlay` background
- [ ] Button text on accent background
- [ ] Link text visibility
- [ ] Placeholder/metadata text

### Common Issues to Avoid

- Hardcoded `text-white` that doesn't adapt to light mode
- Light text on light gradient backgrounds
- Low-opacity text on varying backgrounds

---

## 10. Component Checklist

Before shipping any component:

1. [ ] No emojis
2. [ ] Uses semantic color tokens (not hardcoded colors)
3. [ ] Contrast passes in light mode
4. [ ] Contrast passes in dark mode
5. [ ] Interactive elements have visible focus states
6. [ ] Hover states are consistent with component type
7. [ ] If it looks clickable, it IS clickable
8. [ ] Respects reduced motion preference
9. [ ] Uses appropriate button variant
10. [ ] Tags use neutral styling

---

## Audit Checklist for Pages

When reviewing a page:

1. **Visual noise**: Is there too much competing for attention?
2. **Hierarchy**: Is the most important thing obvious?
3. **Interactivity**: Does every interactive-looking thing work?
4. **Contrast**: Is everything readable in light mode?
5. **Grid alignment**: Do elements align consistently?
6. **Spacing**: Are related items grouped? Are sections distinct?
7. **CTAs**: Are primary actions prominent and accessible?
8. **Emojis**: Are there any emojis? (Remove them)
9. **Accent usage**: Is accent used sparingly and consistently?
