---
name: agent-pr-visual-evidence
description: Capture before/after screenshots (and recordings) and embed them in every agent-authored pull request. Use whenever opening, updating, or describing a PR, after UI/layout/CSS/email visual changes, or when finishing a Cursor/Claude/Copilot agent task that will be reviewed on GitHub.
---

# Agent PR visual evidence

Visual proof is required for agent PRs. CI (`.github/workflows/agent-pr-visual-evidence.yml`) will fail the PR if this skill is skipped on a UI diff.

## Classify the diff

Visual surface (screenshots **required**, N/A **forbidden**):

- `apps/web/src/pages/**` except `api/` and `*.md.ts`
- `apps/web/src/components/**`
- `apps/web/src/layouts/**`
- `apps/web/src/styles/**`
- `apps/web/src/emails/**`
- `apps/web/src/pages/og/**`
- `apps/web/tailwind.config.*`

Everything else: N/A is allowed with the HTML comment plus one sentence.

## Before you edit

1. Start the site (`pnpm web` → http://localhost:4321). Missing Sanity is fine (fallbacks).
2. Open every route your change will touch, in the theme that is canonical (**dark**) and again in **light** if you touch color/text.
3. Capture **before** screenshots. Name files `before_<route>_<viewport>.png` (e.g. `before_talks_desktop.png`, `before_talks_mobile.png`).
4. Viewport: desktop ~1280px. Add mobile ~390px when the change is layout, CSS, header/footer, or responsive.

Do not crop so tightly that the surrounding page context is gone. Do not screenshot the IDE.

## After you edit

1. Verify like a user: click, type, submit, navigate. A single render is not verification. Check other routes that share the state/components you touched. Hunt regressions.
2. Capture **after** screenshots of the **same URLs, viewport, theme, and scroll position** as the befores. Name `after_<route>_<viewport>.png`.
3. Interactive flows (forms, filters, theme toggle, command palette, cal.com modal): record one short walkthrough (start recording → perform the flow → save). Do not upload failing runs.
4. Edge states that your change owns (empty, error, loading) get a screenshot if you added or changed them.

Cloud agents: use the `computerUse` subagent + `RecordScreen` and copy keepers into the walkthrough artifacts directory. Local agents: save PNGs you can embed (GitHub-hosted, or commit only if the user asked).

## Write the PR

Use `.github/PULL_REQUEST_TEMPLATE.md`. Agent PRs also fill `.github/PULL_REQUEST_TEMPLATE/agent.md`.

In **Visual evidence**:

- Headings or alt text must include the words `before` and `after`.
- Embed images in the body (markdown `![after talks desktop](...)` or HTML `<img alt="after talks desktop" src="...">`).
- Cloud agents **must** use HTML `<img>` tags with absolute artifact paths so the PR tool can rewrite them to public URLs, for example:

```html
### Before
<img alt="before talks desktop" src="/opt/cursor/artifacts/before_talks_desktop.png" />

### After
<img alt="after talks desktop" src="/opt/cursor/artifacts/after_talks_desktop.png" />
```

- Non-visual diffs only:

```html
<!-- visual-evidence: not-applicable -->
```

plus one sentence (e.g. "CI/docs only; no page, component, layout, style, or email template changed.").

## Do not ship

- After-only screenshots
- Code or terminal shots as "visual evidence"
- Failed test recordings
- A toy/fake page instead of the real route
- N/A on a UI diff (CI rejects it)
