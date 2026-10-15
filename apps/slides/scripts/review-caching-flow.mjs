import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-chromium'
import { startDeck } from './slides/slidev.mjs'

// Targeted semantics complement the generic screenshot/bounds review.
const root = path.resolve('artifacts/reviews/caching-dark-arts')
await mkdir(root, { recursive: true })
const directory = await mkdtemp(path.join(root, `flow-${new Date().toISOString().replaceAll(':', '-')}-`))
const report = { status: 'running', checks: [], errors: [], blocked: [] }
const active = [
  ['ui'], ['requests'], ['loading'], ['map'], ['state'], ['render'],
  ['refetch', 'requests', 'render'], ['rate-limit', 'failure', 'retry'],
  ['retry'], ['retry'], ['requests', 'loading', 'retry', 'retry-loop'], [],
]
let server, browser
try {
  server = await startDeck(path.resolve('decks/caching-dark-arts/slides.md'))
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  await context.grantPermissions(['screen-wake-lock'], { origin: server.url })
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === server.url) return route.continue()
    report.blocked.push(route.request().url())
    return route.abort()
  })
  await context.routeWebSocket('**/*', route => {
    if (new URL(route.url()).host === new URL(server.url).host) return route.connectToServer()
    report.blocked.push(route.url())
    route.close()
  })
  const page = await context.newPage()
  page.on('pageerror', error => report.errors.push(error.message))
  await page.goto(`${server.url}/47?clicks=0`, { waitUntil: 'domcontentloaded' })
  const diagram = page.locator('.slidev-page-47 .caching-flow')
  async function check(step, direction) {
    await page.waitForFunction(step => document.querySelector('.slidev-page-47 .caching-flow')?.getAttribute('data-step') === String(step), step)
    const focused = await diagram.locator('[data-part][data-stage="current"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-part')).sort())
    assert.deepEqual(focused, [...active[step]].sort())
    const options = await diagram.locator('.option-current').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-part')))
    assert.deepEqual(options, step === 8 ? ['retry-all'] : step === 9 ? ['retry-failed'] : [])
    if (step === 11) assert.equal(await diagram.locator('[data-stage]:not([data-stage="complete"])').count(), 0)
    report.checks.push({ step, direction, focused, options })
  }
  for (let step = 0; step <= 11; step++) {
    if (step) await page.keyboard.press('ArrowRight')
    await check(step, 'forward')
  }
  for (let step = 10; step >= 0; step--) {
    await page.keyboard.press('ArrowLeft')
    await check(step, 'backward')
  }
  // A direct link must select the same narrative beat without prior clicks.
  await page.goto(`${server.url}/47?clicks=9`, { waitUntil: 'domcontentloaded' })
  await check(9, 'deep-link')
  // Check the actual presenter route, including its adjacent preview instance.
  const presenter = await context.newPage()
  presenter.on('pageerror', error => report.errors.push(error.message))
  await presenter.goto(`${server.url}/presenter/47?clicks=6`, { waitUntil: 'domcontentloaded' })
  await presenter.locator('.slidev-page-47 .caching-flow[data-step="6"]').first().waitFor()
  await presenter.waitForFunction(() => document.body.textContent.includes('normal render does not inherently refetch'))
  const markers = await presenter.locator('.caching-flow marker').evaluateAll(nodes => nodes.map(node => node.id))
  assert.equal(new Set(markers).size, markers.length)
  await presenter.evaluate(() => document.fonts.ready)
  await presenter.screenshot({ path: path.join(directory, 'presenter.png') })
  report.checks.push({ presenter: 'click 6 and narration available', uniqueMarkers: true })
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.blocked, [])
  report.status = 'passed'
}
catch (error) {
  report.status = 'failed'
  report.errors.push(error.stack)
  process.exitCode = 1
}
finally {
  await browser?.close()
  await server?.close()
  await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2))
  console.log(`Flow check ${report.status}: ${directory}`)
}
