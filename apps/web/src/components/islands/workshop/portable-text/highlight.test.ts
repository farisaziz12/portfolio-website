import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { grammarFor, highlight } from './highlight';

describe('grammarFor', () => {
  it('maps @sanity/code-input values and common spellings to a bundled grammar', () => {
    assert.equal(grammarFor('typescript'), 'typescript');
    assert.equal(grammarFor('TSX'), 'tsx');
    assert.equal(grammarFor('sh'), 'shellscript');
    assert.equal(grammarFor('batchfile'), 'bat');
    assert.equal(grammarFor('mysql'), 'sql');
    assert.equal(grammarFor(' js '), 'javascript');
  });

  it('falls back to plain text for unknown or missing languages', () => {
    assert.equal(grammarFor('groq'), null);
    assert.equal(grammarFor('cobol'), null);
    assert.equal(grammarFor('ruby'), null);
    assert.equal(grammarFor(''), null);
    assert.equal(grammarFor(undefined), null);
  });
});

describe('highlight', () => {
  it('highlights a known language with the github-dark theme', async () => {
    const html = await highlight('const n: number = 1;', 'ts');
    assert.match(html, /^<pre class="shiki github-dark"/);
    assert.match(html, /<span style="color:#[0-9A-F]{6}">const<\/span>/i);
  });

  it('renders unknown languages as escaped plain text instead of throwing', async () => {
    const html = await highlight('*[_type == "post"] <b>', 'groq');
    assert.match(html, /^<pre class="shiki github-dark"/);
    assert.match(html, /&#x3C;b>|&lt;b&gt;/);
  });
});
