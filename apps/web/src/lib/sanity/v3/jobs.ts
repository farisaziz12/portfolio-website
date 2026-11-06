/**
 * Hiring radar loader. The dataset is public, so everything here is
 * public-safe by construction. Expiry is enforced three ways so a dead
 * scheduler cannot leave stale roles up:
 *   1. GROQ filters on `$cutoff` (verification age, rounded up to the hour).
 *   2. This module re-checks every row against the exact current time.
 *   3. Each rendered row carries `expiresAt`; the page hides it client-side
 *      if edge-cached HTML outlives it.
 */
import groq from 'groq';
import {
  DEFAULT_JOB_SETTINGS,
  JOB_GEO_KINDS,
  ageLabel,
  effectiveStatus,
  swissEligibility,
  verificationCutoff,
  type JobRole,
  type JobSettings,
} from 'shared/jobs';
import { load } from './fetch';

export const jobSettingsQuery = groq`*[_id == "jobSettings"][0]{ autoPublish, paused, maxVerificationAgeHours }`;

/**
 * Mirrors isPubliclyVisible() in shared/jobs.ts: open, not hidden, verified
 * inside the window, explicit Swiss eligibility with evidence, and either
 * approved or automatic updates switched on.
 */
export const publicJobsQuery = groq`*[
  _type == "jobRole"
  && status == "verified-open"
  && overrides.hidden != true
  && defined(lastVerifiedAt)
  && dateTime(lastVerifiedAt) >= dateTime($cutoff)
  && defined(eligibilityEvidence) && length(eligibilityEvidence) > 0
  && (
    (coalesce(overrides.geoKind, geoKind) == "hybrid-ch" && defined(city) && city != "")
    || (coalesce(overrides.geoKind, geoKind) in ["remote-ch", "remote-emea"] && "CH" in coalesce(overrides.eligibleCountries, eligibleCountries))
  )
  && (approved == true || *[_id == "jobSettings"][0].autoPublish == true)
] | order(lastVerifiedAt desc) {
  "id": _id,
  "companyId": companyId,
  "companyName": coalesce(company->name, companyId),
  "companyOneLiner": company->oneLiner,
  "title": coalesce(overrides.title, title),
  "team": coalesce(overrides.team, team),
  applyUrl, summary,
  "geoKind": coalesce(overrides.geoKind, geoKind),
  "locationText": coalesce(overrides.locationText, locationText),
  city, attendance,
  "eligibleCountries": coalesce(overrides.eligibleCountries, eligibleCountries, []),
  eligibilityEvidence,
  "families": coalesce(families, []),
  "tech": coalesce(tech, []),
  publishedAt, "publishedBasis": coalesce(publishedBasis, "unknown"),
  firstSeenAt, lastVerifiedAt, status
}`;

export interface PublicJob {
  id: string;
  companyName: string;
  companyOneLiner?: string;
  title: string;
  team?: string;
  applyUrl: string;
  summary?: string;
  geoKind: string;
  geoLabel: string;
  locationText?: string;
  attendance?: string;
  eligibleCountries: string[];
  families: string[];
  tech: string[];
  /** The only age wording allowed on the site. */
  age: string;
  lastVerifiedAt: string;
  /** ISO instant after which the row must not be shown. */
  expiresAt: string;
}

type Row = Omit<JobRole, '_id' | 'sourceKey' | 'discoveryUrls' | 'publications'> & {
  id: string;
  companyName: string;
  companyOneLiner?: string;
  summary?: string;
};

const geoTitle = (v: string) => JOB_GEO_KINDS.find((g) => g.value === v)?.title ?? v;

/** Pure: raw rows in, rows safe to render out. Exported for tests. */
export function toPublicJobs(rows: Row[], now: Date, settings: JobSettings): PublicJob[] {
  const out: PublicJob[] = [];
  for (const r of rows) {
    const asRole = { ...r, _id: r.id, sourceKey: '', discoveryUrls: [], publications: [] } as unknown as JobRole;
    if (effectiveStatus(asRole, now, settings) !== 'verified-open') continue;
    if (swissEligibility(asRole) !== 'confirmed') continue;
    out.push({
      id: r.id,
      companyName: r.companyName,
      companyOneLiner: r.companyOneLiner,
      title: r.title,
      team: r.team,
      applyUrl: r.applyUrl,
      summary: r.summary,
      geoKind: r.geoKind ?? '',
      geoLabel: geoTitle(r.geoKind ?? ''),
      locationText: r.locationText,
      attendance: r.attendance,
      eligibleCountries: r.eligibleCountries,
      families: r.families,
      tech: r.tech,
      age: ageLabel(r, now),
      lastVerifiedAt: r.lastVerifiedAt as string,
      expiresAt: new Date(new Date(r.lastVerifiedAt as string).getTime() + settings.maxVerificationAgeHours * 3_600_000).toISOString(),
    });
  }
  return out;
}

export async function getJobSettings(): Promise<JobSettings & { paused: boolean; autoPublish: boolean }> {
  const s = await load<{ autoPublish?: boolean; paused?: boolean; maxVerificationAgeHours?: number } | null>(jobSettingsQuery, null);
  return {
    maxVerificationAgeHours: s?.maxVerificationAgeHours ?? DEFAULT_JOB_SETTINGS.maxVerificationAgeHours,
    paused: s?.paused === true,
    autoPublish: s?.autoPublish === true,
  };
}

/** Never throws. A CMS outage yields an empty list, never a 500 or a stale row. */
export async function getPublicJobs(now: Date = new Date()): Promise<PublicJob[]> {
  const settings = await getJobSettings();
  const cutoff = verificationCutoff(now, settings);
  const rows = await load<Row[]>(publicJobsQuery, [], { cutoff });
  return toPublicJobs(rows, now, settings);
}
