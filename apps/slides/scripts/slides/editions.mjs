// Read and edit deck editions. An edition is decks/<talk>/slides.<edition>.md:
// its own slides plus `src: ./slides.md#<range>` imports of the main deck.
// Every edit re-resolves the deck afterwards and rolls back if any slide other
// than the intended one changed, so a bad splice can never land silently.
import path from 'node:path'
import { createRequire } from 'node:module'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { validateName } from './contracts.ts'
import { slidevCli } from './slidev.mjs'

const cliRequire = createRequire(slidevCli)
let parserModules
async function parser() {
  parserModules ??= await Promise.all([
    import(cliRequire.resolve('@slidev/parser')),
    import(cliRequire.resolve('@slidev/parser/fs')),
    import(cliRequire.resolve('@slidev/parser/core')),
  ]).then(([{ parse }, { load }, { parseRangeString }]) => ({ parse, load, parseRangeString }))
  return parserModules
}

const MAIN = 'slides.md'
const editionFile = edition => `slides.${edition}.md`
const counts = block => !block.frontmatter.hide && !block.frontmatter.disabled

export function slideTitle(slide) {
  // Layout slots (::title::) hide the heading from Slidev's title detection.
  const heading = /^#{1,3}\s+(.+)$/m.exec(slide.source?.content ?? slide.content ?? '')?.[1]
  const text = String(slide.title ?? slide.frontmatter?.title ?? heading ?? '')
    .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim()
  return text || `(no heading, ${slide.frontmatter?.layout ?? 'default'} layout)`
}

/** Every deck folder with its editions and publish record. */
export async function listDecks(workspace) {
  const decks = []
  for (const item of await readdir(path.join(workspace, 'decks'), { withFileTypes: true })) {
    if (!item.isDirectory()) continue
    const directory = path.join(workspace, 'decks', item.name)
    const files = await readdir(directory)
    if (!files.includes(MAIN)) continue
    const editions = files.map(file => /^slides\.([a-z0-9-]+)\.md$/.exec(file)?.[1]).filter(Boolean).sort()
    decks.push({ name: item.name, directory, editions, published: await readPublished(directory) })
  }
  return decks.sort((a, b) => a.name.localeCompare(b.name))
}

export async function readPublished(directory) {
  try { return JSON.parse(await readFile(path.join(directory, 'published.json'), 'utf8')) }
  catch (error) { if (error.code === 'ENOENT') return {}; throw error }
}

/** Remember which entry each site URL was published from. */
export async function recordPublish(directory, slug, edition, date = new Date()) {
  const published = await readPublished(directory)
  published[slug] = { entry: edition ? editionFile(edition) : MAIN, publishedAt: date.toISOString().slice(0, 10) }
  const sorted = Object.fromEntries(Object.entries(published).sort(([a], [b]) => a.localeCompare(b)))
  await writeFile(path.join(directory, 'published.json'), `${JSON.stringify(sorted, null, 2)}\n`)
}

/** The rendered deck: one row per slide, marking slides that live in the edition file. */
export async function slideMap(entry) {
  const { load } = await parser()
  const data = await load(path.dirname(entry), entry)
  if (data.entry.errors?.length) throw new Error(`${path.basename(entry)}: ${data.entry.errors.map(error => error.message).join('; ')}`)
  return data.slides.map((slide, index) => ({
    number: index + 1,
    title: slideTitle(slide),
    local: path.resolve(slide.source.filepath) === path.resolve(entry),
    line: slide.source.start + 1,
    frontmatter: slide.frontmatter,
  }))
}

// Comparable form of a resolved slide: what Slidev renders and the speaker notes.
async function resolved(entry) {
  const { load } = await parser()
  const data = await load(path.dirname(entry), entry)
  if (data.entry.errors?.length) throw new Error(data.entry.errors.map(error => error.message).join('; '))
  return data.slides.map(slide => JSON.stringify({ frontmatter: slide.frontmatter, content: slide.source.content.trim(), note: slide.source.note?.trim() ?? '' }))
}

