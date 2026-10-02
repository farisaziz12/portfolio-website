/** artworkSource: which links get looked-up cover art, and from where. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { artworkSource, lookupArtwork } from './artwork';

test('artworkSource: YouTube links become a thumbnail URL', () => {
  const want = { kind: 'direct', url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' };
  assert.deepEqual(artworkSource('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30'), want);
  assert.deepEqual(artworkSource('https://youtu.be/dQw4w9WgXcQ?si=abc'), want);
  assert.deepEqual(artworkSource('https://www.youtube.com/live/dQw4w9WgXcQ'), want);
  assert.equal(artworkSource('https://www.youtube.com/@channel'), undefined);
});

test('artworkSource: Spotify episodes and shows use oEmbed, without the query string', () => {
  assert.deepEqual(artworkSource('https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk?si=1'), {
    kind: 'spotify',
    url: 'https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk',
  });
  assert.equal(artworkSource('https://open.spotify.com/x')?.kind, undefined);
});

test('artworkSource: Apple Podcasts prefers the episode id', () => {
  assert.deepEqual(artworkSource('https://podcasts.apple.com/us/podcast/podrocket/id1539945251?i=1000600000000'), {
    kind: 'apple',
    id: '1000600000000',
  });
  assert.deepEqual(artworkSource('https://podcasts.apple.com/us/podcast/podrocket/id1539945251'), { kind: 'apple', id: '1539945251' });
});

test('artworkSource: other links and junk give nothing', () => {
  assert.equal(artworkSource('https://example.com/podrocket'), undefined);
  assert.equal(artworkSource('not a url'), undefined);
});

test('lookupArtwork: unknown hosts resolve to undefined without a request', async () => {
  assert.equal(await lookupArtwork('https://example.com/ep-1'), undefined);
});
