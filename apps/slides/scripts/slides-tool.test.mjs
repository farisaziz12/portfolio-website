import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtemp, mkdir, readFile, readdir, symlink, writeFile, rm } from 'node:fs/promises'
import { parseCommand } from './slides/contracts.ts'
import { newDeck, deckPath, artifactDirectory, sourceHash } from './slides/workspace.mjs'

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'faris-slides-test-'))
  await mkdir(path.join(root, 'decks'))
  t.after(() => rm(root, { recursive: true, force: true }))
  return root
}

test('command interface validates export policy and rejects unsafe names/options', () => {
  assert.equal(parseCommand(['--help']), undefined)
  assert.deepEqual(parseCommand(['export', 'my-talk']), { action: 'export', deck: 'my-talk', format: 'pdf', clicks: 'all' })
  assert.deepEqual(parseCommand(['export', 'my-talk', '--format', 'png', '--clicks', 'final']), { action: 'export', deck: 'my-talk', format: 'png', clicks: 'final' })
  assert.deepEqual(parseCommand(['build', 'my-talk']), { action: 'build', deck: 'my-talk', format: 'pdf', clicks: 'all', base: '/talks/my-talk/' })
  assert.equal(parseCommand(['build', 'my-talk', '--base', '/']).base, '/')
  assert.deepEqual(parseCommand(['publish', 'my-talk']), { action: 'publish', deck: 'my-talk', format: 'pdf', clicks: 'all', slug: 'my-talk', base: '/slides/my-talk/' })
  assert.deepEqual(parseCommand(['publish', 'my-talk', '--slug', 'my-talk-2026']), { action: 'publish', deck: 'my-talk', format: 'pdf', clicks: 'all', slug: 'my-talk-2026', base: '/slides/my-talk-2026/' })
  for (const args of [['build', 'talk', '--base', 'talks/x'], ['build', 'talk', '--base', '/talks/x'], ['build', 'talk', '--base', 'https://x.com/'], ['build', 'talk', '--format', 'pdf']])
    assert.throws(() => parseCommand(args))
  for (const args of [['review'], ['publish', 'talk', '--base', '/x/'], ['publish', 'talk', '--slug', '../x'], ['publish', 'talk', '--slug'], ['new', '../escape'], ['new', '/tmp/x'], ['new', 'foo/bar'], ['new', '--help'], ['dev', 'talk', '--format', 'pdf'], ['export', 'talk', '--format', 'pptx'], ['export', 'talk', '--clicks'], ['export', 'talk', '--clicks', 'all', '--clicks', 'final']])
    assert.throws(() => parseCommand(args))
})

test('editions select a sibling entry and get their own default URL', () => {
  assert.deepEqual(parseCommand(['dev', 'my-talk', '--edition', 'conf']), { action: 'dev', deck: 'my-talk', format: 'pdf', clicks: 'all', edition: 'conf' })
  assert.deepEqual(parseCommand(['publish', 'my-talk', '--edition', 'conf']), { action: 'publish', deck: 'my-talk', format: 'pdf', clicks: 'all', slug: 'my-talk-conf', base: '/slides/my-talk-conf/', edition: 'conf' })
  assert.equal(parseCommand(['publish', 'my-talk', '--slug', 'conf-2026', '--edition', 'conf']).base, '/slides/conf-2026/')
  assert.equal(parseCommand(['build', 'my-talk', '--edition', 'conf']).base, '/talks/my-talk-conf/')
  assert.equal(parseCommand(['build', 'my-talk', '--edition', 'conf', '--base', '/x/']).base, '/x/')
  for (const args of [['new', 'talk', '--edition', 'conf'], ['dev', 'talk', '--edition'], ['dev', 'talk', '--edition', '../x'], ['dev', 'talk', '--edition', 'a.b'], ['review', 'talk', '--edition', 'a', '--edition', 'b']])
    assert.throws(() => parseCommand(args))
})

test('edition lookup and source hash cover sibling entries', async (t) => {
  const root = await fixture(t)
  const directory = await newDeck(root, 'my-talk')
  await assert.rejects(deckPath(root, 'my-talk', false, 'conf'), { code: 'ENOENT' })
  await writeFile(path.join(directory, 'slides.conf.md'), '---\nsrc: ./slides.md\n---\n')
  const edition = await deckPath(root, 'my-talk', false, 'conf')
  assert.equal(edition, path.join(directory, 'slides.conf.md'))
  const before = await sourceHash(edition)
  await writeFile(path.join(directory, 'slides.md'), 'imported slides changed')
  assert.notEqual(await sourceHash(edition), before)
  const run = await artifactDirectory(root, 'my-talk', 'conf')
  assert.equal(path.basename(path.dirname(run)), 'conf')
})

test('new creates a planning starter and refuses to overwrite a deck', async (t) => {
  const root = await fixture(t)
  const directory = await newDeck(root, 'my-talk')
  assert.deepEqual((await readdir(directory)).sort(), ['brief.md', 'outline.md', 'review.md', 'slides.md', 'sources.md'])
  const entry = await deckPath(root, 'my-talk')
  const original = await readFile(entry, 'utf8')
  assert.ok(original.includes('theme: faris'))
  assert.ok(!original.includes('{{'))
  await writeFile(entry, 'Human edits must survive')
  await assert.rejects(newDeck(root, 'my-talk'), { code: 'EEXIST' })
  assert.equal(await readFile(entry, 'utf8'), 'Human edits must survive')
  await assert.rejects(deckPath(root, 'missing'), { code: 'ENOENT' })
})

test('deck lookup rejects directory and entry symlinks', async (t) => {
  const root = await fixture(t)
  await mkdir(path.join(root, 'elsewhere'))
  await symlink(path.join(root, 'elsewhere'), path.join(root, 'decks', 'linked'))
  await assert.rejects(deckPath(root, 'linked'), /symlink/)
  await assert.rejects(newDeck(root, 'linked'), { code: 'EEXIST' })
  await mkdir(path.join(root, 'decks', 'entry-link'))
  await writeFile(path.join(root, 'outside.md'), 'private source')
  await symlink(path.join(root, 'outside.md'), path.join(root, 'decks', 'entry-link', 'slides.md'))
  await assert.rejects(deckPath(root, 'entry-link'), /regular local file/)
})

test('artifact runs are unique and preserve earlier evidence', async (t) => {
  const root = await fixture(t)
  const first = await artifactDirectory(root, 'talk')
  await writeFile(path.join(first, 'report.json'), 'approved evidence')
  const second = await artifactDirectory(root, 'talk')
  assert.notEqual(first, second)
  assert.equal(await readFile(path.join(first, 'report.json'), 'utf8'), 'approved evidence')
})

test('artifact output refuses symlinked ancestors', async (t) => {
  const root = await fixture(t)
  await mkdir(path.join(root, 'other'))
  await symlink(path.join(root, 'other'), path.join(root, 'artifacts'))
  await assert.rejects(artifactDirectory(root, 'talk'), /symlink/)
  assert.deepEqual(await readdir(path.join(root, 'other')), [])
})
