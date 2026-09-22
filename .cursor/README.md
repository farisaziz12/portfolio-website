# Cursor / agent setup

This directory is the Cursor-specific layer. Portable instructions live in `/AGENTS.md` (and nested `apps/*/AGENTS.md`) so Claude Code, Copilot, and other agents get the same map.

## Layout

| Path | Role |
|---|---|
| `../AGENTS.md` | Always-on map: stack, commands, hard constraints, MCP list, PR visual-evidence policy |
| `rules/*.mdc` | Short, scoped constraints. Always-on rules stay tiny; the rest attach by glob. |
| `skills/*/SKILL.md` | Multi-step workflows loaded on demand |
| `mcp.json` | Project MCPs (Sanity, PostHog, Vercel, GitHub) — OAuth, no secrets |
| `environment.json` | Cloud Agent install + `pnpm web` on :4321 |
| `hooks.json` | Stop-hook nags once if a UI diff has no screenshot artifacts |

Human product docs stay in `docs/` and `apps/web/CLAUDE.md`. Rules **point** at them; they do not copy them.

## Why it is split this way

Cursor's own guidance: keep always-on rules lean, put procedures in skills, and use MCP instead of restating dashboards. We had a strong `apps/web/CLAUDE.md` + `docs/*` set and **no** AGENTS.md, rules, skills, MCP config, or PR template — agents were rediscovering the repo every session and shipping PRs with no visual proof.

## MCP auth

After clone, open **Customize → MCP** and authenticate each server (OAuth). Tokens never go in git. Cloud Agents inherit team/user MCP unless this environment restricts them (`mcpServerAllowlist` is intentionally unset).

If PostHog OAuth lands in the US cloud by mistake, switch the URL in `mcp.json` to `https://mcp-eu.posthog.com/mcp` (this project is `eu.posthog.com`).

**Cloud Agent env:** a committed `environment.json` takes precedence over a personal or team dashboard environment for new runs. This one only runs `pnpm install --frozen-lockfile` and starts `pnpm web` on port 4321 so agents can screenshot the site. Delete the file if you need the dashboard snapshot to win.

## Adding guidance later

- Recurring one-line mistake → add it to a **rule** (or a glob rule if it is file-specific).
- A procedure with steps → a **skill**.
- Do not grow `AGENTS.md` past a map. Link out.
