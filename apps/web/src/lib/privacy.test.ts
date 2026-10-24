import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { PRIVACY_LEDE, PRIVACY_UPDATED, privacySections } from './privacy';

const sections = privacySections('two working days');
const text = [PRIVACY_LEDE, ...sections.flatMap((s) => [s.heading, ...s.body])].join('\n');

describe('privacy copy', () => {
  it('is a real page, not a stub', () => {
    assert.ok(text.length >= 500, `only ${text.length} characters`);
    assert.ok(sections.every((s) => s.body.length > 0));
  });

  it('has unique section ids and a valid updated date', () => {
    assert.equal(new Set(sections.map((s) => s.id)).size, sections.length);
    assert.match(PRIVACY_UPDATED, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(PRIVACY_UPDATED)));
  });

  it('uses the reply time it is given', () => {
    assert.match(text, /within two working days/);
  });

  it('names every page where session recording starts (posthog.astro)', () => {
    const posthog = readFileSync(new URL('../components/posthog.astro', import.meta.url), 'utf8');
    const list = /RECORD_PATHS = \[([^\]]+)\]/.exec(posthog)?.[1];
    assert.ok(list, 'RECORD_PATHS not found in posthog.astro');
    const paths = [...list.matchAll(/'([^']+)'/g)].map((m) => m[1]);
    const recordings = sections.find((s) => s.id === 'recordings')!.body.join(' ');
    for (const p of paths) assert.ok(recordings.includes(p), `${p} missing from the recordings section`);
  });

  it('matches the analytics setup it describes', () => {
    const posthog = readFileSync(new URL('../components/posthog.astro', import.meta.url), 'utf8');
    assert.match(posthog, /maskAllInputs: true/);
    assert.match(posthog, /eu\.i\.posthog\.com/);
  });
});
