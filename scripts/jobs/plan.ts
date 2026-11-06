/**
 * Pure planning for the hiring radar scheduled runs. No network, no Sanity
 * client, no dependencies: JSON in, JSON out, so a scheduled run can use it
 * with plain Node (22.18+ strips types natively) and the result is the same
 * every time. The run itself reads and writes Sanity; this decides WHAT.
 */
import {
  DEFAULT_JOB_SETTINGS,
  ageLabel,
  applyVerification,
  canonicalUrl,
  draftLength,
  draftStyleIssues,
  editionDocId,
  isoWeekId,
  matchRole,
  mergeRole,
  pickVerificationBatch,
  roleDocId,
  selectForEdition,
  sourceKeyFor,
  type JobRole,
  type JobSettings,
  type VerificationResult,
} from '../../packages/shared/src/jobs.ts';

export interface RawCandidate extends Partial<JobRole> {
  applyUrl: string;
  title: string;
  companyId: string;
}

export type Op =
  | { op: 'create'; id: string; doc: JobRole & { _type: 'jobRole' } }
  | { op: 'update'; id: string; doc: JobRole & { _type: 'jobRole' }; probable: boolean; reason: string };

export function reconcile(existing: JobRole[], candidates: RawCandidate[], now: Date): { ops: Op[]; skipped: string[] } {
  const pool: JobRole[] = [...existing];
  const touched = new Map<string, Op>();
  const skipped: string[] = [];

  for (const c of candidates) {
    let applyUrl: string;
    try {
      applyUrl = canonicalUrl(c.applyUrl);
    } catch {
      skipped.push(`invalid URL: ${String(c.applyUrl).slice(0, 80)}`);
      continue;
    }
    const sourceKey = c.sourceKey ?? sourceKeyFor(applyUrl);
    const candidate = { ...c, applyUrl, sourceKey, discoveryUrls: c.discoveryUrls ?? [] };
    const m = matchRole(candidate as never, pool as never);

    if (m.kind === 'none') {
      const doc: JobRole & { _type: 'jobRole' } = {
        _type: 'jobRole',
        _id: roleDocId(c.companyId, sourceKey),
        companyId: c.companyId,
        sourceKey,
        applyUrl,
        discoveryUrls: candidate.discoveryUrls,
        title: c.title,
        team: c.team,
        geoKind: c.geoKind,
        locationText: c.locationText,
        city: c.city,
        attendance: c.attendance,
        eligibleCountries: c.eligibleCountries ?? [],
        eligibilityEvidence: c.eligibilityEvidence,
        families: c.families ?? [],
        tech: c.tech ?? [],
        publishedAt: c.publishedAt,
        publishedBasis: c.publishedAt ? (c.publishedBasis ?? 'unknown') : 'unknown',
        firstSeenAt: now.toISOString(),
        status: 'pending',
        publications: [],
      };
      pool.push(doc);
      touched.set(doc._id, { op: 'create', id: doc._id, doc });
      continue;
    }

    const current = pool.find((r) => r._id === m.id) as JobRole;
    const merged = mergeRole(current, { ...candidate, applyUrl: candidate.applyUrl }, m.kind === 'probable');
    const doc = { ...merged, _type: 'jobRole' as const };
    pool[pool.findIndex((r) => r._id === m.id)] = doc;
    const prev = touched.get(m.id);
    // A role created earlier in this same run stays a create, with the merged content.
    touched.set(m.id, prev?.op === 'create' ? { op: 'create', id: m.id, doc } : { op: 'update', id: m.id, doc, probable: m.kind === 'probable', reason: m.reason });
  }
  return { ops: [...touched.values()], skipped };
}

export const verificationBatch = (roles: JobRole[], settings: Partial<JobSettings> & { dailyVerifyBatch?: number }) =>
  pickVerificationBatch(roles, settings.dailyVerifyBatch ?? 25).map((r) => r._id);

export const verify = (role: JobRole, result: VerificationResult) => applyVerification(role, result);

export function planEdition(roles: JobRole[], existingEditionIds: string[], now: Date, resurface: string[] = [], settings: JobSettings = DEFAULT_JOB_SETTINGS) {
  const weekId = isoWeekId(now);
  const id = editionDocId(weekId);
  if (existingEditionIds.includes(id)) return { weekId, id, alreadyExists: true as const, items: [] };
  const picked = selectForEdition(roles, { now, settings, resurface });
  return {
    weekId,
    id,
    alreadyExists: false as const,
    companies: new Set(picked.map((p) => p.role.companyId)).size,
    items: picked.map((p) => ({ roleId: p.role._id, resurfaced: p.resurfaced, ageLabel: ageLabel(p.role, now) })),
  };
}

export const checkDraft = (text: string) => ({ characters: draftLength(text), issues: draftStyleIssues(text) });
