import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const markdown = await readFile(new URL('../decks/authoring-example/slides.md', import.meta.url), 'utf8')
const source = markdown.match(/```ts[^\n]*\n([\s\S]*?)\n```/)[1]
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
// Execute the exact displayed local example with explicit assumed interfaces.
const makeLoader = new Function('productCache', 'catalog', `${compiled.replace('export ', '')}; return loadProduct`)

test('displayed cache example returns a hit without catalog or write calls', async () => {
  const product = { id: 'one' }
  const load = makeLoader({ get: async id => { assert.equal(id, 'one'); return product }, set: () => assert.fail('write on hit') }, { getProduct: () => assert.fail('catalog on hit') })
  assert.equal(await load('one'), product)
})

test('displayed cache example fetches and writes a miss with the shown TTL', async () => {
  const product = { id: 'two' }
  const calls = []
  const load = makeLoader({ get: async () => undefined, set: async (...args) => calls.push(args) }, { getProduct: async id => { assert.equal(id, 'two'); return product } })
  assert.equal(await load('two'), product)
  assert.deepEqual(calls, [['two', product, { ttl: 60 }]])
})
