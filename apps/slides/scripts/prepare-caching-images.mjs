// Copy selected individual PDF image objects, never whole-slide renders.
// Web hosting copies come from scripts/prepare-caching-web-media.mjs afterwards.
// Run extract-caching-source.py first. No resizing, cropping or generated art.
import { readFile, writeFile, copyFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const root = new URL('../', import.meta.url)
const sourceRoot = new URL('artifacts/source/caching-dark-arts/', root)
const deck = new URL('decks/caching-dark-arts/', root)
const inventory = JSON.parse(await readFile(new URL('source.json', sourceRoot)))
const selection = [
  [2, 25, 'speaker-montage.png'], [4, 48, 'traffic.png'],
  [58, 281, 'congestion-14kb.png'], [59, 286, 'congestion-15kb.png'],
  [98, 453, 'tanstack-query.png'], [99, 458, 'tanstack-features.png'],
  [116, 534, 'in-flight-demo.png'], [117, 539, 'flight-map.png'],
  [118, 544, 'flight-speedtest.png'], [125, 574, 'contact-qr.png'],
]
const assets = []
for (const [page, object, filename] of selection) {
  const image = inventory.pages[page - 1].images.find(image => image.object === object)
  if (!image) throw new Error(`Missing source object ${object}`)
  const output = new URL(`public/media/${filename}`, deck)
  await copyFile(new URL(image.file, sourceRoot), output)
  const bytes = await readFile(output)
  assets.push({ sourceSlide: page, object, path: `public/media/${filename}`,
    sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
    preparation: 'PDF image object decoded to PNG including alpha; no resize/crop',
  })
}
await writeFile(new URL('migration/source.json', deck), JSON.stringify({ ...inventory, assets }, null, 2) + '\n')
console.log(`Prepared ${assets.length} individual source images; 125 source text records.`)
