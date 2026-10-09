import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { REDIRECTS, isRedirected, withoutRedirected } from './redirects';

describe('redirects', () => {
  it('only redirect to local paths, with no chains', () => {
    for (const [from, to] of Object.entries(REDIRECTS)) {
      assert.match(from, /^\/[a-z0-9/-]+$/);
      assert.match(to, /^\/[a-z0-9/-]+$/);
      assert.ok(!isRedirected(to), `${from} → ${to} chains into another redirect`);
    }
  });

  it('keeps CMS pages off URLs that redirect away (/services/speaking → /speaking)', () => {
    const pages = [{ slug: 'speaking' }, { slug: 'advisory' }, { slug: 'workshops' }];
    assert.deepEqual(withoutRedirected(pages, '/services').map((p) => p.slug), ['advisory', 'workshops']);
    assert.deepEqual(withoutRedirected(pages, '/talks').map((p) => p.slug), ['speaking', 'advisory', 'workshops']);
  });
});
