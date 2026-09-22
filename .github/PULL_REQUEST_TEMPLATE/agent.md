## Agent PR

This template is for Cursor / Claude Code / Copilot / Codex (or any other agent) PRs. Humans may use the default template; agents must complete **every** section.

## Summary

<!-- User request in one or two sentences, then what you actually changed. -->

## Model / agent

<!-- e.g. Cursor Cloud Agent, Claude Code, Copilot Workspace -->

## What changed

-

## What did not change

-

## How to test

```sh
pnpm --filter web lint
pnpm --filter web typecheck
pnpm web   # http://localhost:4321
```

Routes exercised:

- `/`

## Visual evidence (required)

UI diffs: embed **before** and **after** screenshots of the real pages. Matching URL, viewport, theme, and scroll position. Desktop always; mobile (~390px) if layout/CSS/header/footer changed. Interactive flows: add a short recording.

Cloud agents: use HTML `<img alt="before …" src="/absolute/artifact.png">` so images rewrite to public URLs.

### Before

<img alt="before REPLACE_ROUTE desktop" src="" />

### After

<img alt="after REPLACE_ROUTE desktop" src="" />

Non-UI only: add an HTML comment whose inner text is exactly `visual-evidence: not-applicable`, then one sentence of reason. Do not leave a placeholder.

## Risks / follow-ups

-

## Checklist

- [ ] Followed `AGENTS.md` and `.cursor/skills/agent-pr-visual-evidence/SKILL.md`
- [ ] Before screenshots were taken **before** editing (or this is N/A)
- [ ] After screenshots match the befores
- [ ] Browser-verified behavior (not just a render)
- [ ] `lint:ui` / typecheck considered
- [ ] Agent surface (`.md` / `llms.txt` / OG) updated if a public page changed
