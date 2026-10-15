import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const root = new URL('../decks/caching-dark-arts/', import.meta.url)
const markdown = await readFile(new URL('slides.md', root), 'utf8')
function code(source) {
  if (source === 76 || source === 101) {
    const section = markdown.slice(markdown.indexOf(`sourceSlide: ${source === 76 ? 75 : 101}\n`)).split('\n---\n')[1]
    return [...section.matchAll(/```ts\n([\s\S]*?)\n```/g)][1][1]
  }
  const start = markdown.indexOf(`sourceSlide: ${source}\n`)
  return markdown.slice(start).match(/```ts\n([\s\S]*?)\n```/)[1]
}

for (const source of [76, 101, 109]) {
  test(`displayed HTTP example ${source}: success, HTTP errors and cancellation signal`, async () => {
    for (const status of [200, 429, 500]) {
      let action, receivedSignal, requestedUrl, decoded = false, stored
      const signal = new AbortController().signal
      const scope = {
        exports: {}, QUANTITY: 5, QUERY_KEY: 'faker', BIRTHDAYS_API_URL: 'https://bff.example/api/birthdays',
        QueryClient: class {},
        fetch: async (url, options) => {
          requestedUrl = url; receivedSignal = options.signal
          return { ok: status === 200, status, json: async () => { decoded = true; return { total: 5000 } } }
        },
        useFetchData: fn => { action = () => fn({ signal, setData: value => { stored = value } }); return {} },
        useQuery: options => { assert.deepEqual(Array.from(options.queryKey), ['faker', 5]); action = () => options.queryFn({ signal }); return {} },
        createPrefetch: () => ({ optionalQuery: async (_key, fn) => { action = () => fn({ signal }) }, dehydrate: () => ({}) }),
      }
      runInNewContext(ts.transpileModule(code(source), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, scope)
      if (source === 109) await scope.exports.getServerSideProps()
      assert.equal(typeof action, 'function')
      if (status === 200) {
        const result = await action()
        assert.equal((source === 76 ? stored : result).total, 5000)
        assert.equal(decoded, true)
      } else {
        await assert.rejects(action, { message: `HTTP ${status}` })
        assert.equal(decoded, false)
      }
      assert.equal(receivedSignal, signal)
      assert.ok(requestedUrl.endsWith('?quantity=5'))
      // Exercise rejection propagation without pretending this tests the omitted helper.
      scope.fetch = async (_url, { signal: forwarded }) => {
        assert.equal(forwarded, signal)
        throw new DOMException('Aborted', 'AbortError')
      }
      await assert.rejects(action, { name: 'AbortError' })
    }
  })
}

test('editable presentation text and notes contain no em dashes or HTML aliases', async () => {
  const paths = [new URL('slides.md', root)]
  for (const folder of ['components', 'layouts'])
    for (const file of await readdir(new URL(`${folder}/`, root)))
      if (/\.(vue|ts)$/.test(file)) paths.push(new URL(`${folder}/${file}`, root))
  for (const file of paths)
    assert.doesNotMatch(await readFile(file, 'utf8'), /\u2014|&mdash;|&#(?:8212|x2014);/i, file.pathname)
})

test('approved refinements keep scoped claims and request-time SSR semantics', () => {
  assert.match(markdown, /We Cannot Change The \*\*Upstream API\*\*/)
  assert.match(markdown, /QUANTITY is still 5, the number of upstream requests/)
  assert.doesNotMatch(markdown, /1–5 Gbps|2–25 Gbps|100 ms–2 s|5–60 Minutes|46 \*\*KB\*\*|# Load Balancing|Move That Time Before The Wait/)
  assert.match(markdown, /Promise.race alone does not cancel/)
  assert.match(markdown, /Server Fetching Can <strong>Delay The First Byte/)
})

test('ingress and egress copy respects the speaker vocabulary preference', async () => {
  assert.doesNotMatch(markdown, /\bboundar(?:y|ies)\b/i)
  const component = await readFile(new URL('components/BoundaryTraffic.vue', root), 'utf8')
  const labels = [...component.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(match => match[1])
  const description = component.match(/:aria-label="([^"]*)"/)[1]
  assert.ok(labels.includes('Our Server'))
  assert.doesNotMatch([...labels, description].join(' '), /\bboundar(?:y|ies)\b/i)
})
