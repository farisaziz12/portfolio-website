/**
 * check:stats: fails when the headline speaking stats ("N sessions in M
 * countries") disagree anywhere a visitor or an agent can read them.
 *
 *   pnpm --filter web check:stats                 # live Sanity
 *   SANITY_FIXTURES=1 pnpm --filter web check:stats  # offline fixture
 *   pnpm --filter web check:stats -- --dist dist     # also scan a finished build
 *
 * What it checks, against getSpeakingStats() (the single source):
 *   1. llms.txt and every .md mirror that llms-full.txt concatenates.
 *   2. CMS copy as the site renders it: site meta description (home meta / OG /
 *      Twitter), Home page, About page (story, In short, SEO), bios, community.
 *   3. Raw CMS copy: a count typed as a number ("80+ talks", "61 sessions") instead of a
 *      {sessions} / {countries} placeholder is an error, because it will drift.
 *   4. Placeholders that did not resolve ({metric:typo}), and "based in Zurich"
 *      (Faris is based in Geneva; ZurichJS and Zurich venues are fine).
 *   5. With --dist: every prerendered .html / .txt / .md in the build output
 *      (page copy and <meta> tags).
 * It warns (does not fail) while lib/proof.ts's fallback snapshot is stale.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface StatsReport {
  stats: { sessionsDelivered: number; countries: number; cities: number; asOf: string; breakdown: Record<string, number>; fallback: boolean };
  errors: string[];
  warnings: string[];
}

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PAGES = join(ROOT, 'src/pages');
/** Sanity types whose free text may quote the headline stats. */
const COPY_TYPES = ['siteSettings', 'homePage', 'page', 'speakerProfile', 'community'];

function strings(value: unknown, path: string, out: { path: string; text: string }[] = []) {
  if (typeof value === 'string') out.push({ path, text: value });
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) if (!k.startsWith('_') || k === '_id') strings(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}

/** The mirrors llms-full.txt concatenates, read from its source so the lists never drift. */
async function mirrorFiles(): Promise<string[]> {
  const src = await readFile(join(PAGES, 'llms-full.txt.ts'), 'utf8');
  return [...src.matchAll(/'\.\/([\w-]+\.md\.ts)'/g)].map((m) => m[1]);
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(html|txt|md)$/.test(entry.name)) yield p;
  }
}

const htmlText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    // Stat tiles are <dt>label</dt><dd>number</dd>: read them as "number label".
    .replace(/<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi, ' ¦ $2 $1 ¦ ')
    // Block ends separate text, so one tile's number never runs into the next tile's label.
    .replace(/<\/(?:p|li|div|dd|dt|h[1-6]|td|th|section|article)>/gi, ' ¦ ')
    // Keep attribute text that people and crawlers read (meta content, alt, aria-label).
    .replace(/<[^>]*?\b(?:content|alt|aria-label)="([^"]*)"[^>]*>/gi, ' $1 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');

