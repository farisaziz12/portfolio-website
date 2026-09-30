/** Listing excerpts: whole sentences under the cap, else a word-boundary cut. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { excerpt, lengthRange } from './workshops-view';
import type { Workshop } from './sanity/v3';

test('excerpt: keeps short text, stops at a sentence, cuts long first sentences at a word', () => {
  assert.equal(excerpt('Short and sweet.'), 'Short and sweet.');
  assert.equal(excerpt('One. Two is here. ' + 'x '.repeat(200), 30), 'One. Two is here.');
  const long = 'A very long first sentence that keeps going and going without any full stop at all until the end';
  const out = excerpt(long, 40);
  assert.ok(out.endsWith('…') && out.length <= 41 && !out.includes('  '), out);
  assert.equal(excerpt(undefined), '');
});

const ws = (...formats: { label: string; duration?: string }[]) => ({ formats }) as unknown as Workshop;

test('lengthRange: shortest edition first, full day last', () => {
  assert.equal(lengthRange([ws({ label: '3-hour edition', duration: '3 h' }, { label: 'Full day', duration: '6.5 h' })]), '3 h to full day');
  assert.equal(lengthRange([ws({ label: '3-hour', duration: '3 h' }), ws({ label: '4-hour', duration: '4 h' })]), '3 to 4 h');
  assert.equal(lengthRange([ws({ label: '3-hour', duration: '3 h' })]), '3 h');
  assert.equal(lengthRange([ws({ label: 'Full day' })]), 'full day');
  assert.equal(lengthRange([]), '');
});
