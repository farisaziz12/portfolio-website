/** Listing excerpts: whole sentences under the cap, else a word-boundary cut. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { excerpt } from './workshops-view';

test('excerpt: keeps short text, stops at a sentence, cuts long first sentences at a word', () => {
  assert.equal(excerpt('Short and sweet.'), 'Short and sweet.');
  assert.equal(excerpt('One. Two is here. ' + 'x '.repeat(200), 30), 'One. Two is here.');
  const long = 'A very long first sentence that keeps going and going without any full stop at all until the end';
  const out = excerpt(long, 40);
  assert.ok(out.endsWith('…') && out.length <= 41 && !out.includes('  '), out);
  assert.equal(excerpt(undefined), '');
});
