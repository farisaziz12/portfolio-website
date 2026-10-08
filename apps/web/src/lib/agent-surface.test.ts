/**
 * The machine-readable files agents read: llms.txt guidance, the Markdown 404
 * body and the privacy mirror. Runs against the offline fixture dataset.
 */
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { describe, it } from 'node:test';
import type { APIContext } from 'astro';

process.env.SANITY_FIXTURES = '1';
const ctx = {} as APIContext;
const text = async (mod: { GET: (c: APIContext) => Response | Promise<Response> }) => {
  const res = await mod.GET(ctx);
  return { res, body: await res.text() };
};

describe('llms.txt', async () => {
  const { res, body } = await text(await import('../pages/llms.txt'));

  it('follows llmstxt.org: one H1, a blockquote summary, then H2 sections', () => {
    assert.match(res.headers.get('Content-Type') ?? '', /^text\/plain/);
    assert.equal(body.match(/^# /gm)?.length, 1);
    assert.match(body.split('\n').filter(Boolean)[1], /^> /);
  });

  it('has a when-to-use section whose items are links with notes', () => {
    const section = /^## When to use this site\n\n((?:- .+\n)+)/m.exec(body)?.[1];
    assert.ok(section, 'no "When to use this site" section');
    const items = section.trim().split('\n');
    assert.ok(items.length >= 5);
    for (const item of items) assert.match(item, /^- \[[^\]]+\]\(https:\/\/faziz-dev\.com\/[^)]+\.md\): use (when|for) /);
  });

  it('says how to fetch Markdown and how to get in touch', () => {
    assert.match(body, /Accept: text\/markdown/);
    assert.match(body, /\/invite/);
    assert.match(body, /\/contact/);
    assert.match(body, /faris@zurichjs\.com/);
    assert.doesNotMatch(body, /no public email/i);
  });

  it('links only to .md mirrors that exist', () => {
    const links = [...body.matchAll(/\(https:\/\/faziz-dev\.com\/([a-z-]+)\.md\)/g)].map((m) => m[1]);
    assert.ok(links.includes('privacy'));
    for (const page of new Set(links)) {
      assert.ok(existsSync(new URL(`../pages/${page}.md.ts`, import.meta.url)), `${page}.md.ts is missing`);
    }
  });
});

describe('404.md', () => {
  it('explains the error in Markdown and points at llms.txt and the sitemap', async () => {
    const { res, body } = await text(await import('../pages/404.md'));
    assert.equal(res.headers.get('Content-Type'), 'text/markdown; charset=utf-8');
    assert.match(body, /^# 404/);
    assert.ok(body.length >= 20);
    assert.match(body, /https:\/\/faziz-dev\.com\/llms\.txt/);
    assert.match(body, /https:\/\/faziz-dev\.com\/sitemap-index\.xml/);
  });
});

describe('privacy.md', () => {
  it('mirrors the privacy page with at least 500 characters', async () => {
    const { res, body } = await text(await import('../pages/privacy.md'));
    assert.equal(res.headers.get('Content-Type'), 'text/markdown; charset=utf-8');
    assert.match(body, /^# Privacy/);
    assert.ok(body.length >= 500);
    assert.match(body, /## Session recordings/);
  });
});