export function compressRange(indexes, total) {
  const parts = []
  for (let i = 0; i < indexes.length;) {
    let j = i
    while (j + 1 < indexes.length && indexes[j + 1] === indexes[j] + 1) j++
    const [from, to] = [indexes[i], indexes[j]]
    parts.push(from === to && to !== total ? `${from}` : to === total ? `${from}-` : `${from}-${to}`)
    i = j + 1
  }
  return parts.join(',')
}

const importBlock = (indexes, total) => indexes.length ? `---\nsrc: ./${MAIN}#${compressRange(indexes, total)}\n---\n` : ''
const asBlock = raw => raw.startsWith('---') ? raw : `---\n${raw}`

// Map an edition file to blocks, each with the rendered slide numbers it yields.
async function editionLayout(entry) {
  if (path.basename(entry) === MAIN) throw new Error('This is the main deck, not an edition. Edit slides.md directly.')
  const { parse, parseRangeString } = await parser()
  const directory = path.dirname(entry)
  const text = await readFile(entry, 'utf8')
  const edition = await parse(text, entry)
  const base = await parse(await readFile(path.join(directory, MAIN), 'utf8'), path.join(directory, MAIN))
  if (base.slides.some(block => block.frontmatter.src)) throw new Error('slides.md imports other files; editions only support a self-contained main deck.')
  let next = 1
  const blocks = edition.slides.map((block, index) => {
    // A slide without frontmatter starts after its `---` separator line.
    const from = block.raw.startsWith('---') || index === 0 ? block.start : block.start - 1
    const result = { index, from, to: block.end, raw: block.raw, frontmatter: block.frontmatter, numbers: [] }
    const src = block.frontmatter.src
    if (src) {
      const [file, range] = String(src).split('#')
      if (path.resolve(directory, file) !== path.resolve(directory, MAIN))
        throw new Error(`Slide import "${src}" points at another edition. Editions can only import from slides.md; copy the slides you need instead.`)
      if (Object.keys(block.frontmatter).some(key => key !== 'src'))
        throw new Error(`The import "${src}" also sets frontmatter. Split it by hand.`)
      result.imports = parseRangeString(base.slides.length, range)
      for (const number of result.imports) if (counts(base.slides[number - 1])) result.numbers.push(next++)
    }
    else if (counts(block)) result.numbers.push(next++)
    return result
  })
  return { text, blocks, base: base.slides }
}

function locate(layout, number) {
  const block = layout.blocks.find(candidate => candidate.numbers.includes(number))
  if (!block) throw new Error(`Slide ${number} does not exist. This edition has ${layout.blocks.reduce((sum, b) => sum + b.numbers.length, 0)} slides.`)
  return block
}

// Replace one block with new blocks, then prove only the expected slides changed.
async function splice(entry, layout, block, pieces, expect) {
  const lines = layout.text.split('\n')
  // A block's line range always ends on the blank line before the next `---`,
  // and each normalized piece ends the same way, so pieces tile like blocks.
  const replacement = pieces.filter(Boolean).flatMap(piece => piece.replace(/\n*$/, '\n').split('\n'))
  const output = [...lines.slice(0, block.from), ...replacement, ...lines.slice(block.to)]
  const before = await resolved(entry)
  await writeFile(entry, output.join('\n'))
  try {
    const after = await resolved(entry)
    const problem = expect(before, after)
    if (problem) throw new Error(problem)
  }
  catch (error) {
    await writeFile(entry, layout.text)
    throw new Error(`Edit rolled back, the edition is unchanged: ${error.message}`)
  }
}

// Turn an imported slide into an editable copy in the edition file.
export async function customizeSlide(entry, number) {
  const layout = await editionLayout(entry)
  const block = locate(layout, number)
  if (!block.imports) return { changed: false, line: block.from + 1 }
  const position = block.numbers.indexOf(number)
  const importIndex = block.imports.filter(i => counts(layout.base[i - 1]))[position]
  const at = block.imports.indexOf(importIndex)
  const total = layout.base.length
  await splice(entry, layout, block, [
    importBlock(block.imports.slice(0, at), total),
    asBlock(layout.base[importIndex - 1].raw),
    importBlock(block.imports.slice(at + 1), total),
  ], (before, after) => after.length !== before.length || after.some((slide, i) => slide !== before[i]) ? 'the rendered deck changed' : '')
  return { changed: true, line: (await slideMap(entry))[number - 1].line }
}

