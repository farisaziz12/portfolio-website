import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import { architecture, clicks } from '../decks/caching-dark-arts/components/architecture.ts'

const url = process.argv[2]
assert.match(url || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const root = path.resolve('artifacts/reviews/caching-dark-arts')
await mkdir(root, { recursive: true })
const directory = await mkdtemp(path.join(root, 'architecture-'))
const report = { status: 'running', states: [], checks: [], errors: [], blocked: [], knownWarnings: [] }
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  await context.grantPermissions(['screen-wake-lock'], { origin: url })
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === url) return route.continue()
    report.blocked.push(route.request().url()); return route.abort()
  })
  await context.routeWebSocket('**/*', socket => {
    if (new URL(socket.url()).host === new URL(url).host) return socket.connectToServer()
    report.blocked.push(socket.url()); socket.close()
  })
  const page = await context.newPage()
  page.on('pageerror', error => report.errors.push(error.message))
  page.on('console', msg => {
    if (msg.text().startsWith('Failed to patch FloatingVue')) report.knownWarnings.push(msg.text())
    else if (msg.type() === 'error') report.errors.push(msg.text())
  })
  for (const [variant, route] of [['client', 43], ['bff', 70], ['query', 96], ['prefetch', 104]]) {
    await page.goto(`${url}/${route}?clicks=0`, { waitUntil: 'domcontentloaded' })
    const selector = `.slidev-page-${route} .architecture-flow`
    await page.locator(selector).waitFor()
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.evaluate(() => window.__slidev__.nav.clicksTotal), clicks[variant])
    async function verify(step) {
      await page.waitForFunction(({ selector, step }) => document.querySelector(selector)?.getAttribute('data-step') === String(step), { selector, step })
      const actual = await page.locator(selector).evaluate(el => ({
        nodes: [...el.querySelectorAll('[data-node]')].map(n => n.getAttribute('data-node')),
        current: [...el.querySelectorAll('[data-current="true"]')].map(n => n.getAttribute('data-node') || n.getAttribute('data-edge')).sort(),
        overflow: [...el.querySelectorAll('[data-node]')].flatMap(node => {
          const width = Number(node.querySelector('rect').getAttribute('width'))
          return [...node.querySelectorAll('text')].filter(t => t.getBBox().x + t.getBBox().width > width - 5).map(t => t.textContent)
        }),
      }))
      const expected = architecture(variant, step)
      assert.deepEqual(actual.nodes, expected.nodes.map(n => n.id))
      assert.deepEqual(actual.current, [...expected.edges, ...expected.nodes].filter(n => n.current).map(n => n.id).sort())
      assert.deepEqual(actual.overflow, [], `${variant}/${step}: node text overflow`)
    }
    for (let step = 0; step <= clicks[variant]; step++) {
      if (step) await page.keyboard.press('ArrowRight')
      await verify(step)
      await page.waitForTimeout(240)
      const screenshot = `${variant}-${step}.png`
      await page.screenshot({ path: path.join(directory, screenshot) })
      report.states.push({ variant, step, screenshot })
    }
    await page.emulateMedia({ media: 'print' })
    assert.equal(await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
    await page.screenshot({ path: path.join(directory, `${variant}-print.png`) })
    await page.emulateMedia({ media: 'screen' })
    for (let step = clicks[variant] - 1; step >= 0; step--) { await page.keyboard.press('ArrowLeft'); await verify(step) }
    await page.goto(`${url}/${route}?clicks=2`, { waitUntil: 'domcontentloaded' }); await verify(2)
    report.checks.push(`${variant}: forward, reverse, deep-link, click total, text fit, print state`)
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(`${url}/70?clicks=0`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(500)
  assert.equal(await page.locator('.slidev-page-70 .signal').count(), 0, 'Familiar baseline must not replay')
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(100)
  const draw = await page.locator('.slidev-page-70 .signal').first().evaluate(el => ({ name: getComputedStyle(el).animationName, offset: parseFloat(getComputedStyle(el).strokeDashoffset) }))
  assert.match(draw.name, /^architecture-draw(?:-[a-z0-9]+)?$/); assert.ok(draw.offset > 0 && draw.offset < 1)
  await page.screenshot({ path: path.join(directory, 'line-in-motion.png') })
  await page.waitForTimeout(650)
  assert.equal(await page.locator('.slidev-page-70 .architecture-flow').evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(120)
  const x = await page.locator('.slidev-page-70 [data-node="map"]').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)
  assert.ok(x > 242 && x < 580, `Mapping node moves between anchors: ${x}`)
  await page.screenshot({ path: path.join(directory, 'mapping-in-motion.png') })
  await page.waitForTimeout(650)
  // Rapid clicks must immediately select their target, never lock navigation.
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowLeft')
  await page.waitForFunction(() => window.__slidev__.nav.clicks === 3)
  report.checks.push('Full motion: connector draw, mapping translation, no baseline replay, finite animation, rapid navigation')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${url}/presenter/104?clicks=4`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-page-104 .architecture-flow[data-step="4"]').first().waitFor()
  await page.waitForFunction(() => document.body.textContent.includes('The failure path is an alternative'))
  const markers = await page.locator('.architecture-flow marker').evaluateAll(nodes => nodes.map(n => n.id))
  assert.equal(new Set(markers).size, markers.length)
  await page.screenshot({ path: path.join(directory, 'presenter.png') })
  report.checks.push('Presenter: native click state, new notes and unique marker IDs')
  assert.deepEqual(report.errors, []); assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) {
  report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1
} finally {
  await browser.close()
  await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ directory, status: report.status, states: report.states.length, errors: report.errors }))
}
