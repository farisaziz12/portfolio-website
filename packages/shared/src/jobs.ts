/**
 * Hiring radar: vocabulary and pure rules shared by Studio (option lists),
 * the site (queries, labels) and the scheduled-task scripts.
 *
 * No imports and no I/O on purpose. Every rule that decides what is public,
 * what counts as the same opening, or how old a role is lives here so it can
 * be tested offline. The dataset is PUBLIC: nothing in these types may hold
 * contact details, submitter identity or private review notes.
 */

export const JOB_ROLE_FAMILIES = [
  { value: 'it-ops', title: 'IT operations' },
  { value: 'it-leadership', title: 'IT leadership' },
  { value: 'infrastructure', title: 'Infrastructure' },
  { value: 'devops', title: 'DevOps' },
  { value: 'platform', title: 'Platform' },
  { value: 'sre', title: 'SRE' },
  { value: 'backend', title: 'Backend' },
  { value: 'frontend', title: 'Frontend' },
  { value: 'fullstack', title: 'Full stack' },
] as const;

export const JOB_TECH_TAGS = [
  { value: 'go', title: 'Go' },
  { value: 'java', title: 'Java' },
  { value: 'javascript', title: 'JavaScript' },
  { value: 'typescript', title: 'TypeScript' },
  { value: 'react', title: 'React' },
] as const;

/** Geography buckets. Eligibility is a separate, evidence-backed field. */
export const JOB_GEO_KINDS = [
  { value: 'remote-ch', title: 'Remote, Switzerland eligible' },
  { value: 'remote-emea', title: 'Remote, EMEA' },
  { value: 'hybrid-ch', title: 'Hybrid, Switzerland' },
] as const;

export const JOB_STATUSES = [
  { value: 'pending', title: 'Pending verification' },
  { value: 'verified-open', title: 'Verified open' },
  { value: 'overdue', title: 'Overdue for re-verification' },
  { value: 'closed', title: 'Closed' },
  { value: 'archived', title: 'Archived' },
] as const;

/** What `publishedAt` means. Only the first two justify "posted X days ago". */
export const JOB_PUBLISHED_BASIS = [
  { value: 'ats-published', title: 'Published date from the ATS or listing' },
  { value: 'source-stated', title: 'Posting date stated on the page' },
  { value: 'unknown', title: 'Unknown' },
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number]['value'];
export type JobGeoKind = (typeof JOB_GEO_KINDS)[number]['value'];
export type JobPublishedBasis = (typeof JOB_PUBLISHED_BASIS)[number]['value'];

export interface JobPublication {
  /** e.g. `edition:2026-W45`, `site`. Drafting is NOT publication. */
  channel: string;
  publishedAt: string;
  editionId?: string;
}

/** Fields a human can pin in Studio. A refresh never overwrites a set value. */
export interface JobOverrides {
  title?: string;
  team?: string;
  locationText?: string;
  eligibleCountries?: string[];
  geoKind?: JobGeoKind;
  hidden?: boolean;
}

export interface JobRole {
  _id: string;
  companyId: string;
  sourceKey: string;
  applyUrl: string;
  discoveryUrls: string[];
  title: string;
  team?: string;
  geoKind?: JobGeoKind;
  locationText?: string;
  city?: string;
  attendance?: string;
  /** ISO 3166 alpha-2 codes taken from the listing. 'EMEA' alone never counts as 'CH'. */
  eligibleCountries: string[];
  eligibilityEvidence?: string;
  families: string[];
  tech: string[];
  publishedAt?: string;
  publishedBasis: JobPublishedBasis;
  firstSeenAt: string;
  lastVerifiedAt?: string;
  lastCheckedAt?: string;
  inconclusiveChecks?: number;
  status: JobStatus;
  matchUncertain?: boolean;
  closedEvidence?: string;
  publications: JobPublication[];
  overrides?: JobOverrides;
}

// ─── URLs and stable IDs ─────────────────────────────────────────────────

const TRACKING = /^(utm_|gh_src|gh_jid_src|ref$|source$|src$|lever-|trk|fbclid|gclid|mc_)/i;

export function canonicalUrl(input: string): string {
  const u = new URL(input.trim());
  u.hash = '';
  u.hostname = u.hostname.toLowerCase();
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING.test(key)) u.searchParams.delete(key);
  }
  u.searchParams.sort();
  u.pathname = u.pathname.replace(/\/+$/, '') || '/';
  return u.toString();
}

/**
 * Source key for an opening. ATS listings get a key from the ATS id, so the
 * same posting reached by any URL shape resolves to one key. Anything else
 * falls back to the canonical URL.
 */
