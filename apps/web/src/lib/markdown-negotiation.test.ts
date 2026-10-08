import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { negotiablePages, withMarkdownNegotiation, type VercelRoute } from './markdown-negotiation';

/** Trimmed copy of the routes @astrojs/vercel writes for this site. */
const ADAPTER_ROUTES: VercelRoute[] = [
  { src: '^/consulting$', headers: { Location: '/services' }, status: 301 },
  { src: '^/_astro(?:/(.*))$', headers: { 'cache-control': 'public, max-age=31536000, immutable' }, continue: true },
  { handle: 'filesystem' },
  { src: '^/api/contact$', dest: '_render' },
  { src: '^(/([^/]+?)/?)$', dest: '/_isr?x_astro_path=$1' },
  { src: '^(/)$', dest: '/_isr?x_astro_path=$1' },
  { src: '^/.*$', dest: '/404.html', status: 404 },
];

const STATIC_FILES = ['404.html', 'about/index.html', 'about.md', 'talks/index.html', 'talks.md', 'talks/a-b.c/index.html', 'talks/a-b.c.md', 'home.md', '404.md', 'llms.txt'];

interface Outcome {
  dest: string;
  status: number;
  headers: Record<string, string>;
}

/**
 * Minimal model of Vercel's router for the route shapes used here: routes run
 * in order, `continue` routes only merge headers, the first final match
 * rewrites (with `$n` substitution). Paths that exist on disk are served at
 * the filesystem handle; anything else keeps going.
 */
function route(routes: VercelRoute[], path: string, accept: string, files = STATIC_FILES): Outcome {
  const headers: Record<string, string> = {};
  const onDisk = (p: string) => files.includes(p.replace(/^\//, '')) || files.includes(`${p.replace(/^\//, '').replace(/\/$/, '')}/index.html`);
  for (const r of routes) {
    if (r.handle === 'filesystem') {
      if (onDisk(path)) return { dest: path, status: 200, headers };
      continue;
    }
    const m = r.src ? new RegExp(r.src).exec(path) : null;
    if (!m) continue;
    if (r.has?.some((h) => !new RegExp(`^${h.value}$`).test(accept))) continue;
    Object.assign(headers, r.headers);
    if (r.continue) continue;
    const dest = (r.dest ?? path).replace(/\$(\d)/g, (_, n: string) => m[Number(n)] ?? '');
    return { dest, status: r.status ?? 200, headers };
  }
  return { dest: path, status: 404, headers };
}

const MD = 'text/markdown';
const HTML = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

describe('negotiablePages', () => {
  it('keeps .md mirrors that have an HTML page, minus home and 404', () => {
    assert.deepEqual(negotiablePages(STATIC_FILES), ['about', 'talks', 'talks/a-b.c']);
  });

  it('drops a mirror with no HTML sibling', () => {
    assert.deepEqual(negotiablePages(['orphan.md', 'x/index.html']), []);
  });
});

describe('withMarkdownNegotiation', () => {
  const routes = withMarkdownNegotiation(ADAPTER_ROUTES, negotiablePages(STATIC_FILES));

  it('serves the home mirror for Accept: text/markdown on /', () => {
    const r = route(routes, '/', MD);
    assert.equal(r.dest, '/home.md');
    assert.equal(r.status, 200);
    assert.equal(r.headers['Content-Type'], 'text/markdown; charset=utf-8');
    assert.equal(r.headers.Vary, 'Accept');
  });

  it('keeps HTML for browsers on /, with Vary: Accept', () => {
    const r = route(routes, '/', HTML);
    assert.match(r.dest, /^\/_isr/);
    assert.equal(r.headers.Vary, 'Accept');
    assert.equal(r.headers['Content-Type'], undefined);
  });

  it('matches markdown anywhere in the Accept list', () => {
    assert.equal(route(routes, '/', 'text/markdown, text/html;q=0.9').dest, '/home.md');
    assert.equal(route(routes, '/', 'text/plain;q=0.5, text/markdown;q=1').dest, '/home.md');
  });

  it('negotiates pages that have a mirror, with or without a trailing slash', () => {
    assert.equal(route(routes, '/about', MD).dest, '/about.md');
    assert.equal(route(routes, '/talks/', MD).dest, '/talks.md');
    assert.equal(route(routes, '/talks/a-b.c', MD).dest, '/talks/a-b.c.md');
    assert.equal(route(routes, '/about', HTML).dest, '/about');
    assert.equal(route(routes, '/about', HTML).headers.Vary, 'Accept');
  });

  it('escapes regex characters in page paths', () => {
    assert.notEqual(route(routes, '/talks/aXb.c', MD).dest, '/talks/aXb.c.md');
  });

  it('answers unknown multi-segment paths with a Markdown 404', () => {
    const r = route(routes, '/nope/deeper', MD);
    assert.deepEqual([r.dest, r.status], ['/404.md', 404]);
    assert.equal(r.headers['Content-Type'], 'text/markdown; charset=utf-8');
  });

  it('answers the short-path miss target /404 with a Markdown 404', () => {
    const r = route(routes, '/404', MD);
    assert.deepEqual([r.dest, r.status], ['/404.md', 404]);
  });

  it('serves /404.md as a 404, never a 200', () => {
    assert.equal(route(routes, '/404.md', HTML).status, 404);
  });

  it('leaves HTML 404s, redirects, assets and API routes alone', () => {
    assert.deepEqual([route(routes, '/nope/deeper', HTML).dest, route(routes, '/nope/deeper', HTML).status], ['/404.html', 404]);
    assert.equal(route(routes, '/consulting', MD).status, 301);
    assert.equal(route(routes, '/llms.txt', MD).dest, '/llms.txt');
    assert.equal(route(routes, '/api/contact', MD).dest, '_render');
  });

  it('is idempotent', () => {
    assert.deepEqual(withMarkdownNegotiation(routes, ['about']), routes);
  });

  it('fails loudly if the adapter output changes shape', () => {
    assert.throws(() => withMarkdownNegotiation([{ src: '^/.*$', dest: '/404.html', status: 404 }], []), /filesystem/);
    assert.throws(() => withMarkdownNegotiation([{ handle: 'filesystem' }], []), /catch-all/);
  });
});
