// Pixel-level audit, separate from the no-extra-dependencies registry tests.
// Like preparation, this offline asset-only check resolves pngjs via NODE_PATH.
import { createRequire } from 'node:module'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const { PNG } = createRequire(import.meta.url)('pngjs')
const directory = 'packages/slidev-theme-faris/assets/illustrations'
const manifest = JSON.parse(await readFile(`${directory}/manifest.json`, 'utf8'))
const results = []
for (const sprite of manifest.sprites) {
  const source = PNG.sync.read(await readFile(sprite.source))
  const output = PNG.sync.read(await readFile(`${directory}/${sprite.file}`))
  let verifiedPixels = 0
  let logoChangedPixels = 0
  for (let y = 0; y < output.height; y++) {
    for (let x = 0; x < output.width; x++) {
      const i = (y * output.width + x) * 4
      const j = (y * source.width + (sprite.mirrored ? source.width - 1 - x : x)) * 4
      const expected = source.data[j + 3] < 16 ? [0, 0, 0, 0] : source.data.subarray(j, j + 4)
      const changed = expected.some((value, channel) => value !== output.data[i + channel])
      const mark = sprite.bakedLogo
      const inMark = mark && x >= mark.x && x < mark.x + mark.size && y >= mark.y && y < mark.y + mark.size
      if (inMark) { if (changed) logoChangedPixels++ }
      else { assert.equal(changed, false, `${sprite.id}: unexpected change at ${x},${y}`); verifiedPixels++ }
      assert.ok(output.data[i + 3] === 0 || output.data[i + 3] >= 16, 'No residual low-alpha flecks')
    }
  }
  if (sprite.bakedLogo) assert.ok(logoChangedPixels > 1000, `${sprite.id}: missing baked logo`)
  results.push({ id: sprite.id, verifiedPixels, logoChangedPixels, status: 'passed' })
}
await mkdir('artifacts/sprites-final', { recursive: true })
await writeFile('artifacts/sprites-final/pixel-audit.json', `${JSON.stringify(results, null, 2)}\n`)
console.log(JSON.stringify(results, null, 2))
