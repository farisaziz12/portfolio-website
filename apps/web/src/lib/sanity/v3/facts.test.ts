/**
 * The headline stats have one source (getSpeakingStats) and one phrasing
 * (speakingLine). These tests pin the placeholder filling, the claim detector
 * that `check:stats` uses, and run that check against the fixture dataset.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.SANITY_FIXTURES = '1';
const facts = await import('./facts');
const { checkStats } = await import('../../../../scripts/check-stats');

const ctx = {
  stats: { sessionsDelivered: 61, countries: 19, cities: 27, asOf: '2026-11-02' },
  metrics: [{ _id: 'metric-sjg', value: '4,500', label: 'Swiss JavaScript Group members', dateLabel: 'Jul 2026' }],
};

test('facts: placeholders fill from stats and metric documents', () => {
  assert.equal(
    facts.fillFacts('{sessions} sessions across {countries} countries, as of {asOf}.', ctx),
    '61 sessions across 19 countries, as of 2nd Nov 2026.'
  );
  assert.equal(facts.fillFacts('{talks}', ctx), '61', '{talks} stays as an alias');
  assert.equal(facts.fillFacts('{metric:metric-sjg}', ctx), '4,500 Swiss JavaScript Group members (Jul 2026)');
  assert.equal(facts.fillFacts('{metricValue:metric-sjg}', ctx), '4,500');
  // Unknown ids stay visible so check:stats can flag them.
  assert.equal(facts.fillFacts('{metric:nope}', ctx), '{metric:nope}');
  assert.deepEqual(facts.unfilledTokens('a {metric:nope} b'), ['{metric:nope}']);
  assert.equal(facts.fillFacts(undefined, ctx), undefined);
});

test('facts: fillFactsDeep fills Portable Text spans and leaves _keys alone', () => {
  const blocks = [{ _type: 'block', _key: '{talks}', children: [{ _type: 'span', text: 'I have given {talks} talks.' }] }];
  const out = facts.fillFactsDeep(blocks, ctx);
  assert.equal(out[0].children[0].text, 'I have given 61 talks.');
  assert.equal(out[0]._key, '{talks}');
});

test('facts: the live inconsistencies are all detected as claims', () => {
  const stats = { sessionsDelivered: 61, countries: 19 };
  const live = [
    '80+ talks across 21 countries', // homepage meta / OG / Twitter
    '92+ speaking engagements across 22 countries', // /about meta
    '92 Talks given', // /about stat tile
    'Talks delivered: 92',
    'Countries spoken in: 22',
    '**22** countries spoken in',
    '92 sessions',
    'Sessions: 92',
    '92 sessions across 22 countries',
  ];
  for (const text of live) assert.ok(facts.divergentClaims(text, stats).length > 0, `missed: ${text}`);
  assert.deepEqual(facts.divergentClaims('61 talks delivered in 19 countries (as of 25th Oct 2026)', stats), []);
  assert.deepEqual(facts.divergentClaims('61 sessions in 19 countries', stats), []);
  assert.deepEqual(facts.divergentClaims(facts.speakingLine(stats), stats), []);
});

test('facts: other counts are not mistaken for the headline', () => {
  for (const text of [
    '5 talks you can book.',
    '5 talks in the current catalogue',
    '436 talk proposals, first Conf',
    '2 workshops · 5 talks in the current catalogue',
    'All 5 talks: https://faziz-dev.com/talks.md',
  ]) {
    assert.deepEqual(facts.findStatClaims(text), [], text);
  }
});

test('facts: speakingLine pluralises', () => {
  assert.equal(facts.speakingLine({ sessionsDelivered: 1, countries: 1 }), '1 session in 1 country');
  assert.equal(facts.speakingLine({ sessionsDelivered: 61, countries: 19 }), '61 sessions in 19 countries');
});

test('check:stats: llms.txt, the .md mirrors and CMS copy agree on the fixture dataset', async () => {
  const report = await checkStats();
  assert.deepEqual(report.errors, []);
  assert.equal(report.stats.fallback, false);
  const b = report.stats.breakdown;
  assert.equal(report.stats.sessionsDelivered, b.conferenceTalks + b.workshops + b.panels + b.guestSpots);
});
