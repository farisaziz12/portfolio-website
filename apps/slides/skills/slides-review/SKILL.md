---
name: slides-review
description: Run and interpret Faris Slides named-deck Playwright checks and native exports. Use for slide quality checks, screenshot inspection and evidence handoffs, without treating machine success as human approval.
---

# Review a Faris deck

Read AGENTS.md, DESIGN.md and the deck's review.md. At the repository root:

```sh
pnpm slides review <talk>
pnpm slides export <talk>
```

Export when requested or needed for delivery. PDF defaults to all click steps;
`--clicks final` uses Slidev's non-expanded export and `--format png` exports
images. Render and inspect every PDF page before calling its appearance checked;
use an available PDF skill for that operation.

Read the exact report.json printed by the command. Review typechecks, builds,
starts the real deck on a private loopback port, blocks other origins, captures
all slide/click states, checks assets/bounds/code size and exercises forward and
backward navigation. Local Vue/Vite files execute code: use trusted in-scope
decks, not arbitrary untrusted repositories.

Inspect every full-size screenshot, including intermediate click states. Check
hierarchy, wrapping, contrast, space, overlap, code legibility, sprite edges
and logo fidelity. JSON checks miss some collisions and composition problems.
Known Slidev 53 FloatingVue warnings are recorded separately; other runtime and
network/asset failures remain failures.

Save findings by slide/click, commands, exact artifact folder, what was inspected
and remaining limits in the deck's review.md. Never replace human findings with
machine output. Every run is separate; do not update approved baselines to hide
regressions. Review-only means propose fixes and stop. When fixing is authorized,
change the smallest input, rerun and inspect again.

Presenter synchronization, overview and offline production rehearsal remain
separate checks. Stop at the visual checkpoint before expanding scope.
