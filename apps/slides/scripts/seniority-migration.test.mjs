import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const slidevRequire = createRequire(require.resolve('@slidev/cli/bin/slidev.mjs'))
const { parse } = await import(slidevRequire.resolve('@slidev/parser'))
const deck = new URL('../decks/reverse-engineering-seniority/', import.meta.url)
const markdown = await readFile(new URL('slides.md', deck), 'utf8')
const { slides } = await parse(markdown)
const source = JSON.parse(await readFile(new URL('migration/source.json', deck), 'utf8'))

// Wording fixed on purpose during migration (see sources.md). Everything else must match the PDF.
const EDITS = new Map([
  [20, [['Decision', 'Decisions']]],
  [35, [['Good at', 'Good At']]],
  [36, [['Good at', 'Good At']]],
  [49, [['System(S)', 'System(s)']]], [50, [['System(S)', 'System(s)']]], [51, [['System(S)', 'System(s)']]],
  // pdftotext splits the "fl" ligature on this page out of "Influence".
  [52, [['System(S)', 'System(s)'], ['Axes fl fl', 'Axes'], ['In uence', 'Influence']]],
  [57, [['Work Work', 'Work']]],
  [71, [['as Intention', 'as the Intention']]],
  [85, [['Dependancies', 'Dependencies']]],
])
const words = text => text
  .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<\/?(?:strong|em)>/g, '').replace(/<[^>]+>/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/[*“”"]/g, '').replace(/#/g, ' ').replace(/^- /gm, ' ').replace(/::\w+::/g, ' ')
  .toLowerCase().replace(/[^a-z0-9’'!?=:/.,]+/g, ' ').replace(/\s+/g, ' ').trim()
const normalise = text => words(text.replace(/\(s\)/gi, '(s)')).replace(/ - /g, ' ').replace(/[·]/g, ' ')

test('seniority: all 98 PDF slides keep one-to-one source identity', () => {
  assert.equal(source.pages, 98)
  assert.equal(slides.length, 98)
  slides.forEach((slide, index) => assert.equal(slide.frontmatter.sourceSlide, index + 1, `slide ${index + 1}`))
})

test('seniority: on-slide wording matches the PDF apart from recorded edits', () => {
  for (const { number, text } of source.slides) {
    if (!text || [1, 43, 98].includes(number)) continue // cover, redacted excerpt and closing are composed differently
    const expected = (EDITS.get(number) ?? []).reduce((value, [from, to]) => value.replaceAll(from, to), text)
    assert.equal(normalise(slides[number - 1].content), normalise(expected), `slide ${number}`)
  }
})

test('seniority: every referenced image exists and matches its recorded hash', async () => {
  const referenced = new Set([...markdown.matchAll(/\/media\/([\w.-]+)/g)].map(match => match[1]))
  const files = new Set(await readdir(new URL('public/media/', deck)))
  for (const name of referenced) assert.ok(files.has(name), `missing ${name}`)
  for (const asset of source.assets) {
    const data = await readFile(new URL(asset.output, deck))
    assert.equal(createHash('sha256').update(data).digest('hex'), asset.outputSha256, asset.output)
  }
  assert.deepEqual([...files].filter(name => !referenced.has(name)), [], 'unreferenced media')
})

test('seniority: private screenshots stay redacted and the third-party name stays out', () => {
  for (const name of ['bootcamp-admission-email.jpg', 'speaking-topics-email.jpg']) {
    assert.match(source.assets.find(asset => asset.output.endsWith(name)).conversion, /black box|blurred/)
  }
  assert.doesNotMatch(markdown, /Matteo|pittman/i)
  assert.match(slides[42].content, /seniority-redacted/)
})
