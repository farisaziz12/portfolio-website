/** foldText: first N sentences visible, line breaks kept, the rest marked extra. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { foldText, sentences } from './text';

test('sentences: splits on . ! ? and keeps closing quotes', () => {
  assert.deepEqual(sentences('One. Two! "Three?" Four').map((s) => s.trim()), ['One.', 'Two!', '"Three?"', 'Four']);
});

test('foldText: five visible sentences across paragraphs, the rest extra', () => {
  const { paragraphs, hasMore } = foldText('A. B. C.\n\nD.\nE. F.\n\nG.');
  assert.equal(hasMore, true);
  assert.deepEqual(paragraphs.map((p) => p.segments.map((s) => `${s.text.trim()}${s.extra ? '*' : ''}`)), [['A.', 'B.', 'C.'], ['D.', 'E.', 'F.*'], ['G.*']]);
  // The single line break inside a paragraph is kept on the sentence before it.
  assert.equal(paragraphs[1].segments[0].text, 'D.\n');
  assert.deepEqual(paragraphs.map((p) => p.extra), [false, false, true]);
});

test('foldText: short text has nothing to fold; empty is empty', () => {
  assert.equal(foldText('Just one sentence.').hasMore, false);
  assert.deepEqual(foldText(undefined).paragraphs, []);
});
