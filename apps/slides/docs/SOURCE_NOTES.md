# Source notes

Documentation checked on 2026-09-25. Recheck against the version selected for implementation; the planning bundle does not pin or install dependencies.

## Codex planning

OpenAI documents `/plan` as entering plan mode and accepting an optional inline planning request. Use the command in the active project thread, then submit the planning prompt. This bundle does not toggle another application's mode or launch a Codex run.

```text
https://developers.openai.com/codex/cli/slash-commands/
```

Codex supports project-level AGENTS.md guidance. Merge with existing instructions instead of overwriting a project's established rules.

```text
https://developers.openai.com/codex/guides/agents-md/
```

## Slidev architecture

Themes can supply visual styling, defaults, layouts, and components. Slidev recommends addons for independent functionality. Both support local development; exact package naming, discovery, and compatibility should follow the selected release.

```text
https://sli.dev/guide/write-theme
https://sli.dev/guide/write-addon
https://sli.dev/custom/
```

## Persistent layers

Global layers can persist between slides. Slidev explicitly advises per-slide export for navigation-dependent global layers, or using per-slide layers instead. Do not build a global-state architecture that only works in the live presentation view.

```text
https://sli.dev/features/global-layers
```

## Output boundaries

Slidev documents browser presentation and static exports. Ordinary PPTX export uses slide images; editable PPTX is a separate mode with limitations and raster fallbacks. Neither implies editable Keynote parity or live 3D in a static document. PDF/PNG are the required fallback outputs for this first version.

```text
https://sli.dev/guide/exporting
```

## Project choices versus external facts

The palette, type sizes, package split, namespaced metadata, layout inventory, review gates, and performance/quality criteria in this bundle are proposed project decisions. They are not built-in Slidev APIs or measured performance claims. The avatar and logo instructions come from Faris's choices in the design conversation and the supplied reference images.
