/**
 * Voice rules (packages/shared/src/voice.ts): the tells fire, honest copy
 * doesn't, and other people's quotes are never scanned.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectText, findTells } from 'shared';

const rules = (text: string) => findTells(text).map((h) => h.rule);

test('voice: flags the usual tells', () => {
  assert.deepEqual(rules('We leverage seamless, robust tooling.'), ['leverage', 'seamless', 'robust']);
  assert.deepEqual(rules("It's not just a meetup, it's a movement."), ['not-just']);
  assert.deepEqual(rules('Available upon request, unmodified.'), ['formal', 'formal']);
  assert.deepEqual(rules('Filters write to the URL, so a filtered view can be shared.'), ['narrating', 'narrating']);
  assert.deepEqual(rules("Status is computed from the event's own timezone."), ['narrating']);
  assert.deepEqual(rules('Payments at scale — what breaks first'), ['em-dash']);
});

test('voice: leaves plain copy alone', () => {
  for (const ok of [
    'I reply within two days.',
    'Caching, Payloads, and Other Dark Arts',
    'Photos crop to landscape 16:9 around the hotspot.',
    'Talks and workshops on production engineering, payments at scale, and growing into leadership.',
    '> “Great talk”\n> — Jane Doe, React Summit',
  ]) {
    assert.deepEqual(rules(ok), [], ok);
  }
});

test('voice: collectText reads prose and Portable Text, skips quotes and data', () => {
  const fields = collectText({
    _id: 'x',
    _type: 'talk',
    slug: { current: 'a-seamless-slug' },
    summary: 'A robust talk.',
    quote: 'A seamless and robust quote.',
    body: [{ _type: 'block', children: [{ text: 'We delve ' }, { text: 'into it.' }] }],
  });
  assert.deepEqual(fields.map((f) => f.path), ['summary', 'body[0]']);
  assert.equal(fields[1].text, 'We delve into it.');
});
