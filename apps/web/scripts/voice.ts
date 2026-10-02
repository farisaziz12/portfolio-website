#!/usr/bin/env tsx
/**
 * Voice check: flags copy that reads as machine-written (rules and reasons in
 * packages/shared/src/voice.ts and docs/voice.md).
 *
 *   pnpm --filter web lint:voice          site copy in src/ (fails the lint)
 *   pnpm voice:cms                        every published Sanity document (report)
 *   SANITY_FIXTURES=1 pnpm voice:cms      same, against fixtures/sanity-dataset.json
 *   --json                                machine-readable output (for agents)
 *
 * A line that must keep a flagged phrase (a quoted title, say) carries a
 * `voice-ok` comment. Other people's quotes (praise.quote) are never scanned.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectText, findTells, type VoiceHit } from 'shared';

const WEB_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');

/** Where site copy lives. API routes, admin screens and plumbing are not copy. */
const COPY_DIRS = ['src/components', 'src/pages', 'src/layouts', 'src/emails'];
const COPY_FILES = ['src/lib/sanity/v3/defaults.ts', 'src/lib/og.ts'];
const SKIP = /(^src\/pages\/(api|admin)\/)|\.test\.|Ops\.tsx$|posthog\.astro$/;

interface Finding extends Omit<VoiceHit, 'index'> {
  where: string;
  context: string;
}

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(astro|tsx|ts)$/.test(name)) yield p;
  }
}

/** Blank out comments (keeping line numbers) so only copy and code remain. */
function stripComments(src: string) {
  const blank = (s: string) => s.replace(/[^\n]/g, ' ');
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/(^|[^:"'`\w])\/\/(?!\s*voice-ok)[^\n]*/g, blank);
}

function scanCode(): Finding[] {
  const files = [...COPY_DIRS.flatMap((d) => [...walk(join(WEB_ROOT, d))]), ...COPY_FILES.map((f) => join(WEB_ROOT, f))];
  const out: Finding[] = [];
  for (const file of files) {
    const rel = relative(WEB_ROOT, file).replaceAll('\\', '/');
    if (SKIP.test(rel) || !existsSync(file)) continue;
    const src = stripComments(readFileSync(file, 'utf8'));
    const lines = src.split('\n');
    for (const hit of findTells(src)) {
      const line = src.slice(0, hit.index).split('\n').length;
      if (lines[line - 1]?.includes('voice-ok')) continue;
      out.push({ rule: hit.rule, match: hit.match, say: hit.say, where: `${rel}:${line}`, context: lines[line - 1].trim().slice(0, 140) });
    }
  }
  return out;
}

const CMS_QUERY = `*[!(_id in path("drafts.**")) && !(_type match "sanity.*") && !(_type match "system.*")]`;

async function loadDocuments(): Promise<Record<string, unknown>[]> {
  if (process.env.SANITY_FIXTURES) {
    const file = process.env.SANITY_FIXTURES_PATH || join(WEB_ROOT, 'fixtures', 'sanity-dataset.json');
    const data = JSON.parse(readFileSync(file, 'utf8'));
    return (Array.isArray(data) ? data : data.documents ?? []).filter((d: { _id: string; _type: string }) => !d._id.startsWith('drafts.') && !/^(sanity|system)\./.test(d._type));
  }
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
  if (!projectId) throw new Error('Set PUBLIC_SANITY_PROJECT_ID (or SANITY_FIXTURES=1 for the offline dataset).');
  const { createClient } = await import('@sanity/client');
  const client = createClient({
    projectId,
    dataset: process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });
  return client.fetch(CMS_QUERY);
}

async function scanCms(): Promise<Finding[]> {
  const docs = await loadDocuments();
  const out: Finding[] = [];
  for (const doc of docs) {
    const label = `${doc._type}/${doc._id}`;
    for (const { path, text } of collectText(doc)) {
      for (const hit of findTells(text)) {
        const start = Math.max(0, hit.index - 50);
        out.push({ rule: hit.rule, match: hit.match, say: hit.say, where: `${label} · ${path}`, context: text.slice(start, hit.index + 70).replace(/\s+/g, ' ') });
      }
    }
  }
  return out;
}

function print(findings: Finding[], scope: string) {
  if (asJson) {
    console.log(JSON.stringify(findings, null, 2));
    return;
  }
  if (!findings.length) {
    console.log(`✓ Voice: no AI tells in ${scope}`);
    return;
  }
  for (const f of findings) console.log(`${f.where}  "${f.match}" → ${f.say}\n    ${f.context}`);
  const byRule = Object.entries(Object.groupBy(findings, (f) => f.rule)).map(([r, l]) => `${r} ${l?.length}`);
  console.log(`\n${findings.length} voice finding(s) in ${scope}: ${byRule.join(', ')}. Guide: docs/voice.md`);
}

if (args.has('--cms')) {
  const findings = await scanCms();
  print(findings, 'Sanity content');
} else {
  const findings = scanCode();
  print(findings, 'site copy');
  if (findings.length) process.exitCode = 1;
}
