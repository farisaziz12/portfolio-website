/**
 * The single source of truth for public "facts" in copy: the headline speaking
 * line, its counting rule, and placeholders that let CMS copy quote derived or
 * dated numbers instead of hardcoding them.
 *
 * Placeholders (in any Sanity text the loaders run through `fillFacts`):
 *   {talks}        → stats.talksGiven            ("61")
 *   {countries}    → stats.countries             ("19")
 *   {cities}       → stats.cities
 *   {asOf}         → fullDate(stats.asOf)        ("2nd Nov 2026")
 *   {metric:<id>}  → an approved metric document: "4,500 <label> (Jul 2026)"
 *   {metricValue:<id>} → just its value ("4,500")
 *
 * Pure module: no fetching, so tests and scripts can use it directly.
 */
import { fullDate } from './dates';
import type { Metric, SpeakingStats } from './types';

export type FactStats = Pick<SpeakingStats, 'talksGiven' | 'countries' | 'cities' | 'asOf'>;

export interface FactContext {
  stats: FactStats;
  metrics: Pick<Metric, '_id' | 'value' | 'label' | 'dateLabel'>[];
}

/** Plain-language counting rule, quoted wherever the number is defined. */
export const COUNTING_RULE =
  'past, not-cancelled sessions where Faris spoke (talk, keynote, lightning talk, panel, podcast or livestream guest) or ran a workshop; hosting and attending are not counted. Countries and cities count in-person events with at least one such session';

/** "2nd Nov 2026": the "as of" label for the derived counts. */
export const asOfLabel = (stats: Pick<SpeakingStats, 'asOf'>) => fullDate(stats.asOf);

/** "61 talks in 19 countries". The one phrasing of the headline number. */
export function speakingLine(stats: Pick<SpeakingStats, 'talksGiven' | 'countries'>): string {
  return `${stats.talksGiven} ${stats.talksGiven === 1 ? 'talk' : 'talks'} in ${stats.countries} ${stats.countries === 1 ? 'country' : 'countries'}`;
}

/** A metric as one self-describing phrase: value, name, and when it was true. */
export function metricPhrase(m: Pick<Metric, 'value' | 'label' | 'dateLabel'>): string {
  return `${m.value} ${m.label}${m.dateLabel ? ` (${m.dateLabel})` : ''}`;
}

const TOKEN = /\{(talks|countries|cities|asOf|metric|metricValue)(?::([\w.-]+))?\}/g;

/**
 * Replace placeholders with live values. An unknown metric id is left as-is
 * so `check:stats` reports it instead of the page printing an empty string.
 */
export function fillFacts<T extends string | undefined>(text: T, ctx: FactContext): T {
  if (!text || !text.includes('{')) return text;
  return text.replace(TOKEN, (whole, key: string, id?: string) => {
    switch (key) {
      case 'talks': return String(ctx.stats.talksGiven);
      case 'countries': return String(ctx.stats.countries);
      case 'cities': return String(ctx.stats.cities);
      case 'asOf': return asOfLabel(ctx.stats);
      default: {
        const m = id ? ctx.metrics.find((x) => x._id === id) : undefined;
        if (!m) return whole;
        return key === 'metricValue' ? m.value : metricPhrase(m);
      }
    }
  }) as T;
}

/** Deep-fill every string in a JSON-ish value (Portable Text, nested objects). */
export function fillFactsDeep<T>(value: T, ctx: FactContext): T {
  if (typeof value === 'string') return fillFacts(value, ctx) as T;
  if (Array.isArray(value)) return value.map((v) => fillFactsDeep(v, ctx)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k.startsWith('_') ? v : fillFactsDeep(v, ctx)])) as T;
  }
  return value;
}

export interface StatClaim {
  kind: 'talks' | 'countries';
  value: number;
  /** The matched text, for error messages. */
  match: string;
}

const NUM = String.raw`(\d[\d,]*)(\+)?`;
const CLAIM_PATTERNS: { kind: StatClaim['kind']; re: RegExp }[] = [
  // Headline phrasings only, so "5 talks you can book" (catalogue size) is not a claim:
  // "61 talks delivered", "92 talks given", "80+ talks across", "61 talks in 19 countries",
  // "92+ speaking engagements"
  { kind: 'talks', re: new RegExp(String.raw`\b${NUM}\s+(?:talks?\s+(?:delivered|given|across|in\s+(?=\d))|(?:speaking\s+)?engagements\b|talk sessions\b)`, 'gi') },
  // "Talks delivered: 61": labels with the number after
  { kind: 'talks', re: new RegExp(String.raw`\btalks (?:delivered|given)\s*:\s*${NUM}`, 'gi') },
  // "19 countries"
  { kind: 'countries', re: new RegExp(String.raw`\b${NUM}\s+countries\b`, 'gi') },
  // "Countries: 19", "Countries spoken in: 19"
  { kind: 'countries', re: new RegExp(String.raw`\bcountries(?: spoken in)?\s*:\s*${NUM}`, 'gi') },
];

/** Every headline-stat claim in a piece of text ("80+ talks", "21 countries"). */
export function findStatClaims(text: string): StatClaim[] {
  const plain = text.replace(/\*\*/g, '');
  const out: StatClaim[] = [];
  for (const { kind, re } of CLAIM_PATTERNS) {
    for (const m of plain.matchAll(re)) {
      const value = Number(m[1].replace(/,/g, ''));
      if (Number.isFinite(value)) out.push({ kind, value, match: m[0] });
    }
  }
  return out;
}

/** Claims that disagree with the computed stats. */
export function divergentClaims(text: string, stats: Pick<SpeakingStats, 'talksGiven' | 'countries'>): StatClaim[] {
  return findStatClaims(text).filter((c) => c.value !== (c.kind === 'talks' ? stats.talksGiven : stats.countries));
}

/** Placeholders that survived filling (typo, unknown metric id, unfilled field). */
export function unfilledTokens(text: string): string[] {
  return [...text.matchAll(TOKEN)].map((m) => m[0]);
}