export async function checkStats({ dist }: { dist?: string } = {}): Promise<StatsReport> {
  const v3 = await import('../src/lib/sanity/v3/index');
  const { sanityFetch } = await import('../src/lib/sanity/client');
  const { FALLBACK_SPEAKER_STATS } = await import('../src/lib/proof');
  const { divergentClaims, findStatClaims, unfilledTokens, speakingLine } = v3;

  const stats = await v3.getSpeakingStats();
  const errors: string[] = [];
  const warnings: string[] = [];
  const expected = speakingLine(stats);

  // Faris is based in Geneva. ZurichJS and Zurich event venues are fine.
  const locationErrors = (where: string, text: string) => {
    for (const m of text.matchAll(/\b(?:based (?:in|out of)|lives in|living in)\s+Z[uü]rich\b|\bZ[uü]rich-based\b/gi)) {
      errors.push(`${where}: "${m[0]}" (Faris is based in Geneva; speaker profile → Based in)`);
    }
  };
  const scan = (where: string, text: string | undefined) => {
    if (!text) return;
    for (const c of divergentClaims(text, stats)) errors.push(`${where}: "${c.match}" disagrees with the computed ${expected}`);
    for (const t of unfilledTokens(text)) errors.push(`${where}: placeholder ${t} did not resolve`);
    locationErrors(where, text);
  };

  // 1. llms.txt + the .md mirrors.
  const endpoints = ['llms.txt.ts', ...(await mirrorFiles())];
  for (const file of endpoints) {
    try {
      const mod = (await import(join(PAGES, file))) as { GET?: (ctx: never) => Promise<Response> | Response };
      const res = mod.GET ? await mod.GET({} as never) : undefined;
      if (res?.ok) scan(`/${file.replace(/\.ts$/, '')}`, await res.text());
    } catch (err) {
      const msg = (err as Error).message;
      // Mirrors that import images need Vite; their CMS text is covered by step 2 and --dist.
      if (/Unknown file extension/.test(msg)) warnings.push(`/${file.replace(/\.ts$/, '')}: skipped (imports an asset only Vite can load; use --dist to cover it)`);
      else errors.push(`/${file.replace(/\.ts$/, '')}: could not render (${msg})`);
    }
  }

  // 2. CMS copy as rendered (after placeholders are filled by the loaders).
  const [settings, home, about, profile, communities] = await Promise.all([
    v3.getSiteSettings(),
    v3.getHomePage(),
    v3.getAboutPage(),
    v3.getProfile(),
    v3.getCommunities(),
  ]);
  scan('home <meta name="description"> / og:description / twitter:description (siteSettings.metaDescription)', settings.metaDescription);
  scan('/about <meta name="description"> (About page → SEO)', about.seo?.metaDescription);
  for (const s of strings({ home, about: { ...about, heroImage: undefined }, bios: profile.bios, communities }, '')) scan(`rendered CMS copy ${s.path}`, s.text);

  // 3 + 4. Raw CMS copy: typed numbers instead of placeholders.
  const raw = await sanityFetch<Record<string, unknown>[]>(`*[_type in $types && !(_id in path("drafts.**"))]`, { types: COPY_TYPES }).catch(() => []);
  for (const doc of raw) {
    for (const s of strings(doc, '')) {
      locationErrors(`Sanity ${doc._type} (${doc._id}) ${s.path}`, s.text);
      for (const c of findStatClaims(s.text)) {
        errors.push(`Sanity ${doc._type} (${doc._id}) ${s.path}: "${c.match}" is typed in. Replace it with {${c.kind}} so it follows the event records (computed: ${expected}).`);
      }
    }
  }

  // 5. A finished build.
  if (dist) {
    for await (const file of walk(dist)) {
      const body = await readFile(file, 'utf8');
      scan(relative(dist, file), file.endsWith('.html') ? htmlText(body) : body);
    }
  }

  if (!stats.fallback && (FALLBACK_SPEAKER_STATS.sessionsDelivered !== stats.sessionsDelivered || FALLBACK_SPEAKER_STATS.countries !== stats.countries || FALLBACK_SPEAKER_STATS.cities !== stats.cities)) {
    warnings.push(
      `lib/proof.ts fallback (${FALLBACK_SPEAKER_STATS.sessionsDelivered} sessions / ${FALLBACK_SPEAKER_STATS.countries} countries / ${FALLBACK_SPEAKER_STATS.cities} cities, ${FALLBACK_SPEAKER_STATS.asOf}) differs from live (${stats.sessionsDelivered} / ${stats.countries} / ${stats.cities}, ${stats.asOf}). Only shown during a CMS outage; refresh it when this run used live data.`
    );
  }
  if (stats.fallback) warnings.push('No events loaded, so the counts are the lib/proof.ts fallback. Is Sanity reachable?');

  return {
    stats: {
      sessionsDelivered: stats.sessionsDelivered,
      countries: stats.countries,
      cities: stats.cities,
      asOf: stats.asOf,
      breakdown: { conferenceTalks: stats.conferenceTalks, workshops: stats.workshopsDelivered, panels: stats.panels, guestSpots: stats.guestSpots, hostedNotCounted: stats.hosted, attendedNotCounted: stats.attended },
      fallback: stats.fallback,
    },
    errors,
    warnings,
  };
}

// CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const i = process.argv.indexOf('--dist');
  const dist = i > -1 ? resolve(process.argv[i + 1] ?? 'dist') : undefined;
  const { stats, errors, warnings } = await checkStats({ dist });
  console.log(`Computed: ${stats.sessionsDelivered} sessions in ${stats.countries} countries, ${stats.cities} cities, as of ${stats.asOf}${stats.fallback ? ' (FALLBACK)' : ''}`);
  console.log(`Breakdown: ${Object.entries(stats.breakdown).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  for (const w of warnings) console.warn(`warn  ${w}`);
  for (const e of errors) console.error(`error ${e}`);
  if (errors.length) {
    console.error(`\ncheck:stats failed: ${errors.length} place(s) disagree with the event records.`);
    process.exit(1);
  }
  console.log('check:stats ok: every surface agrees.');
}
