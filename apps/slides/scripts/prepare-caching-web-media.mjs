// Web-sized copies for hosting. Run after prepare-caching-media/images; the
// extracted originals move to media/source-* (never published) and keep the
// hashes recorded in migration/media.json and migration/source.json.
// Requires ffmpeg (brew install ffmpeg) and macOS sips.
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { access, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const deck = path.join(root, 'decks/caching-dark-arts')
const hash = async file => createHash('sha256').update(await readFile(file)).digest('hex')
const exists = file => access(file).then(() => true, () => false)

// 1080p H.264, no audio (slides play muted), moov atom first for streaming.
const video = ['-vf', 'scale=1920:-2:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
  '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-an']
const jobs = [
  ...['demo-1', 'demo-2', 'demo-3'].map(name => ({ kind: 'video', archive: `media/source-video/caching-dark-arts/${name}.mp4`, from: `public/media/${name}.mp4`, to: `public/media/${name}.mp4` })),
  // Photos only: PNG screenshots and diagrams stay lossless and untouched.
  ...['in-flight-demo', 'flight-map', 'speaker-montage'].map(name => ({ kind: 'photo', archive: `media/source-images/caching-dark-arts/${name}.png`, from: `public/media/${name}.png`, to: `public/media/${name}.jpg` })),
]

const outputs = []
for (const job of jobs) {
  const archive = path.join(root, job.archive)
  const original = path.join(deck, job.from)
  const output = path.join(deck, job.to)
  await mkdir(path.dirname(archive), { recursive: true })
  if (!(await exists(archive))) {
    if (!(await exists(original))) throw new Error(`Missing original for ${job.to}`)
    await rename(original, archive)
  }
  else if (job.from !== job.to) await rm(original, { force: true })
  if (job.kind === 'video') execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', archive, ...video, output])
  else execFileSync('sips', ['-Z', '2400', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', archive, '--out', output], { stdio: 'ignore' })
  outputs.push({ original: job.archive, originalSha256: await hash(archive), path: job.to, sha256: await hash(output), bytes: (await readFile(output)).length })
}
await writeFile(path.join(deck, 'migration/web-media.json'), JSON.stringify({ video: video.join(' '), photo: 'sips -Z 2400 jpeg quality 82', outputs }, null, 2) + '\n')
console.log(`Prepared ${outputs.length} web copies; originals kept outside public/.`)
