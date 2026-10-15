// One-deck extraction, not a generic Keynote converter. Originals stay untouched.
// Web hosting copies come from scripts/prepare-caching-web-media.mjs afterwards.
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = '/Users/farisaziz/Library/Mobile Documents/com~apple~Keynote/Documents/caching-payloads-and-other-dark-arts short.key'
const deck = path.join(root, 'decks/caching-dark-arts')
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const entries = [
  ['Data/demo1-9822.mp4', 'demo-1.mp4', 50],
  ['Data/demo2-9886.mp4', 'demo-2.mp4', 82],
  ['Data/demo-3-4-9901.mp4', 'demo-3.mp4', 114],
]
await mkdir(path.join(deck, 'public/media'), { recursive: true })
await mkdir(path.join(deck, 'migration'), { recursive: true })
const videos = []
for (const [entry, name, sourceSlide] of entries) {
  const bytes = execFileSync('unzip', ['-p', source, entry], { maxBuffer: 250 * 1024 * 1024 })
  const destination = path.join(deck, 'public/media', name)
  try { await writeFile(destination, bytes, { flag: 'wx' }) }
  catch (error) {
    if (error.code !== 'EEXIST') throw error
    if (hash(await readFile(destination)) !== hash(bytes)) throw new Error(`Refusing to replace modified ${name}`)
  }
  videos.push({ archiveEntry: entry, path: `public/media/${name}`, sourceSlide, bytes: bytes.length, sha256: hash(bytes) })
}
await writeFile(path.join(deck, 'migration/media.json'), JSON.stringify({ source, sourceSha256: hash(await readFile(source)), videos }, null, 2) + '\n')
console.log(`Prepared ${videos.length} byte-identical recordings; originals unchanged.`)
