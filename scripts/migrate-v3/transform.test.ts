/**
 * Migration contract, run against the offline fixture dataset (which mixes V3
 * and V2 shapes). Run: pnpm test:migrate
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { planMigration, applyInMemory, type Doc } from './transform';

const fixture: Doc[] = JSON.parse(readFileSync(join(import.meta.dirname, '../../apps/web/fixtures/sanity-dataset.json'), 'utf8'));

test('legacy events get sessions, kind, url and a series; legacy fields are removed', () => {
  const out = applyInMemory(fixture, planMigration(fixture));
  const london = out.find((d) => d._id === 'event-cityjs-london-2025')!;
  assert.equal((london.sessions as { role: string }[])[0].role, 'speaker');
  assert.equal((london.sessions as { recording?: { url: string } }[])[0].recording?.url, 'https://www.youtube.com/watch?v=ccccccccccc');
  assert.equal(london.kind, 'conference');
  assert.equal(london.url, 'https://london.cityjsconf.org');
  assert.ok(!('type' in london) && !('conference' in london) && !('links' in london) && !('talk' in london));
  // CityJS already exists as a series in the fixture → reused, not duplicated.
  assert.equal((london.series as { _ref: string })._ref, 'series-cityjs');
  const paris = out.find((d) => d._id === 'event-react-paris-2025')!;
  assert.equal((paris.sessions as { role: string }[])[0].role, 'host');
  assert.ok(out.some((d) => d._type === 'eventSeries' && d._id === 'series-react-paris'));
});

test('socialPost and testimonial become praise; nothing is lost', () => {
  const out = applyInMemory(fixture, planMigration(fixture));
  const before = fixture.filter((d) => ['praise', 'socialPost', 'testimonial'].includes(d._type)).length;
  assert.equal(out.filter((d) => d._type === 'praise').length, before);
  const bsky = out.find((d) => d.legacyId === 'socialPost:socialPost-legacy-1')!;
  assert.equal(bsky.platform, 'bluesky');
  assert.equal(bsky.topic, 'talk');
  const mc = out.find((d) => d.legacyId === 'testimonial:testimonial-legacy-1')!;
  assert.equal(mc.platform, 'mentorcruise');
  assert.equal(mc.topic, 'mentoring');
});

test('delete-legacy removes the migrated sources', () => {
  const out = applyInMemory(fixture, planMigration(fixture, { deleteLegacy: true }));
  assert.ok(!out.some((d) => d._type === 'socialPost' || d._type === 'testimonial'));
});

test('externalPost type → format, legacy workshop agenda → formats', () => {
  const out = applyInMemory(fixture, planMigration(fixture));
  const spotify = out.find((d) => d._id === 'ext-legacy-spotify')!;
  assert.equal(spotify.format, 'podcast');
  assert.ok(!('type' in spotify));
  const ws = out.find((d) => d._id === 'workshop-legacy')!;
  assert.equal((ws.formats as { agenda: unknown[] }[])[0].agenda.length, 1);
  assert.ok(!('agenda' in ws));
});

test('idempotent: planning again on migrated data is a no-op', () => {
  const once = applyInMemory(fixture, planMigration(fixture, { deleteLegacy: true }));
  const again = planMigration(once, { deleteLegacy: true });
  assert.deepEqual(again.mutations, [], JSON.stringify(again.mutations.slice(0, 3)));
});

test('legacy metric units keep their suffix (4.5 + k → 4.5K)', async () => {
  const { formatLegacyMetric } = await import('../../packages/shared/src/content-model');
  assert.equal(formatLegacyMetric({ headlineNumber: 4.5, unit: 'k' }), '4.5K');
  assert.equal(formatLegacyMetric({ headlineNumber: 12, unit: 'm', prefix: '€' }), '€12M');
  assert.equal(formatLegacyMetric({ headlineNumber: 4500, unit: 'number' }), '4,500');
  assert.equal(formatLegacyMetric({ headlineNumber: 3, unit: 'x' }), '3×');
  assert.equal(formatLegacyMetric({ headlineNumber: 99.9, unit: 'percent' }), '99.9%');
});
