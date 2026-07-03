# faziz-dev.com

Personal portfolio and speaker platform for Faris Aziz — Staff Software
Engineer, Conference Speaker & Workshop Instructor.

## Tech stack

- **Frontend**: [Astro](https://astro.build/) 5.x with React islands + ViewTransitions
- **CMS**: [Sanity](https://www.sanity.io/) v3 with custom schemas
- **Styling**: Design System v2 — CSS custom-property tokens on Tailwind, enforced by CI guardrails
- **Email**: [Resend](https://resend.com/) (all contact flows are form-based — no `mailto:`)
- **Analytics**: PostHog
- **Hosting**: Vercel (static + ISR homepage)
- **Monorepo**: pnpm workspaces

## Documentation

| Guide | What's in it |
|---|---|
| [`apps/web/README.md`](./apps/web/README.md) | Website architecture: rendering, islands, global behaviors, conventions |
| [`docs/sanity-guide.md`](./docs/sanity-guide.md) | CMS guide: content model, what powers which page, editing recipes |
| [`apps/web/CLAUDE.md`](./apps/web/CLAUDE.md) | Email subsystem: Resend setup, templates, env vars, gotchas |
| [`docs/ui-rules.md`](./docs/ui-rules.md) | Design-system rulebook: tokens, `ds-*` classes, guardrails |
| [`docs/measurement.md`](./docs/measurement.md) | Analytics: event inventory, funnels to build in PostHog |

## Project structure

```
/
├── apps/
│   ├── web/                 # Astro website (see apps/web/README.md)
│   └── studio/              # Sanity Studio (schemas/, desk/)
├── packages/
│   └── shared/              # Shared types & utilities
├── docs/                    # Guides (see table above)
└── scripts/                 # Content migration
```

## Quick start

Prerequisites: Node.js 20+, pnpm 9+, a Sanity account.

```bash
git clone https://github.com/farisaziz12/portfolio-website.git
cd portfolio-website
pnpm install

# Environment
cp apps/web/.env.example apps/web/.env
cp apps/studio/.env.example apps/studio/.env
# Fill in Sanity credentials; email vars are documented in apps/web/CLAUDE.md
```

```bash
pnpm dev        # web + studio
pnpm web        # website only (localhost:4321)
pnpm studio     # Sanity Studio only
pnpm build      # build everything
pnpm --filter web lint   # eslint + UI guardrails
```

Without Sanity credentials/network the site still runs — every fetch falls
back to an empty state or hardcoded proof numbers by design.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero terminal, next events, proof, social wall (ISR ~1h) |
| `/speaking` | Speaking hub: topics, next up, conference wall |
| `/events`, `/events/[slug]` | Full schedule/archive with filters + flags |
| `/talks`, `/talks/[slug]` | Bookable talk catalogue and detail |
| `/workshops`, `/workshops/[slug]` | Workshop catalogue and detail |
| `/workshops/attend/[slug]` | Token-gated attendee page |
| `/invite` | Speaker press kit: bios, headshots, rider, invite form |
| `/contact` | Four doors: speak, consult, mentor, hire — one form |
| `/consulting`, `/mentorship`, `/services` | Service offers (Sanity-driven) |
| `/impact` | Track record with case studies |
| `/appreciation` | Social proof wall |
| `/about`, `/projects`, `/media`, `/blog` | Story, work, gallery, writing |
| `/llms.txt`, `/*.md` | Agent-facing markdown mirrors of every key page |
| `/og/*.png` | Build-time generated Open Graph cards |
| `/rss.xml` | RSS feed |

## Deployment

- **Website**: Vercel — root directory `apps/web`, env vars from
  `apps/web/CLAUDE.md` set on Production *and* Preview.
- **Studio**: `cd apps/studio && npx sanity deploy`

## License

MIT
