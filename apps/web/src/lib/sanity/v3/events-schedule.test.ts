import test from 'node:test';
import assert from 'node:assert/strict';

process.env.SANITY_FIXTURES = '1';

const v3 = await import('./index');
const { roleLabel } = await import('../../events-view');

const NOW = Date.parse('2026-10-07T09:00:00Z');

function make(id: string, date: string, sessions: { role: string; status?: 'cancelled' }[]) {
  return v3.normalizeEvent(
    { _id: id, title: id, slug: id, date, timezone: 'Europe/Vienna', sessions: sessions.map((s, i) => ({ _key: `k${i}`, ...s })) } as never,
    NOW
  );
}

test('schedule: attend-only events are scheduled but are not engagements', () => {
  const halfstack = make('halfstack-vienna-2026', '2026-11-16', [{ role: 'attendee' }]);
  assert.equal(v3.isScheduled(halfstack), true);
  assert.equal(v3.isEngagement(halfstack), false);
  assert.equal(roleLabel(halfstack), 'Attending');
});

test('schedule: events whose sessions are all cancelled are not scheduled', () => {
  const gone = make('gone', '2026-11-20', [{ role: 'speaker', status: 'cancelled' }, { role: 'attendee', status: 'cancelled' }]);
  assert.equal(v3.isScheduled(gone), false);
  const partly = make('partly', '2026-11-20', [{ role: 'speaker', status: 'cancelled' }, { role: 'attendee' }]);
  assert.equal(v3.isScheduled(partly), true);
  assert.equal(roleLabel(partly), 'Attending', 'a cancelled talk never shows as Speaking');
});

test('schedule: role labels are explicit and never imply speaking', () => {
  assert.equal(roleLabel(make('a', '2026-11-01', [{ role: 'speaker' }])), 'Speaking');
  assert.equal(roleLabel(make('b', '2026-11-01', [{ role: 'workshop' }])), 'Workshop');
  assert.equal(roleLabel(make('c', '2026-11-01', [{ role: 'host' }])), 'Hosting');
  assert.equal(roleLabel(make('d', '2026-11-01', [{ role: 'speaker' }, { role: 'attendee' }])), 'Speaking + Attending');
  assert.equal(roleLabel(make('e', '2026-01-01', [{ role: 'attendee' }])), 'Attended');
});

test('schedule: upcoming list is chronological, matches the count, and engagements are a subset', async () => {
  const [upcoming, engagements, stats, past, all] = await Promise.all([
    v3.getUpcomingEvents(),
    v3.getUpcomingEngagements(),
    v3.getSpeakingStats(),
    v3.getPastEvents(),
    v3.getAllEvents(),
  ]);
  assert.deepEqual(upcoming.map((e) => e.date), [...upcoming.map((e) => e.date)].sort());
  assert.equal(stats.upcoming, upcoming.length);
  assert.ok(upcoming.every((e) => e.buckets.length > 0));
  assert.ok(engagements.every((e) => upcoming.includes(e) && e.buckets.some((b) => b !== 'attended')));
  assert.equal(past.length + all.filter((e) => e.isUpcoming).length, all.length);
});

test('stats: attendance stays out of talks, workshops and countries', async () => {
  const stats = await v3.getSpeakingStats();
  const events = await v3.getAllEvents();
  const attendOnlyCountries = new Set(events.filter((e) => e.buckets.length && e.buckets.every((b) => b === 'attended')).map((e) => e.location.country));
  const otherCountries = new Set(events.filter((e) => e.buckets.some((b) => b !== 'attended')).map((e) => e.location.country));
  for (const c of attendOnlyCountries) if (c && !otherCountries.has(c)) assert.ok(!stats.countryList.includes(c));
});

test('dates: every day number carries an ordinal suffix', () => {
  const day = (n: number) => v3.ordinal(n);
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 24, 30, 31].map(day), ['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '24th', '30th', '31st']);
  assert.equal(v3.dayMonth('2026-11-16'), '16th Nov');
  assert.equal(v3.fullDate('2026-10-03'), '3rd Oct 2026');
});
