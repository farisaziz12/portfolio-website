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

// An edition is a sibling entry, slides.<edition>.md, that imports most slides
// from slides.md with `src:` and overrides the rest. Living in the same folder
// means it shares components, layouts, styles and public media.
export async function deckPath(workspace, name, creating = false, edition) {
  validateName(name)
  if (edition !== undefined) validateName(edition)
  const base = await physicalDirectory(path.join(workspace, 'decks'))
  const directory = path.join(base, name)
  if (creating) return directory
  await physicalDirectory(directory)
  const entry = path.join(directory, edition ? `slides.${edition}.md` : 'slides.md')
  if (!(await lstat(entry)).isFile() || await realpath(entry) !== entry)
    throw new Error('slides.md must be a regular local file, not a symlink.')
  return entry
}

export async function newDeck(workspace, name, title = name.split('-').join(' ')) {
  const destination = await deckPath(workspace, name, true)
  // An exclusive mkdir is the no-overwrite gate, even for an empty deck.
  await mkdir(destination)
  for (const file of await readdir(templates)) {
    const source = await readFile(path.join(templates, file), 'utf8')
    // Quote the YAML value so titles with colons stay valid frontmatter.
    const filled = source.replaceAll('title: {{title}}', `title: ${JSON.stringify(title)}`).replaceAll('{{name}}', name).replaceAll('{{title}}', title)
    await writeFile(path.join(destination, file), filled, { flag: 'wx' })
  }
  return destination
}

export async function artifactDirectory(workspace, name, edition) {
  validateName(name)
  if (edition !== undefined) validateName(edition)
  // Refuse symlinks in every output ancestor; never write through an escaped path.
  let directory = await realpath(workspace)
  for (const segment of ['artifacts', 'reviews', name, ...(edition ? [edition] : [])]) {
    directory = path.join(directory, segment)
    await mkdir(directory).catch(error => { if (error.code !== 'EEXIST') throw error })
    await physicalDirectory(directory)
  }
  return mkdtemp(path.join(directory, `${new Date().toISOString().replaceAll(':', '-')}-`))
}

// Editions import slides from their siblings, so hash every deck entry.
export async function sourceHash(entry) {
  const directory = path.dirname(entry)
  const hash = createHash('sha256')
  const files = (await readdir(directory)).filter(file => /^slides(?:\.[a-z0-9-]+)?\.md$/.test(file)).sort()
  for (const file of files) hash.update(`${file}\0`).update(await readFile(path.join(directory, file))).update('\0')
  return hash.digest('hex')
}

export async function saveReport(directory, report) {
  await writeFile(path.join(directory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  const failures = report.states?.filter(state => state.failures.length) ?? []
  const lines = [
    `# ${report.deck}${report.edition ? ` (${report.edition} edition)` : ''}: ${report.action}`, '',
    `Automated status: ${report.status}. Human visual/editorial approval: pending.`, '',
    `Source deck markdown SHA-256: ${report.sourceSha256 ?? 'unavailable'}`, '',
    ...failures.map(state => `- Slide ${state.slide}, click ${state.click}: ${state.failures.join('; ')}`),
    ...(report.failure ? [`- ${report.failure}`] : []), '',
    'Inspect every screenshot (or render every exported PDF page) before recording visual approval in the deck review.md.',
    'Machine checks do not establish factual accuracy, voice, composition quality, or presenter readiness.', '',
    `Known upstream warnings: ${report.knownWarnings?.length ?? 0}. See report.json for details.`, '',
  ]
  await writeFile(path.join(directory, 'review.md'), lines.join('\n'))
}
