# apps/studio

Sanity v3 Studio for faziz-dev.com. Content recipes: [docs/sanity-guide.md](../../docs/sanity-guide.md).

## Run

```sh
pnpm studio                 # local Studio
pnpm --filter studio build  # validates schema (also CI)
```

Hosted Studio deploys from `main` via `.github/workflows/deploy-studio.yml`.

## Rules that keep the IA clean

- **Talk** = bookable topic, no date. **Event** = dated appearance, usually references a talk. Never model an upcoming gig as a talk.
- Adding a schema field does nothing on the site until it is projected in `apps/web/src/lib/sanity/queries.ts`.
- List pages must tolerate empty query results (empty state or `lib/proof.ts` fallback). Publishing only ever *adds*.
- Country names on events must be the standard English name (`Czechia`, not `Czech Republic`) — they drive flag emojis.

## Prefer Sanity MCP

Use the Sanity MCP to inspect schema and run GROQ rather than guessing field names. Project config is `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` (see `apps/studio/.env.example`).

Do not write content as code unless the user asked for a migration. Editorial content belongs in Studio.
