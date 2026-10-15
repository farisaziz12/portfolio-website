import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
const require = createRequire(import.meta.url)
// Use Slidev's already-installed YAML parser, with no additional dependency.
const { parse } = createRequire(require.resolve('@slidev/cli/package.json'))('yaml')
for (const name of ['slides-plan', 'slides-write', 'slides-edit', 'slides-review']) {
  test(`${name}: valid skill metadata and no unfinished instruction placeholders`, async () => {
    const source = await readFile(new URL(`../skills/${name}/SKILL.md`, import.meta.url), 'utf8')
    const match = source.match(/^---\n([\s\S]*?)\n---/)
    assert.ok(match, 'YAML frontmatter required')
    const meta = parse(match[1])
    assert.deepEqual(Object.keys(meta).sort(), ['description', 'name'])
    assert.equal(meta.name, name)
    assert.match(meta.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(meta.name.length <= 64)
    assert.equal(typeof meta.description, 'string')
    assert.ok(meta.description.length > 0 && meta.description.length <= 1024)
    assert.ok(!/[<>]/.test(meta.description))
    assert.ok(!/\[TODO:/.test(source))
  })
}