export function newSlideTemplate(previous) {
  const mode = previous?.frontmatter?.faris?.mode
  return `---\nlayout: statement\n${mode ? `faris:\n  mode: ${mode}\n` : ''}---\n\n# New Slide\n\n<!--\nSpeaker notes.\n-->\n`
}

// Insert a placeholder slide right after slide `after` (1 = after the cover).
export async function insertSlide(entry, after) {
  const layout = await editionLayout(entry)
  const block = locate(layout, after)
  const map = await slideMap(entry)
  const fresh = newSlideTemplate(map[after - 1])
  const total = layout.base.length
  let pieces
  if (!block.imports) pieces = [asBlock(block.raw), fresh]
  else {
    const visible = block.imports.filter(i => counts(layout.base[i - 1]))
    const at = block.imports.indexOf(visible[block.numbers.indexOf(after)])
    pieces = [importBlock(block.imports.slice(0, at + 1), total), fresh, importBlock(block.imports.slice(at + 1), total)]
  }
  await splice(entry, layout, block, pieces, (before, now) =>
    now.length !== before.length + 1 || now.some((slide, i) => i !== after && slide !== before[i < after ? i : i - 1]) ? 'more than one slide changed' : '')
  return { line: (await slideMap(entry))[after].line }
}

// Drop a slide from this edition only. The cover holds the deck settings, so it stays.
export async function removeSlide(entry, number) {
  if (number === 1) throw new Error('Slide 1 holds the deck settings (theme, title). Change it instead of removing it.')
  const layout = await editionLayout(entry)
  const block = locate(layout, number)
  const total = layout.base.length
  let pieces = []
  if (block.imports) {
    const visible = block.imports.filter(i => counts(layout.base[i - 1]))
    const at = block.imports.indexOf(visible[block.numbers.indexOf(number)])
    pieces = [importBlock(block.imports.slice(0, at), total), importBlock(block.imports.slice(at + 1), total)]
  }
  await splice(entry, layout, block, pieces, (before, now) =>
    now.length !== before.length - 1 || now.some((slide, i) => slide !== before[i < number - 1 ? i : i + 1]) ? 'more than one slide changed' : '')
}

/** New edition from the main deck (cover copy + everything else imported) or a copy of another edition. */
export async function createEdition(directory, edition, { from, event, slug } = {}) {
  validateName(edition)
  if (edition === 'md') throw new Error('Choose another edition name.')
  const target = path.join(directory, editionFile(edition))
  const header = [
    `# Edition: ${event || edition}${slug ? `, published at /slides/${slug}/` : ''}.`,
    '# Slides defined in this file are edition-specific; the src imports pull the',
    '# rest from slides.md. Manage it with `pnpm slides` (interactive).',
  ].join('\n')
  let text
  if (from) {
    text = await readFile(path.join(directory, editionFile(validateName(from))), 'utf8')
    text = text.replace(/^---\n(?:#[^\n]*\n)*/, `---\n${header}\n`)
  }
  else {
    const { parse } = await parser()
    const base = await parse(await readFile(path.join(directory, MAIN), 'utf8'))
    if (base.slides.length < 2) throw new Error('The main deck needs at least two slides before it can have editions.')
    if (!base.slides[0].raw.startsWith('---\n')) throw new Error('The main deck must start with frontmatter (theme, title).')
    text = `---\n${header}\n${base.slides[0].raw.replace(/^---\n/, '').replace(/\n*$/, '\n')}\n${importBlock(base.slides.slice(1).map((_, i) => i + 2), base.slides.length)}`
  }
  await writeFile(target, text, { flag: 'wx' })
  return target
}
