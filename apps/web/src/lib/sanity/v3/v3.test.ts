/**
 * Loader contract tests against the offline fixture dataset (which mixes V3
 * and legacy V2 document shapes on purpose). Run: pnpm --filter web test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.SANITY_FIXTURES = '1';
const v3 = await import('./index');

test('events: V3 sessions and legacy V2 events normalise to sessions with buckets', async () => {
  const events = await v3.getAllEvents();
  const london = events.find((e) => e.slug === 'cityjs-london-2025');
  assert.ok(london, 'legacy event present');
  assert.equal(london.sessions.length, 1);
  assert.equal(london.sessions[0].role, 'speaker');
  assert.equal(london.sessions[0].legacy, true);
  assert.equal(london.sessions[0].recordingUrl, 'https://www.youtube.com/watch?v=ccccccccccc');
  assert.equal(london.seriesName, 'CityJS');
  const paris = events.find((e) => e.slug === 'react-paris-2025');
  assert.deepEqual(paris?.buckets, ['hosted']);
  const summit = events.find((e) => e.slug === 'react-summit-us-2025');
  assert.deepEqual(summit?.buckets, ['spoke']);
  assert.equal(summit?.seriesName, 'React Summit');
});

test('events: upcoming is computed in the event timezone', () => {
  const tz = 'America/New_York';
  // 23:30 local on the event day is still upcoming; 00:30 the next day is past.
  const lateOnDay = Date.parse('2025-11-19T04:30:00Z');
  const nextDay = Date.parse('2025-11-19T05:30:00Z');
  assert.equal(v3.isUpcoming('2025-11-18', undefined, tz, lateOnDay), true);
  assert.equal(v3.isUpcoming('2025-11-18', undefined, tz, nextDay), false);
});

test('talks: delivery history rolls up sessions; recording prefers the featured session', async () => {
  const talk = await v3.getTalkBySlug('caching-payloads-dark-arts');
  assert.ok(talk);
  assert.ok(talk.deliveredCount >= 3, `delivered ${talk.deliveredCount}`);
  assert.equal(talk.recording?.url, 'https://www.youtube.com/watch?v=bbbbbbbbbbb');
  assert.equal(talk.slidesUrl, 'https://slides.example/caching.pdf');
  const catalogue = await v3.getCatalogueTalks();
  assert.ok(!catalogue.some((t) => t.slug === 'nextjs-at-the-edge'), 'retired talks are not in the catalogue');
});

test('stats: talks delivered excludes hosting, attending and panels; countries exclude attend-only', async () => {
  const s = await v3.getSpeakingStats();
  assert.equal(s.fallback, false);
  const events = await v3.getAllEvents();
  const expected = events.flatMap((e) => e.sessions).filter((x) => x.status === 'delivered' && ['speaker', 'keynote', 'lightning'].includes(x.role)).length;
  assert.equal(s.talksDelivered, expected);
  assert.ok(!s.countryList.includes('Netherlands'), 'JSNation was attend-only');
  assert.ok(s.countryList.includes('France'), 'hosting counts for countries');
});

test('praise: legacy socialPost/testimonial map into praise with platform + topic', async () => {
  const all = await v3.getAllPraise();
  const bsky = all.find((p) => p._id === 'socialPost-legacy-1');
  assert.equal(bsky?.platform, 'bluesky');
  assert.equal(bsky?.topic, 'talk');
  assert.equal(bsky?.label, 'On Building Resilient UIs with React');
  const mc = all.find((p) => p._id === 'testimonial-legacy-1');
  assert.equal(mc?.platform, 'mentorcruise');
  assert.equal(mc?.topic, 'mentoring');
  assert.equal(all.find((p) => p._id === 'praise-rajni')?.label, 'On the caching talk');
});

test('writing: one timeline, legacy externalPost.type maps to format', async () => {
  const w = await v3.getWriting();
  assert.equal(w.find((i) => i._id === 'ext-legacy-spotify')?.format, 'podcast');
  assert.equal(w.find((i) => i._id === 'post-2025-review')?.hasCorrections, true);
  assert.ok(w[0].date >= w[w.length - 1].date, 'newest first');
});

test('metrics: only approved metrics, each dated', async () => {
  const m = await v3.getMetrics();
  assert.ok(!m.some((x) => x._id === 'metric-pending'));
  assert.ok(m.every((x) => x.dateLabel));
});

test('singletons merge over defaults; home featured resolves refs', async () => {
  const profile = await v3.getProfile();
  assert.ok(profile.bios.short && profile.rider.length && profile.photos.length === 6);
  const featured = await v3.getHomeFeatured();
  assert.equal(featured.length, 3);
  assert.equal(featured[0].kind, 'talk');
  const avail = await v3.getAvailability(new Date('2026-09-15'));
  assert.equal(avail.months.length, 12);
  assert.equal(avail.months[1].status, 'some');
  const career = await v3.getCareer();
  assert.ok(!career.some((c) => c.name === 'Unannounced'), 'private roles stay private');
});

test('community: metric references resolve, approved only, dated', async () => {
  const c = await v3.getPrimaryCommunity();
  assert.equal(c?.name, 'ZurichJS');
  assert.equal(c?.metrics.length, 4);
  assert.ok(c?.metrics.every((m) => m.dateLabel));
  assert.equal(c?.recognition.length, 1);
  assert.equal(c?.aftermovie?.published, false);
});
