# slidev-theme-faris

Local Slidev theme for Faris Aziz's technical talks.

The public authoring surface is deliberately small:

- Layouts: `cover`, `statement`, and `code`.
- Deck defaults: `themeConfig.farisMode` and `themeConfig.farisBackground`.
- Per-slide overrides: `faris.mode` and `faris.background`.
- Component: `FarisBadge`, using the approved original badge intact.

Supported values:

```yaml
themeConfig:
  farisMode: auto # auto | light | dark
  farisBackground: none # none | arc
```

```yaml
---
layout: statement
faris:
  mode: dark
  background: arc
---
```

The frame owns mode resolution, conference-safe decorative hooks, margins,
footer treatment, and page numbering. Layouts own composition. Deck Markdown
owns the talk content and native Slidev interactions.
