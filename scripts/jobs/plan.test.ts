/** Planner scenarios: the validation list, end to end over pure functions. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ageLabelFor, applyOps } from './test-helpers.ts';
import { planEdition, reconcile, verify } from './plan.ts';
import { isPubliclyVisible, type JobRole } from '../../packages/shared/src/jobs.ts';

const T1 = new Date('2026-11-02T08:00:00Z');
const T2 = new Date('2026-11-09T08:00:00Z');

const gh = (id: number, over = {}) => ({
  companyId: 'acme',
  title: 'Senior Platform Engineer',
  applyUrl: `https://boards.greenhouse.io/acme/jobs/${id}`,
  locationText: 'Remote, Switzerland',
  geoKind: 'remote-ch' as const,
  eligibleCountries: ['CH'],
  eligibilityEvidence: 'Remote within Switzerland',
  ...over,
});

test('same opening from two sources is one record; two reqs at one company stay two', () => {
  const run1 = reconcile([], [gh(100), gh(101, { title: 'Staff Backend Engineer' })], T1);
  assert.equal(run1.ops.length, 2);
  const stored = applyOps([], run1.ops);
  const viaAgg = { ...gh(100), applyUrl: 'https://aggregator.example/j/9', discoveryUrls: ['https://job-boards.greenhouse.io/acme/jobs/100/'] };
  const run2 = reconcile(stored, [viaAgg], T2);
  assert.equal(run2.ops.length, 1);
  assert.equal(run2.ops[0].op, 'update');
  assert.equal(applyOps(stored, run2.ops).length, 2, 'no new record');
});

test('repeated runs create no duplicates and never reset age', () => {
  let stored: JobRole[] = [];
  for (const t of [T1, T2, T2, T2]) stored = applyOps(stored, reconcile(stored, [gh(100), gh(101, { title: 'Staff Backend Engineer' })], t).ops);
  assert.equal(stored.length, 2);
  assert.ok(stored.every((r) => r.firstSeenAt === T1.toISOString()));
  assert.match(ageLabelFor(stored[0], T2), /First discovered 7 days ago; posting date unknown/);
  assert.equal(reconcile(stored, [gh(100)], T2).ops.every((o) => o.op === 'update'), true);
});

test('ambiguous eligibility is created but never becomes public automatically', () => {
  const stored = applyOps([], reconcile([], [gh(100, { geoKind: 'remote-emea', eligibleCountries: ['DE', 'FR'], eligibilityEvidence: 'Remote EMEA' })], T1).ops);
  const open = verify(stored[0], { kind: 'open-confirmed', at: T2.toISOString() });
  assert.equal(isPubliclyVisible(open, T2), false);
});

test('source failure leaves the role open; closure and expiry remove it from public results', () => {
  const stored = applyOps([], reconcile([], [gh(100)], T1).ops);
  const open = verify(stored[0], { kind: 'open-confirmed', at: T2.toISOString() });
  assert.equal(isPubliclyVisible(open, T2), true);
  const failed = verify(open, { kind: 'inconclusive', at: T2.toISOString(), reason: 'HTTP 503' });
  assert.equal(isPubliclyVisible(failed, T2), true);
  const closed = verify(failed, { kind: 'closed-confirmed', at: T2.toISOString(), evidence: 'Listing states the position has been filled' });
  assert.equal(isPubliclyVisible(closed, T2), false);
  assert.equal(isPubliclyVisible(open, new Date(T2.getTime() + 73 * 3_600_000)), false, 'expires with no run at all');
});

test('editions: published roles excluded by default, resurfacing is labelled, a rerun creates no second edition', () => {
  const stored = applyOps([], reconcile([], [gh(100), gh(101, { title: 'Staff Backend Engineer', companyId: 'beta' })], T1).ops)
    .map((r) => verify(r, { kind: 'open-confirmed', at: T2.toISOString() }));
  const first = planEdition(stored, [], T2);
  assert.equal(first.alreadyExists, false);
  assert.equal(first.items.length, 2);
  assert.equal(planEdition(stored, [first.id], T2).alreadyExists, true, 'same week, same edition id');
  const published = stored.map((r) => ({ ...r, publications: [{ channel: `edition:${first.weekId}`, publishedAt: T2.toISOString(), editionId: first.id }] }));
  const nextWeek = new Date(T2.getTime() + 7 * 86_400_000);
  const refreshed = published.map((r) => verify(r, { kind: 'open-confirmed', at: nextWeek.toISOString() }));
  assert.equal(planEdition(refreshed, [first.id], nextWeek).items.length, 0);
  const again = planEdition(refreshed, [first.id], nextWeek, [refreshed[0]._id]);
  assert.deepEqual(again.items.map((i) => i.resurfaced), [true]);
});

test('public documents carry no private fields', () => {
  const doc = reconcile([], [gh(100)], T1).ops[0];
  const keys = Object.keys((doc as { doc: object }).doc).join(' ');
  assert.doesNotMatch(keys, /email|phone|contact|note|submitter|reviewer/i);
});
