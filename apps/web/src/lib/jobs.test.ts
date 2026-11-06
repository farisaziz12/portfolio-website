/**
 * Hiring radar rules (packages/shared/src/jobs.ts). Each test maps to one
 * line of the validation list in docs/hiring-radar.md.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ageLabel,
  applyVerification,
  canonicalUrl,
  draftLength,
  draftStyleIssues,
  editionDocId,
  effectiveStatus,
  isPubliclyVisible,
  isoWeekId,
  matchRole,
  mergeRole,
  pickVerificationBatch,
  roleDocId,
  selectForEdition,
  sourceKeyFor,
  swissEligibility,
  verificationCutoff,
  type JobRole,
} from 'shared/jobs';

const NOW = new Date('2026-11-09T08:00:00Z');
const iso = (hoursAgo: number) => new Date(NOW.getTime() - hoursAgo * 3_600_000).toISOString();

function role(over: Partial<JobRole> = {}): JobRole {
  return {
    _id: 'jobRole-acme-1',
    companyId: 'acme',
    sourceKey: 'greenhouse:acme:100',
    applyUrl: 'https://boards.greenhouse.io/acme/jobs/100',
    discoveryUrls: [],
    title: 'Senior Platform Engineer',
    geoKind: 'remote-ch',
    locationText: 'Remote, Switzerland',
    eligibleCountries: ['CH', 'DE'],
    eligibilityEvidence: 'Remote within Switzerland, Germany',
    families: ['platform'],
    tech: ['go'],
    publishedBasis: 'unknown',
    firstSeenAt: iso(24 * 10),
    lastVerifiedAt: iso(10),
    status: 'verified-open',
    publications: [],
    ...over,
  };
}

test('same opening from several URL shapes resolves to one source key and one ID', () => {
  const a = sourceKeyFor('https://boards.greenhouse.io/acme/jobs/100?gh_src=abc&utm_source=x');
  const b = sourceKeyFor('https://job-boards.greenhouse.io/acme/jobs/100/');
  assert.equal(a, 'greenhouse:acme:100');
  assert.equal(a, b);
  assert.equal(roleDocId('acme', a), roleDocId('acme', b));
});

test('matching: shared URL merges, different ATS ids stay distinct, title lookalikes are flagged', () => {
  const stored = [{ ...role(), _id: 'jobRole-acme-100' }];
  const viaAggregator = {
    companyId: 'acme',
    sourceKey: 'url:aggregator.example/job/9',
    applyUrl: 'https://aggregator.example/job/9',
    discoveryUrls: ['https://boards.greenhouse.io/acme/jobs/100?utm_source=agg'],
    title: 'Senior Platform Engineer',
    locationText: 'Remote, Switzerland',
  };
  assert.deepEqual(matchRole(viaAggregator, stored).kind, 'exact');

  const sameTitleOtherReq = { ...viaAggregator, sourceKey: 'greenhouse:acme:101', applyUrl: 'https://boards.greenhouse.io/acme/jobs/101', discoveryUrls: [] };
  assert.equal(matchRole(sameTitleOtherReq, stored).kind, 'none', 'same board, different id is a distinct opening');

  const noIdLookalike = { ...viaAggregator, discoveryUrls: [] };
  assert.equal(matchRole(noIdLookalike, stored).kind, 'probable', 'no ATS id to confirm: merge but flag');

  const otherTitle = { ...noIdLookalike, title: 'Staff Backend Engineer' };
  assert.equal(matchRole(otherTitle, stored).kind, 'none', 'distinct openings at one company stay distinct');
});

test('rediscovery and editing never reset age; manual overrides survive refresh', () => {
  const stored = role({ firstSeenAt: iso(24 * 30), overrides: { title: 'Platform Engineer (pinned)' }, matchUncertain: false });
  const merged = mergeRole(stored, { applyUrl: stored.applyUrl, title: 'Totally New Title', firstSeenAt: NOW.toISOString() } as Partial<JobRole> & { applyUrl: string });
  assert.equal(merged.firstSeenAt, stored.firstSeenAt);
  assert.equal(merged.title, 'Platform Engineer (pinned)');
  assert.match(ageLabel(merged, NOW), /First discovered 30 days ago; posting date unknown/);
});

test('"Posted" needs a source-backed date; a later unknown basis cannot erase it', () => {
  const posted = role({ publishedAt: iso(24 * 3), publishedBasis: 'ats-published' });
  assert.equal(ageLabel(posted, NOW), 'Posted 3 days ago');
  const merged = mergeRole(posted, { applyUrl: posted.applyUrl, publishedAt: iso(1), publishedBasis: 'unknown' });
  assert.equal(merged.publishedAt, posted.publishedAt);
  const dateButNoBasis = role({ publishedAt: iso(24 * 3), publishedBasis: 'unknown' });
  assert.match(ageLabel(dateButNoBasis, NOW), /posting date unknown/);
});

test('ambiguous eligibility is excluded from public results', () => {
  assert.equal(swissEligibility(role({ eligibleCountries: ['DE', 'FR'] })), 'unclear');
  assert.equal(swissEligibility(role({ geoKind: 'remote-emea', eligibleCountries: [], eligibilityEvidence: 'Remote EMEA' })), 'unclear');
  assert.equal(swissEligibility(role({ eligibilityEvidence: '' })), 'unclear');
  assert.equal(swissEligibility(role({ geoKind: 'hybrid-ch', city: undefined })), 'unclear');
  assert.equal(swissEligibility(role({ geoKind: 'hybrid-ch', city: 'Zurich', eligibleCountries: [] })), 'confirmed');
  assert.equal(isPubliclyVisible(role({ eligibleCountries: ['DE'] }), NOW), false);
  assert.equal(isPubliclyVisible(role(), NOW), true);
});

test('a failed or inconclusive check never closes a role; only explicit evidence does', () => {
  const r = role();
  const timeout = applyVerification(r, { kind: 'inconclusive', at: NOW.toISOString(), reason: 'timeout' });
  assert.equal(timeout.status, 'verified-open');
  assert.equal(timeout.lastVerifiedAt, r.lastVerifiedAt, 'an inconclusive check must not refresh verification');
  assert.equal(timeout.inconclusiveChecks, 1);
  const noEvidence = applyVerification(r, { kind: 'closed-confirmed', at: NOW.toISOString(), evidence: ' ' });
  assert.equal(noEvidence.status, 'verified-open');
  const closed = applyVerification(r, { kind: 'closed-confirmed', at: NOW.toISOString(), evidence: 'Page states: this job is no longer available' });
  assert.equal(closed.status, 'closed');
  assert.equal(isPubliclyVisible(closed, NOW), false);
  assert.equal(closed.firstSeenAt, r.firstSeenAt, 'history is preserved');
});

test('expiry hides a role even when no scheduled run ever marks it overdue', () => {
  const stale = role({ lastVerifiedAt: iso(73) });
  assert.equal(stale.status, 'verified-open');
  assert.equal(effectiveStatus(stale, NOW), 'overdue');
  assert.equal(isPubliclyVisible(stale, NOW), false);
  assert.equal(isPubliclyVisible(role({ lastVerifiedAt: iso(71) }), NOW), true);
  assert.equal(isPubliclyVisible(stale, NOW, { maxVerificationAgeHours: 96 }), true, 'max age is configurable');
});

test('GROQ cutoff only ever expires early, never late, and is hour-aligned for CDN reuse', () => {
  const cutoff = new Date(verificationCutoff(new Date('2026-11-09T08:25:00Z')));
  const exact = new Date('2026-11-09T08:25:00Z').getTime() - 72 * 3_600_000;
  assert.ok(cutoff.getTime() >= exact);
  assert.ok(cutoff.getTime() - exact < 3_600_000);
  assert.equal(cutoff.getUTCMinutes(), 0);
});

test('previously published roles are excluded from default selections, resurfacing is explicit', () => {
  const fresh = role({ _id: 'jobRole-acme-2', companyId: 'acme' });
  const seen = role({ _id: 'jobRole-beta-1', companyId: 'beta', publications: [{ channel: 'edition:2026-W44', publishedAt: iso(24 * 7), editionId: 'jobEdition-2026-W44' }] });
  assert.deepEqual(selectForEdition([fresh, seen], { now: NOW }).map((s) => s.role._id), ['jobRole-acme-2']);
  const again = selectForEdition([fresh, seen], { now: NOW, resurface: ['jobRole-beta-1'] });
  assert.equal(again.find((s) => s.role._id === 'jobRole-beta-1')?.resurfaced, true);
});

test('selection caps per company, spreads across companies and never pads', () => {
  const many = Array.from({ length: 30 }, (_, i) => role({ _id: `jobRole-c${i % 15}-${i}`, companyId: `c${i % 15}`, firstSeenAt: iso(i) }));
  const picked = selectForEdition(many, { now: NOW });
  const companies = new Set(picked.map((s) => s.role.companyId));
  assert.ok(companies.size <= 12);
  for (const c of companies) assert.ok(picked.filter((s) => s.role.companyId === c).length <= 2);
  assert.ok(picked.length <= 25);
  assert.equal(selectForEdition([], { now: NOW }).length, 0);
});

test('verification batch is bounded and nearest-to-expiry first', () => {
  const roles = [
    role({ _id: 'a', lastVerifiedAt: iso(5) }),
    role({ _id: 'b', lastVerifiedAt: iso(60) }),
    role({ _id: 'c', lastVerifiedAt: iso(30) }),
    role({ _id: 'd', status: 'closed' }),
  ];
  assert.deepEqual(pickVerificationBatch(roles, 2).map((r) => r._id), ['b', 'c']);
});

test('edition and run IDs are idempotent per week', () => {
  assert.equal(isoWeekId(new Date('2026-11-08T08:00:00Z')), '2026-W45');
  assert.equal(isoWeekId(new Date('2026-11-08T22:30:00Z')), '2026-W45', 'still Sunday in Zurich');
  assert.equal(isoWeekId(new Date('2026-11-08T23:30:00Z')), '2026-W46', 'Zurich is already Monday');
  assert.equal(editionDocId('2026-W45'), 'jobEdition-2026-W45');
  assert.equal(canonicalUrl('https://Example.com/jobs/1/?utm_source=a#x'), 'https://example.com/jobs/1');
});

test('draft checks count characters and reject dashes and hashtags', () => {
  assert.equal(draftLength('Zürich 🇨🇭'), 9);
  assert.deepEqual(draftStyleIssues('Plain text, no issues.'), []);
  assert.equal(draftStyleIssues('One \u2014 two \u2013 three #hiring').length, 3);
});

test('document IDs never contain a dot (dotted IDs are private in a public dataset)', () => {
  const ids = [
    roleDocId('acme', sourceKeyFor('https://boards.greenhouse.io/acme/jobs/100')),
    roleDocId('acme', sourceKeyFor('https://jobs.ashbyhq.com/acme/0b1c2d3e-aaaa-bbbb-cccc-1234567890ab')),
    roleDocId('acme', sourceKeyFor('https://careers.acme.io/en/jobs/senior.platform.engineer?id=7')),
    editionDocId('2026-W45'),
  ];
  for (const id of ids) {
    assert.doesNotMatch(id, /\./, id);
    assert.match(id, /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/, id);
  }
});
