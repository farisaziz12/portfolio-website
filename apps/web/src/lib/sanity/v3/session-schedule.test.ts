/**
 * Session schedule details: start time in the event's timezone (DST-aware),
 * the scheduled day at multi-day editions, track vs stage, and the schedule
 * source, from the loader through to the HTML/markdown helpers.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.SANITY_FIXTURES = '1';

const v3 = await import('./index');
const { sessionPlace, sessionTiming, upcomingMeta } = await import('../../events-view');

test('session clock: converts with the zone and daylight-saving rules for that date', () => {
  assert.equal(v3.sessionClock('2026-03-28T13:30:00Z', 'Europe/Zurich'), '14:30 CET');
  assert.equal(v3.sessionClock('2026-03-30T13:30:00Z', 'Europe/Zurich'), '15:30 CEST');
  assert.equal(v3.sessionClock('2026-03-30T13:30:00Z', 'Europe/London'), '14:30 BST');
});

test('session clock: offset-only zones name the city; day is the session day in that zone', () => {
  assert.equal(v3.sessionClock('2025-11-18T14:00:00Z', 'America/New_York'), '09:00 GMT-5 (New York time)');
  // 23:30 UTC is already the next day in Singapore.
  assert.equal(v3.sessionClock('2025-07-17T23:30:00Z', 'Asia/Singapore', { day: true }), 'Fri 18 Jul, 07:30 GMT+8 (Singapore time)');
  assert.equal(v3.sessionClock(undefined, 'Europe/Zurich'), '');
});

test('session place: track and stage both show, once when they are the same name', () => {
  assert.equal(sessionPlace({ track: 'Frontend', stage: 'Main stage' }), 'Frontend track · Main stage');
  assert.equal(sessionPlace({ track: 'Workshop track', stage: 'Room 2' }), 'Workshop track · Room 2');
  assert.equal(sessionPlace({ track: 'main room', stage: 'Main room' }), 'Main room');
  assert.equal(sessionPlace({ track: 'Frontend' }), 'Frontend track');
  assert.equal(sessionPlace({}), '');
});

test('multi-day edition: each session keeps its own day, time, stage and track', async () => {
  const e = (await v3.getAllEvents()).find((x) => x.slug === 'whatthestack-2025');
  assert.ok(e);
  const [talk, workshop] = e.sessions;
  assert.equal(talk.key, 'a');
  assert.equal(talk.track, 'Frontend');
  assert.equal(talk.scheduleSourceUrl, 'https://whatthestack.example/schedule#caching');
  assert.equal(talk.scheduleCheckedAt, '2025-09-01T09:00:00Z');
  assert.equal(sessionTiming(e, talk), 'Sat 20 Sep, 14:30 CEST · Frontend track · Main stage');
  assert.equal(workshop.key, 'b');
  assert.equal(workshop.track, undefined);
  assert.equal(sessionTiming(e, workshop), 'Sun 21 Sep, 09:00 CEST · Room 2');
  assert.equal(talk.talk?.slug, 'caching-payloads-dark-arts', 'references unchanged');
});

test('one-day edition: time without a day; identical track and stage collapse', async () => {
  const e = (await v3.getAllEvents()).find((x) => x.slug === 'devs-ghent-2026');
  assert.ok(e);
  assert.equal(sessionTiming(e, e.sessions[0]), '19:00 CEST · Main room');
  assert.match(upcomingMeta(e), /19:00 CEST$/);
});

test('attend-only and unscheduled records get no invented schedule', async () => {
  const all = await v3.getAllEvents();
  const jsnation = all.find((x) => x.slug === 'jsnation-2025');
  assert.ok(jsnation);
  const s = jsnation.sessions[0];
  assert.equal(s.role, 'attendee');
  assert.ok(!s.startsAt);
  assert.equal(s.track, undefined);
  assert.equal(s.scheduleSourceUrl, undefined);
  assert.equal(sessionTiming(jsnation, s), '');
  const summit = all.find((x) => x.slug === 'react-summit-us-2025');
  assert.equal(summit?.sessions[0].recordingUrl, 'https://www.youtube.com/watch?v=bbbbbbbbbbb', 'recordings unchanged');
});
