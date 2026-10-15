import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolveIllustration } from '../packages/slidev-theme-faris/lib/illustrations.ts'

const directory = new URL('../packages/slidev-theme-faris/assets/illustrations/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('manifest.json', directory), 'utf8'))

for (const sprite of manifest.sprites) {
  test(`${sprite.id}: registry resolves the exact prepared RGBA asset`, async () => {
    const illustration = resolveIllustration(sprite.id)
    assert.ok(illustration.alt.length > 0)
    const bytes = await readFile(new URL(illustration.src))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), sprite.sha256)
    assert.equal(bytes.readUInt32BE(16), illustration.width)
    assert.equal(bytes.readUInt32BE(20), illustration.height)
    assert.equal(bytes[25], 6, 'PNG uses RGBA color type')
    assert.equal(sprite.width, illustration.width)
    assert.equal(sprite.height, illustration.height)
    if (sprite.id.startsWith('faris-')) assert.ok(sprite.bakedLogo)
  })
}

test('missing and inherited names cannot resolve as illustrations', () => {
  for (const name of ['', 'missing', 'constructor', '__proto__', 'toString'])
    assert.equal(resolveIllustration(name), undefined)
})
