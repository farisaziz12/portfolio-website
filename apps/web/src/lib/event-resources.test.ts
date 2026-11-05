/** "Resources from this session" shows whatever is set in the CMS, before and after the event. */
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.SANITY_FIXTURES = '1';

const v3 = await import('./sanity/v3/index');
const { eventResources } = await import('./events-view');

const NOW = Date.parse('2026-11-05T09:00:00Z');
const TALK = { _id: 't', slug: 'caching', title: 'Caching, Payloads, and Other Dark Arts: Optimizing UX in Suboptimal Conditions' };
const SLIDES = 'https://faziz-dev.com/slides/caching-payloads-heapcon/';

function make(date: string, session: Record<string, unknown> = {}) {
  return v3.normalizeEvent(
    { _id: 'e', title: 'e', slug: 'e', date, timezone: 'Europe/Belgrade', sessions: [{ _key: 'k', role: 'speaker', talk: TALK, ...session }] } as never,
    NOW
  );
}

test('resources: an upcoming event shows slides that are already published', () => {
  const e = make('2026-11-20', { slidesUrl: SLIDES, slidesNote: 'Interactive slide deck' });
  assert.equal(e.isUpcoming, true);
  assert.equal(e.sessions[0].status, 'confirmed', 'status is not forced to delivered');
  const cells = eventResources(e);
  assert.deepEqual(
    cells.map((c) => [c.label, c.title, c.href, c.meta]),
    [['Slides', 'Interactive slide deck', SLIDES, 'faziz-dev.com']]
  );
});

test('resources: an upcoming event with nothing published falls back to the placeholder', () => {
  assert.deepEqual(eventResources(make('2026-11-20')), []);
});

test('resources: a past event shows its slides', () => {
  const e = make('2026-03-10', { slidesUrl: SLIDES });
  assert.equal(e.isUpcoming, false);
  assert.deepEqual(eventResources(e).map((c) => [c.label, c.title, c.href]), [['Slides', 'Slide deck', SLIDES]]);
});

test('resources: every configured link shows, in a stable order', () => {
  const e = make('2026-03-10', {
    slidesUrl: SLIDES,
    repoUrl: 'https://github.com/farisaziz12/caching-demo',
    recordingUrl: 'https://www.youtube.com/watch?v=abc',
    recordingMinutes: 28,
  });
  const cells = eventResources(e, 4, true);
  assert.deepEqual(cells.map((c) => c.label), ['Recording', 'Slides', 'Code', 'Photos']);
  assert.equal(cells[0].title, 'Caching, Payloads, and Other Dark Arts');
  assert.equal(cells[2].href, 'https://github.com/farisaziz12/caching-demo');
  assert.equal(cells[2].meta, 'github.com');
  assert.equal(cells[3].meta, 'Credits attached');
});

test('resources: no empty cells for blank or missing fields', () => {
  const e = make('2026-11-20', { slidesUrl: '', repoUrl: undefined, recordingUrl: null });
  const cells = eventResources(e, 0);
  assert.equal(cells.length, 0);
  assert.ok(cells.every((c) => c.href));
});
