#!/usr/bin/env node
/**
 * Project conventions that ESLint doesn't cover well (Astro templates,
 * file-size debt, CMS fail-open). Run via `pnpm --filter web lint`
 * (also `pnpm lint:conventions`).
 *
 *   1. File size: new files stay under a cap; existing oversized files cannot grow
 *      (baselines in file-size-baselines.json). Shrink freely; `--write-baselines`
 *      ratchets the JSON down.
 *   2. No `mailto:` outside admin email templates.
 *   3. No NEW decorative emojis (flag regional-indicators are allowed). Existing
 *      emoji counts are ratcheted in emoji-baselines.json.
 *   4. `new Resend(` only in lib/email.ts.
 *   5. No `import.meta.env.RESEND_*` / `process.env.RESEND_*` / `process.env.ADMIN_PASSWORD`
 *      — use env() from lib/email.ts.
 *   6. Every sanityFetch(...) call site must have .catch(...) so a CMS outage
 *      cannot 500 a page.
 *   7. Explicit `any` counts are ratcheted (any-baselines.json) — they can only shrink.
 *   8. New public pages need a sibling `.md.ts` mirror. Existing gaps are listed in
 *      missing-md-mirrors.json and cannot grow.
 *
 * `--self-test` runs fixture assertions. `--write-baselines` rewrites the JSON
 * files from the current tree (use after shrinking a giant file).
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(HERE, '..');
const REPO_ROOT = join(WEB_ROOT, '..', '..');
const SRC = join(WEB_ROOT, 'src');
const SIZE_FILE = join(HERE, 'file-size-baselines.json');
const EMOJI_FILE = join(HERE, 'emoji-baselines.json');
const ANY_FILE = join(HERE, 'any-baselines.json');
const MIRROR_FILE = join(HERE, 'missing-md-mirrors.json');

const SOURCE_EXT = /\.(astro|tsx|ts|jsx|js|mjs|css)$/;
const UI_EXT = /\.(astro|tsx|jsx)$/;

/** New files (not in the baseline JSON) must stay under this. */
const NEW_FILE_MAX = {
  'src/components/islands': 400,
  'src/components': 350,
  'src/pages': 500,
  'src/layouts': 400,
  'src/lib': 400,
  'src/emails': 200,
  'src/styles': 400,
  default: 400,
};

const MAILTO_ALLOW = /^src\/emails\/(Invite|Mentorship|Contact)AdminEmail\.tsx$/;
const RESEND_NEW_ALLOW = /^src\/lib\/email\.ts$/;
const SECRET_ENV_RE = /(?:import\.meta\.env|process\.env)\.(?:RESEND_[A-Z0-9_]+|ADMIN_PASSWORD)/;

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.astro') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function rel(file) {
  return relative(WEB_ROOT, file).replaceAll('\\', '/');
}

function lineCount(text) {
  if (!text) return 0;
  const lines = text.split(/\r?\n/);
  if (lines.at(-1) === '') lines.pop();
  return lines.length;
}

function capFor(relPath) {
  for (const [prefix, max] of Object.entries(NEW_FILE_MAX)) {
    if (prefix === 'default') continue;
    if (relPath.startsWith(prefix + '/') || relPath === prefix) return max;
  }
  return NEW_FILE_MAX.default;
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function loadText(file) {
  return readFileSync(file, 'utf8');
}

/** Match `<...>` then `(...)` after `sanityFetch`, ignoring strings. */
function skipString(text, i) {
  const q = text[i];
  if (q !== '"' && q !== "'" && q !== '`') return i;
  i++;
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text[i] === q) return i + 1;
    i++;
  }
  return i;
}

