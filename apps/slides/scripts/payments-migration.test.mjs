import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const slidevRequire = createRequire(require.resolve('@slidev/cli/bin/slidev.mjs'))
const { parse } = await import(slidevRequire.resolve('@slidev/parser'))
const deck = new URL('../decks/orchestrating-payments/', import.meta.url)
const markdown = await readFile(new URL('slides.md', deck), 'utf8')
const { slides } = await parse(markdown)
const source = JSON.parse(await readFile(new URL('migration/source.json', deck), 'utf8'))
const codeAt = number => [...slides[number - 1].content.matchAll(/```tsx?[^\n]*\n([\s\S]*?)\n```/g)].map(match => match[1]).join('\n')

test('payments: all 84 original slides retain one-to-one source identity and all 26 notes', () => {
  assert.equal(slides.length, 84)
  assert.equal(source.slides.filter(slide => slide.notes.trim()).length, 26)
  slides.forEach((slide, index) => {
    assert.equal(slide.frontmatter.sourceSlide, index + 1)
    assert.equal((slide.note || '').trim(), source.slides[index].notes.trim(), `notes on slide ${index + 1}`)
  })
})

test('payments: both video positions use static placeholders and no online embed', async () => {
  assert.deepEqual(slides.flatMap((slide, index) => slide.content.includes('<DemoPlaceholder') ? [index + 1] : []), [57, 77])
  assert.doesNotMatch(markdown, /<iframe|<video|<SlidevVideo|https?:\/\/[^\s]+\.(?:png|mp4)/i)
  assert.ok(!(await readdir(new URL('public/media/', deck))).some(name => /\.(mp4|webm)$/i.test(name)))
})

test('payments: source image assets match their recorded output hashes', async () => {
  for (const asset of source.assets) {
    const data = await readFile(new URL(asset.output, deck))
    assert.equal(createHash('sha256').update(data).digest('hex'), asset.outputSha256, asset.output)
    if (asset.conversion === 'byte-for-byte') assert.equal(asset.sourceSha256, asset.outputSha256)
  }
})

test('payments: seven code slides contain real, syntactically valid TS/TSX, not screenshots', () => {
  for (let number = 41; number <= 47; number++) {
    const code = codeAt(number)
    assert.ok(code.length > 100, `missing code on ${number}`)
    assert.doesNotMatch(slides[number - 1].content, /<img|!\[/)
    const parsed = ts.createSourceFile(`slide-${number}.${number < 46 ? 'tsx' : 'ts'}`, code, ts.ScriptTarget.Latest, true)
    assert.deepEqual(parsed.parseDiagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')), [], `slide ${number}`)
  }
})

// The source uses application-level identifiers, not actual PSP SDK clients.
// Exercise only the displayed config predicates with explicit local stubs.
function configAt(number) {
  return new Function('Stripe', 'StripeProvider', 'TestKey', 'PaymentMethod', 'getCountry',
    `${codeAt(number)}; return gateways;`)(
    'stripe', 'provider', { StripeGateway: 'experiment' }, { Alipay: 'alipay', Paypal: 'paypal' }, state => state.country)
}

test('payments: transcribed configuration preserves country rules and PayPal addition', () => {
  const before = configAt(46).stripe
  const after = configAt(47).stripe
  assert.deepEqual(before.enabledCriteria.countries.onlyIn, ['CN'])
  assert.deepEqual(after.enabledCriteria.countries.onlyIn, ['CN', 'US'])
  assert.equal(before.paymentMethods.length, 1)
  assert.equal(after.paymentMethods.length, 2)
  for (const [method, country] of [['alipay', 'CN'], ['paypal', 'US']]) {
    const rule = after.paymentMethods.find(item => item.method === method)
    assert.equal(rule.isEnabled({ country }), true)
    assert.equal(rule.isEnabled({ country: 'CH' }), false)
  }
})

test('payments: fee table rows, provider priority and the strike-through beat survive', () => {
  for (const country of ['United Kingdom', 'France', 'Cyprus', 'Estonia', 'United States', 'Canada'])
    assert.ok(slides[34].content.includes(country))
  assert.match(slides[39].content, /1st \| Stripe \| Yes \| Yes/)
  assert.match(slides[39].content, /2nd \| Adyen \| No \| Yes/)
  assert.match(slides[39].content, /3rd \| Revolut \| No \| No/)
  assert.match(slides[49].content, /~~Infrastructure~~/)
})