export function sourceKeyFor(url: string): string {
  const u = new URL(canonicalUrl(url));
  const parts = u.pathname.split('/').filter(Boolean);
  if (/(^|\.)greenhouse\.io$/.test(u.hostname)) {
    const jobId = u.searchParams.get('gh_jid') ?? parts[parts.indexOf('jobs') + 1];
    const board = parts[0] && parts[0] !== 'embed' ? parts[0] : u.searchParams.get('for');
    if (jobId && /^\d+$/.test(jobId) && board) return `greenhouse:${board.toLowerCase()}:${jobId}`;
  }
  if (u.hostname === 'jobs.ashbyhq.com' && parts.length >= 2) {
    return `ashby:${parts[0].toLowerCase()}:${parts[1].toLowerCase()}`;
  }
  return `url:${u.hostname}${u.pathname}${u.search}`;
}

export function slugify(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Sanity-safe stable ID. Same key, same ID, so re-runs upsert instead of duplicating.
 * Never use a dot: in a public dataset any ID containing '.' is private (token
 * only), so the site's tokenless client could not read the record.
 */
export function roleDocId(companySlug: string, sourceKey: string): string {
  const tail = slugify(sourceKey.replace(/^[a-z]+:/, '')) || 'role';
  return `jobRole-${companySlug}-${tail}`.slice(0, 120);
}

// ─── Dates ───────────────────────────────────────────────────────────────

const DAY = 86_400_000;
const HOUR = 3_600_000;

/** Whole days between two instants, never negative. */
export function daysBetween(fromIso: string, now: Date): number {
  return Math.max(0, Math.floor((now.getTime() - new Date(fromIso).getTime()) / DAY));
}

function plural(n: number): string {
  return n === 1 ? '1 day' : `${n} days`;
}

/**
 * The only age wording the site may use. "Posted" requires a source-backed
 * date; otherwise age counts from firstSeenAt and says the date is unknown.
 */
export function ageLabel(role: Pick<JobRole, 'publishedAt' | 'publishedBasis' | 'firstSeenAt'>, now: Date): string {
  const reliable = role.publishedAt && role.publishedBasis !== 'unknown';
  if (reliable) {
    const d = daysBetween(role.publishedAt as string, now);
    return d === 0 ? 'Posted today' : `Posted ${plural(d)} ago`;
  }
  const d = daysBetween(role.firstSeenAt, now);
  return d === 0
    ? 'First discovered today; posting date unknown'
    : `First discovered ${plural(d)} ago; posting date unknown`;
}

/** ISO week id in Europe/Zurich, e.g. `2026-W45`. One edition per id. */
export function isoWeekId(now: Date, timeZone = 'Europe/Zurich'): string {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const [y, m, d] = fmt.format(now).split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dow = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dow);
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((date.getTime() - yearStart) / DAY + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export const editionDocId = (weekId: string) => `jobEdition-${weekId}`;
export const runDocId = (kind: 'daily' | 'weekly', day: string) => `jobRun-${kind}-${day}`;

// ─── Eligibility ─────────────────────────────────────────────────────────

/**
 * Swiss eligibility is never inferred from "remote" or "EMEA". It needs an
 * explicit 'CH' in eligibleCountries for remote roles, or a named Swiss city
 * for hybrid, plus a non-empty evidence quote.
 */
export function swissEligibility(role: Pick<JobRole, 'geoKind' | 'eligibleCountries' | 'city' | 'eligibilityEvidence'>): 'confirmed' | 'unclear' {
  if (!role.eligibilityEvidence?.trim()) return 'unclear';
  if (role.geoKind === 'hybrid-ch') return role.city?.trim() ? 'confirmed' : 'unclear';
  if (role.geoKind === 'remote-ch' || role.geoKind === 'remote-emea') {
    return role.eligibleCountries.map((c) => c.toUpperCase()).includes('CH') ? 'confirmed' : 'unclear';
  }
  return 'unclear';
}

// ─── Matching ────────────────────────────────────────────────────────────

const norm = (s?: string) => (s ?? '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();

export type Candidate = Pick<JobRole, 'companyId' | 'sourceKey' | 'applyUrl' | 'discoveryUrls' | 'title' | 'locationText' | 'team'>;
export type MatchResult =
  | { kind: 'exact'; id: string; reason: string }
  | { kind: 'probable'; id: string; reason: string }
  | { kind: 'none' };

const atsOf = (key: string) => (/^(greenhouse|ashby):/.test(key) ? key.split(':').slice(0, 2).join(':') : null);

/**
 * Reconcile before creating. Exact: same source key or any shared canonical URL.
 * Probable: same company, title and location, and no conflicting ATS id. A
 * conflicting ATS id on the same board means two distinct openings.
 */
export function matchRole(candidate: Candidate, existing: Array<Candidate & { _id: string }>): MatchResult {
  const urls = new Set([candidate.applyUrl, ...candidate.discoveryUrls].map(canonicalUrl));
  const pool = existing.filter((e) => e.companyId === candidate.companyId);
  for (const e of pool) {
    if (e.sourceKey === candidate.sourceKey) return { kind: 'exact', id: e._id, reason: 'same source key' };
    const theirs = [e.applyUrl, ...e.discoveryUrls].map(canonicalUrl);
    if (theirs.some((u) => urls.has(u))) return { kind: 'exact', id: e._id, reason: 'shared canonical URL' };
  }
  for (const e of pool) {
    const a = atsOf(candidate.sourceKey);
    const b = atsOf(e.sourceKey);
    if (a && b && a === b) continue; // same ATS board, different id: distinct openings
    if (norm(e.title) === norm(candidate.title) && norm(e.locationText) === norm(candidate.locationText) && norm(e.team) === norm(candidate.team)) {
      return { kind: 'probable', id: e._id, reason: 'same company, title, team and location, no ATS id to confirm' };
    }
  }
  return { kind: 'none' };
}

/**
 * Merge a rediscovery into the stored role. Age never resets, human overrides
 * win, discovery references accumulate, publication history is untouched.
 */
export function mergeRole(existing: JobRole, incoming: Partial<JobRole> & { applyUrl: string }, probable = false): JobRole {
  const o = existing.overrides ?? {};
  const urls = new Set([...existing.discoveryUrls, ...(incoming.discoveryUrls ?? []), incoming.applyUrl].map(canonicalUrl));
  urls.delete(canonicalUrl(existing.applyUrl));
  const reliableIncoming = incoming.publishedAt && incoming.publishedBasis && incoming.publishedBasis !== 'unknown';
  const keepPublished = existing.publishedBasis !== 'unknown' && existing.publishedAt;
  return {
    ...existing,
    title: o.title ?? incoming.title ?? existing.title,
    team: o.team ?? incoming.team ?? existing.team,
    locationText: o.locationText ?? incoming.locationText ?? existing.locationText,
    geoKind: o.geoKind ?? incoming.geoKind ?? existing.geoKind,
    eligibleCountries: o.eligibleCountries ?? incoming.eligibleCountries ?? existing.eligibleCountries,
    eligibilityEvidence: incoming.eligibilityEvidence ?? existing.eligibilityEvidence,
    families: incoming.families ?? existing.families,
    tech: incoming.tech ?? existing.tech,
    discoveryUrls: [...urls],
    publishedAt: keepPublished ? existing.publishedAt : reliableIncoming ? incoming.publishedAt : existing.publishedAt,
    publishedBasis: keepPublished ? existing.publishedBasis : reliableIncoming ? (incoming.publishedBasis as JobPublishedBasis) : existing.publishedBasis,
    firstSeenAt: existing.firstSeenAt,
    matchUncertain: probable ? true : existing.matchUncertain,
  };
}

// ─── Verification lifecycle ──────────────────────────────────────────────

export type VerificationResult =
  | { kind: 'open-confirmed'; at: string }
  | { kind: 'closed-confirmed'; at: string; evidence: string }
  | { kind: 'inconclusive'; at: string; reason: string };

/**
 * A timeout, network error or bare HTTP 200 is inconclusive and never closes
 * a role. Only an explicit closed signal with evidence closes it, and only an
 * explicit open signal refreshes lastVerifiedAt.
 */
export function applyVerification(role: JobRole, result: VerificationResult): JobRole {
  if (result.kind === 'open-confirmed') {
    return { ...role, status: 'verified-open', lastVerifiedAt: result.at, lastCheckedAt: result.at, inconclusiveChecks: 0, closedEvidence: undefined };
  }
  if (result.kind === 'closed-confirmed') {
    if (!result.evidence.trim()) return { ...role, lastCheckedAt: result.at, inconclusiveChecks: (role.inconclusiveChecks ?? 0) + 1 };
    return { ...role, status: 'closed', lastCheckedAt: result.at, closedEvidence: result.evidence };
  }
  return { ...role, lastCheckedAt: result.at, inconclusiveChecks: (role.inconclusiveChecks ?? 0) + 1 };
}

export interface JobSettings {
  /** Public queries exclude roles not verified within this window. */
  maxVerificationAgeHours: number;
}

export const DEFAULT_JOB_SETTINGS: JobSettings = { maxVerificationAgeHours: 72 };

/** Status as seen right now, regardless of whether any scheduled run has marked it stale. */
export function effectiveStatus(role: Pick<JobRole, 'status' | 'lastVerifiedAt'>, now: Date, s: JobSettings = DEFAULT_JOB_SETTINGS): JobStatus {
  if (role.status !== 'verified-open') return role.status;
  if (!role.lastVerifiedAt) return 'pending';
  return now.getTime() - new Date(role.lastVerifiedAt).getTime() > s.maxVerificationAgeHours * HOUR ? 'overdue' : 'verified-open';
}

export function isPubliclyVisible(role: JobRole, now: Date, s: JobSettings = DEFAULT_JOB_SETTINGS): boolean {
  if (role.overrides?.hidden) return false;
  if (effectiveStatus(role, now, s) !== 'verified-open') return false;
  return swissEligibility({ ...role, ...pick(role.overrides) }) === 'confirmed';
}

const pick = (o?: JobOverrides) => ({
  ...(o?.geoKind ? { geoKind: o.geoKind } : {}),
  ...(o?.eligibleCountries ? { eligibleCountries: o.eligibleCountries } : {}),
});

/**
 * Cutoff passed to GROQ as `$cutoff`. Rounded UP to the next hour so queries
 * stay CDN-cacheable and the error only ever expires a role early, never late.
 */
export function verificationCutoff(now: Date, s: JobSettings = DEFAULT_JOB_SETTINGS): string {
  const raw = now.getTime() - s.maxVerificationAgeHours * HOUR;
  return new Date(Math.ceil(raw / HOUR) * HOUR).toISOString();
}

/** Roles nearest expiry first, bounded. Closed, archived and never-verified-and-hidden roles are skipped. */
export function pickVerificationBatch(roles: JobRole[], limit: number): JobRole[] {
  return roles
    .filter((r) => r.status !== 'closed' && r.status !== 'archived' && !r.overrides?.hidden)
    .sort((a, b) => (a.lastVerifiedAt ?? '').localeCompare(b.lastVerifiedAt ?? '') || a.firstSeenAt.localeCompare(b.firstSeenAt))
    .slice(0, Math.max(0, limit));
}

// ─── Weekly selection ────────────────────────────────────────────────────

export interface SelectionOptions {
  now: Date;
  settings?: JobSettings;
  /** Roles already in a published edition are excluded unless listed here, and then labelled. */
  resurface?: string[];
  maxCandidates?: number;
  maxPerCompany?: number;
  targetCompanies?: [number, number];
}

export interface SelectedRole {
  role: JobRole;
  resurfaced: boolean;
}

export function hasBeenPublished(role: Pick<JobRole, 'publications'>): boolean {
  return role.publications.some((p) => p.channel.startsWith('edition:'));
}

/**
 * Candidates are visible, Swiss-eligible and not yet published. Fewer is fine:
 * the function never pads. Newest discoveries first, spread across companies.
 */
export function selectForEdition(roles: JobRole[], o: SelectionOptions): SelectedRole[] {
  const max = o.maxCandidates ?? 25;
  const perCompany = o.maxPerCompany ?? 2;
  const [, maxCompanies] = o.targetCompanies ?? [8, 12];
  const resurface = new Set(o.resurface ?? []);
  const pool = roles
    .filter((r) => isPubliclyVisible(r, o.now, o.settings))
    .filter((r) => !hasBeenPublished(r) || resurface.has(r._id))
    .sort((a, b) => b.firstSeenAt.localeCompare(a.firstSeenAt));
  const counts = new Map<string, number>();
  const out: SelectedRole[] = [];
  for (const r of pool) {
    const n = counts.get(r.companyId) ?? 0;
    if (n >= perCompany) continue;
    if (n === 0 && counts.size >= maxCompanies) continue;
    counts.set(r.companyId, n + 1);
    out.push({ role: r, resurfaced: hasBeenPublished(r) });
    if (out.length >= max) break;
  }
  return out;
}

// ─── Draft checks ────────────────────────────────────────────────────────

/** Full character count in Unicode code points, as a reader sees it. */
export const draftLength = (text: string) => Array.from(text).length;

export function draftStyleIssues(text: string): string[] {
  const issues: string[] = [];
  if (/\u2014/.test(text)) issues.push('contains an em dash');
  if (/\u2013/.test(text)) issues.push('contains an en dash');
  if (/(^|\s)#\w/.test(text)) issues.push('contains a hashtag');
  return issues;
}
