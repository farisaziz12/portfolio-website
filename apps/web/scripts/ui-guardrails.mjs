#!/usr/bin/env node
/**
 * UI guardrails — keeps the Design System v2 consolidation from regressing.
 * Run via `pnpm lint:ui` (also part of `pnpm lint`). Rules live in
 * docs/ui-rules.md; this script enforces the mechanically checkable subset:
 *
 *   1. No raw Tailwind palette classes (slate-800, violet-500, …) outside
 *      src/emails/ — use the token utilities (surface/ink/accent/signal/edge,
 *      danger, or rgb(var(--warn))) so both themes work.
 *   2. No new hex color literals outside global.css / emails — allowed:
 *      LinkedIn brand #0a66c2, pure white/black in image-scrim contexts
 *      (tracked by a baseline count so existing scrims don't fail the build).
 *   3. No new inline style="…" attributes in .astro files (baseline-counted —
 *      shrink the number, never grow it).
 *
 * If you legitimately need an exception, add it to the allowlists below with
 * a comment saying why.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

// ——— Baselines: current counts. Lower them as cleanup continues; the check
// fails only when a count EXCEEDS its baseline (i.e. a regression).
const BASELINES = {
  inlineStyles: 50, // style="…" attributes in .astro files
  hexLiterals: 15, // hex colors outside global.css/emails (scrims over images etc.)
};

// Files allowed to contain raw palette *strings* (not rendered classes):
const PALETTE_ALLOWLIST = new Set([
  // Legacy Sanity `category.color` values used as lookup keys only.
  'src/components/impact/MetricCard.astro',
]);

const PALETTE_RE =
  /\b(?:bg|text|border|from|via|to|ring|shadow|fill|stroke|decoration|outline|divide|placeholder|caret|accent)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}\b/g;
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const HEX_ALLOWED = /#0a66c2|#fff\b|#ffffff\b|#000\b|#000000\b/i;
const INLINE_STYLE_RE = /style="/g;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let paletteViolations = [];
let hexCount = 0;
let hexExamples = [];
let inlineCount = 0;

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file);
  if (rel.startsWith('src/emails/')) continue;
  if (!/\.(astro|tsx|ts|jsx)$/.test(file)) continue;
  const text = readFileSync(file, 'utf8');

  if (!PALETTE_ALLOWLIST.has(rel)) {
    for (const m of text.matchAll(PALETTE_RE)) {
      const line = text.slice(0, m.index).split('\n').length;
      paletteViolations.push(`${rel}:${line} ${m[0]}`);
    }
  }

  // og.ts renders social cards with satori, which has no CSS-variable support —
  // hex literals there are mandatory (kept in sync with global.css tokens).
  if (!rel.endsWith('global.css') && rel !== 'src/lib/og.ts') {
    for (const m of text.matchAll(HEX_RE)) {
      if (HEX_ALLOWED.test(m[0])) continue;
      hexCount++;
      if (hexExamples.length < 10) {
        const line = text.slice(0, m.index).split('\n').length;
        hexExamples.push(`${rel}:${line} ${m[0]}`);
      }
    }
  }

  if (file.endsWith('.astro')) {
    inlineCount += [...text.matchAll(INLINE_STYLE_RE)].length;
  }
}

let failed = false;

if (paletteViolations.length > 0) {
  failed = true;
  console.error(`✗ Raw Tailwind palette classes found (${paletteViolations.length}) — use token utilities instead:`);
  for (const v of paletteViolations.slice(0, 20)) console.error(`   ${v}`);
} else {
  console.log('✓ No raw Tailwind palette classes');
}

if (hexCount > BASELINES.hexLiterals) {
  failed = true;
  console.error(`✗ Hex color literals: ${hexCount} (baseline ${BASELINES.hexLiterals}) — use rgb(var(--token)):`);
  for (const v of hexExamples) console.error(`   ${v}`);
} else {
  console.log(`✓ Hex literals within baseline (${hexCount}/${BASELINES.hexLiterals})`);
}

if (inlineCount > BASELINES.inlineStyles) {
  failed = true;
  console.error(`✗ Inline style="…" attributes: ${inlineCount} (baseline ${BASELINES.inlineStyles}) — prefer classes/tokens`);
} else {
  console.log(`✓ Inline styles within baseline (${inlineCount}/${BASELINES.inlineStyles})`);
}

process.exit(failed ? 1 : 0);