function matchBalanced(text, start, open, close) {
  if (text[start] !== open) return -1;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const skipped = skipString(text, i);
    if (skipped !== i) {
      i = skipped - 1;
      continue;
    }
    if (open !== '{' && text[i] === '{') {
      const end = matchBalanced(text, i, '{', '}');
      if (end < 0) return -1;
      i = end;
      continue;
    }
    if (text[i] === open) depth++;
    else if (text[i] === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function skipWs(text, i) {
  while (i < text.length && /\s/.test(text[i])) i++;
  return i;
}

/** Explicit `any` usages we want to shrink (`as any`, `: any`, `<any>`). */
export function countExplicitAny(text) {
  const matches = text.match(/(?:\bas\s+any\b|:\s*any\b|<\s*any\s*[>,])/g);
  return matches ? matches.length : 0;
}

/** Sibling markdown mirror for a public `.astro` page, or null if not required. */
export function expectedMdMirror(relPath) {
  if (!relPath.startsWith('src/pages/') || !relPath.endsWith('.astro')) return null;
  const fromPages = relPath.slice('src/pages/'.length);
  if (fromPages === '404.astro') return null;
  if (fromPages.startsWith('api/')) return null;
  if (fromPages.startsWith('admin/')) return null;
  if (fromPages.startsWith('og/')) return null;
  if (fromPages.startsWith('workshops/attend/')) return null;
  if (fromPages === 'index.astro') return 'src/pages/home.md.ts';
  if (fromPages.endsWith('/index.astro')) {
    return `src/pages/${fromPages.replace(/\/index\.astro$/, '.md.ts')}`;
  }
  return `src/pages/${fromPages.replace(/\.astro$/, '.md.ts')}`;
}

export function findSanityFetchCalls(text) {
  const calls = [];
  const re = /\bsanityFetch\b/g;
  let m;
  while ((m = re.exec(text))) {
    const before = text.slice(Math.max(0, m.index - 80), m.index);
    if (/\bfunction\s+$/.test(before) || /export\s+async\s+function\s+$/.test(before)) {
      continue;
    }
    let i = skipWs(text, m.index + 'sanityFetch'.length);
    if (text[i] === '<') {
      const end = matchBalanced(text, i, '<', '>');
      if (end < 0) continue;
      i = skipWs(text, end + 1);
    }
    if (text[i] !== '(') continue;
    const close = matchBalanced(text, i, '(', ')');
    if (close < 0) continue;
    const after = skipWs(text, close + 1);
    const hasCatch = text.slice(after, after + 6) === '.catch';
    const line = text.slice(0, m.index).split('\n').length;
    calls.push({ index: m.index, line, hasCatch });
    re.lastIndex = close + 1;
  }
  return calls;
}

/** Decorative emoji count; regional-indicator pairs (flags) are free. */
export function countDecorativeEmojis(text) {
  const withoutFlags = text.replace(/\p{Regional_Indicator}{2}/gu, '');
  const matches = withoutFlags.match(/\p{Extended_Pictographic}/gu);
  return matches ? matches.length : 0;
}

function mailtoHits(text, relPath) {
  if (MAILTO_ALLOW.test(relPath)) return [];
  const hits = [];
  const re = /mailto:/gi;
  let m;
  while ((m = re.exec(text))) {
    const line = text.slice(0, m.index).split('\n').length;
    // Allow the word in comments that mention the policy.
    const lineText = text.split('\n')[line - 1] || '';
    if (/no `?mailto:?`?|never a raw `mailto:`|only allowed `mailto:`/i.test(lineText)) continue;
    if (lineText.trim().startsWith('//') || lineText.trim().startsWith('*') || lineText.trim().startsWith('<!--')) {
      continue;
    }
    hits.push(line);
  }
  return hits;
}

function collectSourceFiles() {
  const files = [];
  for (const file of walk(SRC)) {
    if (!SOURCE_EXT.test(file)) continue;
    files.push(file);
  }
  return files;
}

export function evaluateFile(relPath, text, sizeBaselines, emojiBaselines, anyBaselines = {}) {
  const errors = [];
  const notes = [];
  const lines = lineCount(text);
  const cap = capFor(relPath);
  const sizeBase = sizeBaselines[relPath];

  if (sizeBase != null) {
    if (lines > sizeBase) {
      errors.push(
        `${relPath}: ${lines} lines (baseline ${sizeBase}). Split it — oversized files cannot grow.`,
      );
    } else if (lines < sizeBase) {
      notes.push(`${relPath}: ${lines} lines, baseline ${sizeBase}. Run --write-baselines to ratchet down.`);
    }
  } else if (lines > cap) {
    errors.push(
      `${relPath}: ${lines} lines (new-file cap ${cap}). Split before adding this file, or it must stay under the cap.`,
    );
  }

  for (const line of mailtoHits(text, relPath)) {
    errors.push(`${relPath}:${line} mailto: is banned in site UI (admin email templates only).`);
  }

  if (UI_EXT.test(relPath) && !relPath.startsWith('src/emails/')) {
    const emojis = countDecorativeEmojis(text);
    const eBase = emojiBaselines[relPath] ?? 0;
    if (emojis > eBase) {
      errors.push(
        `${relPath}: ${emojis} decorative emoji(s) (baseline ${eBase}). Use SVG; flags (regional indicators) are allowed.`,
      );
    } else if (emojis < eBase) {
      notes.push(`${relPath}: ${emojis} emoji(s), baseline ${eBase}. Run --write-baselines to ratchet down.`);
    }
  }

  if (/\bnew\s+Resend\s*\(/.test(text) && !RESEND_NEW_ALLOW.test(relPath)) {
    const line = text.slice(0, text.search(/\bnew\s+Resend\s*\(/)).split('\n').length;
    errors.push(`${relPath}:${line} new Resend() belongs in src/lib/email.ts — use sendOrLog().`);
  }

  const secretEnv = text.match(SECRET_ENV_RE);
  if (secretEnv && !RESEND_NEW_ALLOW.test(relPath)) {
    const line = text.slice(0, text.search(SECRET_ENV_RE)).split('\n').length;
    errors.push(
      `${relPath}:${line} ${secretEnv[0]} — use env() from src/lib/email.ts (import.meta.env inlines undefined on Vercel).`,
    );
  }

  if (/\.(ts|tsx|astro|js|mjs)$/.test(relPath)) {
    const anys = countExplicitAny(text);
    const aBase = anyBaselines[relPath] ?? 0;
    if (anys > aBase) {
      errors.push(
        `${relPath}: ${anys} explicit any (baseline ${aBase}). Use a real type or unknown — any counts cannot grow.`,
      );
    } else if (anys < aBase) {
      notes.push(`${relPath}: ${anys} any, baseline ${aBase}. Run --write-baselines to ratchet down.`);
    }
  }

  if (relPath !== 'src/lib/sanity/client.ts' && /\bsanityFetch\b/.test(text)) {
    for (const call of findSanityFetchCalls(text)) {
      if (!call.hasCatch) {
        errors.push(
          `${relPath}:${call.line} sanityFetch(...) must be followed by .catch(...) so a CMS outage cannot 500 the page.`,
        );
      }
    }
  }

  return {
    errors,
    notes,
    lines,
    emojis: UI_EXT.test(relPath) ? countDecorativeEmojis(text) : 0,
    anys: countExplicitAny(text),
  };
}

function collectAstroPages() {
  const pages = join(SRC, 'pages');
  const files = [];
  for (const file of walk(pages)) {
    if (file.endsWith('.astro')) files.push(file);
  }
  return files;
}

function currentMissingMirrors() {
  const missing = [];
  for (const file of collectAstroPages()) {
    const r = rel(file);
    const expected = expectedMdMirror(r);
    if (!expected) continue;
    if (!existsSync(join(WEB_ROOT, expected))) missing.push(r);
  }
  missing.sort();
  return missing;
}

function checkPageMirrors(allowlist) {
  const errors = [];
  const notes = [];
  const allowed = new Set(allowlist);
  const missing = currentMissingMirrors();
  for (const r of missing) {
    if (allowed.has(r)) continue;
    const expected = expectedMdMirror(r);
    errors.push(
      `${r}: public page needs sibling ${expected}. Follow .cursor/skills/add-site-page/SKILL.md — do not add it to missing-md-mirrors.json.`,
    );
  }
  for (const r of allowlist) {
    if (!missing.includes(r)) {
      notes.push(`${r}: now has a .md mirror. Run --write-baselines to drop it from missing-md-mirrors.json.`);
    }
  }
  return { errors, notes };
}

function writeBaselines() {
  const size = {};
  const emoji = {};
  const any = {};
  for (const file of collectSourceFiles()) {
    const r = rel(file);
    const text = loadText(file);
    const lines = lineCount(text);
    const cap = capFor(r);
    if (lines > cap) size[r] = lines;
    if (UI_EXT.test(r) && !r.startsWith('src/emails/')) {
      const n = countDecorativeEmojis(text);
      if (n > 0) emoji[r] = n;
    }
    const anys = countExplicitAny(text);
    if (anys > 0) any[r] = anys;
  }
  const sizeSorted = Object.fromEntries(Object.entries(size).sort((a, b) => a[0].localeCompare(b[0])));
  const emojiSorted = Object.fromEntries(Object.entries(emoji).sort((a, b) => a[0].localeCompare(b[0])));
  const anySorted = Object.fromEntries(Object.entries(any).sort((a, b) => a[0].localeCompare(b[0])));
  const mirrors = currentMissingMirrors();
  writeFileSync(SIZE_FILE, JSON.stringify(sizeSorted, null, 2) + '\n');
  writeFileSync(EMOJI_FILE, JSON.stringify(emojiSorted, null, 2) + '\n');
  writeFileSync(ANY_FILE, JSON.stringify(anySorted, null, 2) + '\n');
  writeFileSync(MIRROR_FILE, JSON.stringify(mirrors, null, 2) + '\n');
  console.log(`Wrote ${Object.keys(sizeSorted).length} size baselines → ${relative(REPO_ROOT, SIZE_FILE)}`);
  console.log(`Wrote ${Object.keys(emojiSorted).length} emoji baselines → ${relative(REPO_ROOT, EMOJI_FILE)}`);
  console.log(`Wrote ${Object.keys(anySorted).length} any baselines → ${relative(REPO_ROOT, ANY_FILE)}`);
  console.log(`Wrote ${mirrors.length} missing md-mirrors → ${relative(REPO_ROOT, MIRROR_FILE)}`);
}

function selfTest() {
  const cases = [
    {
      name: 'sanityFetch with catch passes',
      fn: () => findSanityFetchCalls("await sanityFetch<Foo[]>(q).catch(() => [])").every((c) => c.hasCatch),
    },
    {
      name: 'sanityFetch without catch fails',
      fn: () => findSanityFetchCalls('await sanityFetch<Foo[]>(q);').some((c) => !c.hasCatch),
    },
    {
      name: 'nested generic still parsed',
      fn: () => {
        const calls = findSanityFetchCalls(
          'await sanityFetch<Array<{ slug: string }>>(allServiceLandingPagesQuery).catch(() => [])',
        );
        return calls.length === 1 && calls[0].hasCatch;
      },
    },
    {
      name: 'definition is ignored',
      fn: () => findSanityFetchCalls('export async function sanityFetch<T>(query: string) {}').length === 0,
    },
    {
      name: 'flags are not decorative',
      fn: () => countDecorativeEmojis('Hello 🇨🇿 there') === 0,
    },
    {
      name: 'search emoji counts',
      fn: () => countDecorativeEmojis('empty 🔍 state') === 1,
    },
    {
      name: 'new file over cap fails',
      fn: () =>
        evaluateFile('src/components/design/Huge.astro', 'x\n'.repeat(401), {}, {}).errors.length > 0,
    },
    {
      name: 'existing file cannot grow',
      fn: () =>
        evaluateFile('src/pages/index.astro', 'x\n'.repeat(10), { 'src/pages/index.astro': 9 }, {})
          .errors.length > 0,
    },
    {
      name: 'mailto in island fails',
      fn: () =>
        evaluateFile('src/components/islands/X.tsx', 'href="mailto:hi@x.com"\n', {}, {}).errors.some((e) =>
          e.includes('mailto:'),
        ),
    },
    {
      name: 'admin email mailto allowed',
      fn: () =>
        evaluateFile('src/emails/InviteAdminEmail.tsx', 'href={`mailto:x@y.com`}\n', {}, {}).errors.filter((e) =>
          e.includes('mailto:'),
        ).length === 0,
    },
    {
      name: 'explicit any is counted',
      fn: () => countExplicitAny('const x: any = 1; foo as any; bar<any>') === 3,
    },
    {
      name: 'any ratchet fails on growth',
      fn: () =>
        evaluateFile('src/pages/x.astro', 'const x: any = 1\n', {}, {}, { 'src/pages/x.astro': 0 }).errors.some((e) =>
          e.includes('explicit any'),
        ),
    },
    {
      name: 'index.astro maps to home.md.ts',
      fn: () => expectedMdMirror('src/pages/index.astro') === 'src/pages/home.md.ts',
    },
    {
      name: 'admin and api pages skip mirrors',
      fn: () =>
        expectedMdMirror('src/pages/admin/index.astro') === null &&
        expectedMdMirror('src/pages/api/invite.ts') === null &&
        expectedMdMirror('src/pages/workshops/attend/[token].astro') === null,
    },
    {
      name: 'direct RESEND env is banned',
      fn: () =>
        evaluateFile('src/pages/api/x.ts', 'const k = import.meta.env.RESEND_API_KEY\n', {}, {}).errors.some((e) =>
          e.includes('RESEND_API_KEY'),
        ),
    },
    {
      name: 'env() in email.ts is allowed',
      fn: () =>
        evaluateFile('src/lib/email.ts', 'const k = process.env.RESEND_API_KEY\n', {}, {}).errors.filter((e) =>
          e.includes('RESEND_'),
        ).length === 0,
    },
  ];
  let failed = 0;
  for (const c of cases) {
    try {
      if (!c.fn()) {
        failed++;
        console.error(`FAIL ${c.name}`);
      } else {
        console.log(`ok   ${c.name}`);
      }
    } catch (err) {
      console.error(`FAIL ${c.name}`, err);
      failed++;
    }
  }
  if (failed) {
    console.error(`${failed} self-test(s) failed`);
    process.exit(1);
  }
  console.log('self-test passed');
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) {
    selfTest();
    return;
  }
  if (args.includes('--write-baselines')) {
    writeBaselines();
    return;
  }

  const sizeBaselines = readJson(SIZE_FILE, {});
  const emojiBaselines = readJson(EMOJI_FILE, {});
  const anyBaselines = readJson(ANY_FILE, {});
  const mirrorAllow = readJson(MIRROR_FILE, []);
  const errors = [];
  const notes = [];

  for (const file of collectSourceFiles()) {
    const r = rel(file);
    const result = evaluateFile(r, loadText(file), sizeBaselines, emojiBaselines, anyBaselines);
    errors.push(...result.errors);
    notes.push(...result.notes);
  }

  const mirrors = checkPageMirrors(Array.isArray(mirrorAllow) ? mirrorAllow : []);
  errors.push(...mirrors.errors);
  notes.push(...mirrors.notes);

  for (const n of notes) console.log(`ℹ ${n}`);

  if (errors.length) {
    console.error(`\n✗ Convention check failed (${errors.length}):`);
    for (const e of errors) console.error(`   ${e}`);
    process.exit(1);
  }
  console.log('✓ File-size ratchet, mailto, emoji, Resend, sanityFetch.catch, any, and page-mirror conventions hold');
}

const invoked = process.argv[1] && fileURLToPath(import.meta.url).endsWith(process.argv[1].replace(/^\.\//, ''));
if (invoked || process.argv[1]?.endsWith('conventions.mjs')) {
  main();
}
