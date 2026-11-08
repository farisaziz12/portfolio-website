import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { compressRange, createEdition, customizeSlide, insertSlide, removeSlide, slideMap, listDecks, recordPublish } from './slides/editions.mjs'

const MAIN = `---
theme: faris
title: Main Talk
faris:
  mode: dark
---

# Main Talk

---
layout: content
---

# Who Am I

<!--
Bio notes.
-->

---

# No Frontmatter Slide

---
layout: statement
hide: true
---

# Hidden Slide

---
layout: statement
faris:
  mode: dark
---

# Fourth Visible

---
layout: statement
---

# Last Slide
`

async function deck(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'faris-editions-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const directory = path.join(root, 'decks', 'talk')
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'slides.md'), MAIN)
  return { root, directory }
}

const titles = async entry => (await slideMap(entry)).map(slide => slide.title)

test('ranges compress, and runs that reach the end stay open', () => {
  assert.equal(compressRange([2, 3, 4], 9), '2-4')
  assert.equal(compressRange([2, 3, 4, 7], 9), '2-4,7')
  assert.equal(compressRange([5, 6, 7, 8, 9], 9), '5-')
  assert.equal(compressRange([9], 9), '9-')
  assert.equal(compressRange([3], 9), '3')
})

test('a new edition copies the cover and imports everything else', async (t) => {
  const { root, directory } = await deck(t)
  const entry = await createEdition(directory, 'conf', { event: 'Conf 2027' })
  const text = await readFile(entry, 'utf8')
  assert.match(text, /^---\n# Edition: Conf 2027\./)
  assert.match(text, /src: \.\/slides\.md#2-\n/)
  assert.deepEqual(await titles(entry), await titles(path.join(directory, 'slides.md')))
  assert.deepEqual(await titles(entry), ['Main Talk', 'Who Am I', 'No Frontmatter Slide', 'Fourth Visible', 'Last Slide'])
  await assert.rejects(createEdition(directory, 'conf'), { code: 'EEXIST' })
  const [listed] = await listDecks(root)
  assert.deepEqual(listed.editions, ['conf'])
})

test('changing a slide makes an identical local copy, then edits stay local', async (t) => {
  const { directory } = await deck(t)
  const entry = await createEdition(directory, 'conf')
  const before = await titles(entry)
  for (const number of [3, 2, 5, 4]) {
    const result = await customizeSlide(entry, number)
    assert.equal(result.changed, true)
    assert.deepEqual(await titles(entry), before, `slide ${number} changed the render`)
  }
  assert.equal((await customizeSlide(entry, 2)).changed, false)
  assert.ok((await slideMap(entry)).slice(1).every(slide => slide.local))
  const text = await readFile(entry, 'utf8')
  assert.match(text, /Bio notes\./)
  await writeFile(entry, text.replace('# Who Am I', '# Who Am I, Conf Cut'))
  assert.equal((await titles(entry))[1], 'Who Am I, Conf Cut')
  assert.equal((await titles(path.join(directory, 'slides.md')))[1], 'Who Am I')
})

test('adding and removing slides touches only that slide', async (t) => {
  const { directory } = await deck(t)
  const entry = await createEdition(directory, 'conf')
  await insertSlide(entry, 2)
  assert.deepEqual(await titles(entry), ['Main Talk', 'Who Am I', 'New Slide', 'No Frontmatter Slide', 'Fourth Visible', 'Last Slide'])
  assert.equal((await slideMap(entry))[2].frontmatter.layout, 'statement')
  await insertSlide(entry, 3)
  await removeSlide(entry, 4)
  await removeSlide(entry, 4)
  assert.deepEqual(await titles(entry), ['Main Talk', 'Who Am I', 'New Slide', 'Fourth Visible', 'Last Slide'])
  await assert.rejects(removeSlide(entry, 1), /deck settings/)
  await assert.rejects(customizeSlide(entry, 99), /does not exist/)
  // Slides added to the end of the main deck still reach the edition.
  await writeFile(path.join(directory, 'slides.md'), `${MAIN}\n---\nlayout: statement\n---\n\n# Appended Later\n`)
  assert.equal((await titles(entry)).at(-1), 'Appended Later')
})

test('editions refuse imports from other editions and main-deck edits', async (t) => {
  const { directory } = await deck(t)
  const first = await createEdition(directory, 'first')
  const nested = path.join(directory, 'slides.nested.md')
  await writeFile(nested, `${(await readFile(first, 'utf8')).split('---\nsrc:')[0]}---\nsrc: ./slides.first.md#2-\n---\n`)
  await assert.rejects(customizeSlide(nested, 3), /only import from slides\.md/)
  await assert.rejects(customizeSlide(path.join(directory, 'slides.md'), 2), /main deck/)
  // A copied edition keeps its own changes under a new header.
  await customizeSlide(first, 2)
  await writeFile(first, (await readFile(first, 'utf8')).replace('# Who Am I', '# First Bio'))
  const copy = await createEdition(directory, 'second', { from: 'first', event: 'Second' })
  assert.equal((await titles(copy))[1], 'First Bio')
  assert.match(await readFile(copy, 'utf8'), /^---\n# Edition: Second\./)
})

test('publishing records which entry each URL came from', async (t) => {
  const { directory } = await deck(t)
  await recordPublish(directory, 'talk-conf', 'conf', new Date('2027-01-02T10:00:00Z'))
  await recordPublish(directory, 'talk', undefined, new Date('2027-01-03T10:00:00Z'))
  assert.deepEqual(JSON.parse(await readFile(path.join(directory, 'published.json'), 'utf8')), {
    talk: { entry: 'slides.md', publishedAt: '2027-01-03' },
    'talk-conf': { entry: 'slides.conf.md', publishedAt: '2027-01-02' },
  })
})
