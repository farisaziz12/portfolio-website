import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, mkdtemp, readFile, readdir, realpath, lstat, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { validateName } from './contracts.ts'

export const root = fileURLToPath(new URL('../../', import.meta.url))
const templates = fileURLToPath(new URL('./templates/', import.meta.url))

async function physicalDirectory(directory) {
  const info = await lstat(directory)
  if (!info.isDirectory() || info.isSymbolicLink()) throw new Error(`Expected a real directory, not a symlink: ${directory}`)
  return realpath(directory)
}

export async function deckPath(workspace, name, creating = false) {
  validateName(name)
  const base = await physicalDirectory(path.join(workspace, 'decks'))
  const directory = path.join(base, name)
  if (creating) return directory
  await physicalDirectory(directory)
  const entry = path.join(directory, 'slides.md')
  if (!(await lstat(entry)).isFile() || await realpath(entry) !== entry)
    throw new Error('slides.md must be a regular local file, not a symlink.')
  return entry
}

export async function newDeck(workspace, name) {
  const destination = await deckPath(workspace, name, true)
  // An exclusive mkdir is the no-overwrite gate, even for an empty deck.
  await mkdir(destination)
  const title = name.split('-').join(' ')
  for (const file of await readdir(templates)) {
    const source = await readFile(path.join(templates, file), 'utf8')
    await writeFile(path.join(destination, file), source.replaceAll('{{name}}', name).replaceAll('{{title}}', title), { flag: 'wx' })
  }
  return destination
}

export async function artifactDirectory(workspace, name) {
  validateName(name)
  // Refuse symlinks in every output ancestor; never write through an escaped path.
  let directory = await realpath(workspace)
  for (const segment of ['artifacts', 'reviews', name]) {
    directory = path.join(directory, segment)
    await mkdir(directory).catch(error => { if (error.code !== 'EEXIST') throw error })
    await physicalDirectory(directory)
  }
  return mkdtemp(path.join(directory, `${new Date().toISOString().replaceAll(':', '-')}-`))
}

export async function sourceHash(entry) {
  return createHash('sha256').update(await readFile(entry)).digest('hex')
}

export async function saveReport(directory, report) {
  await writeFile(path.join(directory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  const failures = report.states?.filter(state => state.failures.length) ?? []
  const lines = [
    `# ${report.deck}: ${report.action}`, '',
    `Automated status: ${report.status}. Human visual/editorial approval: pending.`, '',
    `Source slides.md SHA-256: ${report.sourceSha256 ?? 'unavailable'}`, '',
    ...failures.map(state => `- Slide ${state.slide}, click ${state.click}: ${state.failures.join('; ')}`),
    ...(report.failure ? [`- ${report.failure}`] : []), '',
    'Inspect every screenshot (or render every exported PDF page) before recording visual approval in the deck review.md.',
    'Machine checks do not establish factual accuracy, voice, composition quality, or presenter readiness.', '',
    `Known upstream warnings: ${report.knownWarnings?.length ?? 0}. See report.json for details.`, '',
  ]
  await writeFile(path.join(directory, 'review.md'), lines.join('\n'))
}
