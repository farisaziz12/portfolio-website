/**
 * Community-page quote selection. Regression: the page used to take one quote
 * per topic (community → workshop → stage), which forced a workshop quote into
 * the second slot even when two community quotes were ordered first in the CMS.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { PraiseTopic } from 'shared';

process.env.SANITY_FIXTURES = '1';
const v3 = await import('./index');
type Praise = Awaited<ReturnType<typeof v3.getAllPraise>>[number];

const q = (id: string, topic: PraiseTopic, extra: Partial<Praise> = {}): Praise => ({
  _id: id,
  quote: `Quote ${id}`,
  platform: 'direct',
  author: { name: `Person ${id}` },
  topic,
  label: 'On ZurichJS',
  featured: true,
  ...extra,
});

const pool = () => [
  q('older-community', 'community', { date: '2025-06-01' }),
  q('workshop', 'workshop', { date: '2026-01-01' }),
  q('stage', 'stage', { date: '2026-02-01' }),
  q('conf-b', 'community', { order: -19 }),
  q('conf-a', 'community', { order: -20 }),
  q('unfeatured-community', 'community', { featured: false, order: -50 }),
];

test('community praise: takes the first two community quotes in CMS order, not one per topic', () => {
  const ids = v3.pickCommunityPraise(pool().sort(v3.byCmsOrder)).map((p) => p._id);
  assert.deepEqual(ids, ['conf-a', 'conf-b']);
});

test('community praise: CMS order alone decides the slots', () => {
  const list = pool().map((p) => (p._id === 'older-community' ? { ...p, order: -30 } : p));
  const ids = v3.pickCommunityPraise(list.sort(v3.byCmsOrder)).map((p) => p._id);
  assert.deepEqual(ids, ['older-community', 'conf-a']);
});

test('community praise: never fills empty slots with other topics', () => {
  const others = pool().filter((p) => p.topic !== 'community');
  assert.deepEqual(v3.pickCommunityPraise(others), []);
  const one = [...others, q('only', 'community')].sort(v3.byCmsOrder);
  assert.deepEqual(v3.pickCommunityPraise(one).map((p) => p._id), ['only']);
});

test('community praise: loader returns only community quotes from the dataset', async () => {
  const picked = await v3.getCommunityPraise();
  assert.ok(picked.length <= 2);
  assert.ok(picked.every((p) => p.topic === 'community'));
  assert.ok(!picked.some((p) => p._id === 'praise-ioannis' || p._id === 'praise-hammad'));
});

test('homepage praise: still follows the curated homePage.praise list', async () => {
  const home = await v3.getHomePraise();
  assert.equal(home.spotlight?._id, 'praise-tejas');
  assert.equal(home.underPosters?._id, 'praise-rajni');
  assert.ok(!home.cards.some((p) => p._id === 'praise-rajni'));
});

test('praise attribution: missing headline, date and platform collapse cleanly', () => {
  assert.equal(v3.praiseAttribution(q('x', 'community')), 'Person x');
  assert.equal(
    v3.praiseAttribution(q('y', 'community', { author: { name: 'Ada', headline: 'DevRel · Acme' }, platform: 'linkedin', date: '2026-03-04' })),
    'Ada · DevRel · Acme · LinkedIn, Mar 2026'
  );
});
