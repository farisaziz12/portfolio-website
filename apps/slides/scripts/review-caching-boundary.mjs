import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './slides/review.mjs'

const url = process.argv[2]
assert.match(url || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const directory = await mkdtemp(path.resolve('artifacts/reviews/caching-dark-arts/boundary-'))
const report = { status: 'running', screenshots: [], checks: [], errors: [], blocked: [], knownWarnings: [] }
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce', serviceWorkers: 'block' })
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
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`HTTP ${r.status()} ${r.url()}`) })
  page.on('console', msg => {
    if (msg.text().startsWith('Failed to patch FloatingVue')) report.knownWarnings.push(msg.text())
    else if (msg.type() === 'error') report.errors.push(msg.text())
  })
  const capture = async name => {
    await page.mouse.move(1919, 0)
    await page.screenshot({ path: path.join(directory, `${name}.png`) })
    report.screenshots.push(`${name}.png`)
  }
  const fingerprints = new Map()
  for (const route of [89, 90]) {
    const selector = `.slidev-page-${route} .boundary-traffic`
    async function verify(step) {
      await page.locator(`${selector}[data-step="${step}"]`).waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(260)
      assert.deepEqual(await page.evaluate(measureSlide, `.slidev-page-${route} .faris-slide`), [])
      assert.equal(await page.locator(`${selector} .boundary-label`).textContent(), 'Our Server')
      assert.doesNotMatch(await page.locator(selector).innerText(), /\bboundar(?:y|ies)\b/i)
      assert.doesNotMatch(await page.locator(`${selector} > svg`).getAttribute('aria-label'), /\bboundar(?:y|ies)\b/i)
      assert.equal(await page.locator(selector).evaluate(el => {
        const slide = el.closest('.faris-slide')
        const box = el.getBoundingClientRect()
        return box.top > slide.querySelector('.caching-content__title').getBoundingClientRect().bottom + 12
          && box.bottom < slide.querySelector('.caching-caption').getBoundingClientRect().top - 12
      }), true)
      assert.equal(await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
      assert.equal(await page.locator(`${selector} .incoming`).evaluate(el => el.classList.contains('active')), route === 90 || step === 1)
      assert.equal(await page.locator(`${selector} .outgoing`).evaluate(el => el.classList.contains('active')), route === 90 && step === 1)
      return page.locator(selector).evaluate(el => el.innerHTML)
    }
    await page.goto(`${url}/${route}?clicks=0`, { waitUntil: 'domcontentloaded' })
    await page.locator(selector).waitFor()
    assert.equal(await page.evaluate(() => window.__slidev__.nav.clicksTotal), 1)
    for (const step of [0, 1]) {
      if (step) await page.keyboard.press('ArrowRight')
      fingerprints.set(`${route}/${step}`, await verify(step))
      await capture(`${route}-${step}`)
    }
    await page.emulateMedia({ media: 'print' })
    await verify(1); await capture(`${route}-print`)
    await page.emulateMedia({ media: 'screen' })
    await page.keyboard.press('ArrowLeft')
    assert.equal(await verify(0), fingerprints.get(`${route}/0`))
    await page.goto(`${url}/${route}?clicks=1`, { waitUntil: 'domcontentloaded' })
    assert.equal(await verify(1), fingerprints.get(`${route}/1`))
    report.checks.push(`${route}: forward/reverse/deep-link, fixed boundary direction, reduced motion, print, bounds`)
  }
  await page.goto(`${url}/89?clicks=1`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-page-89 .boundary-traffic').waitFor()
  const anchors = await page.locator('.slidev-page-89 [data-node]').evaluateAll(nodes => nodes.map(node => node.innerHTML))
  await page.keyboard.press('ArrowRight')
  await page.locator('.slidev-page-90 .boundary-traffic[data-step="0"]').waitFor()
  assert.deepEqual(await page.locator('.slidev-page-90 [data-node]').evaluateAll(nodes => nodes.map(node => node.innerHTML)), anchors)
  assert.equal(await page.locator('.slidev-page-90 .incoming.active').count(), 1)
  assert.equal(await page.locator('.slidev-page-90 .incoming .packet').count(), 0)
  report.checks.push('89 final → 90 initial: same anchors and completed ingress retained without replay')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const route of [89, 90]) {
    const selector = `.slidev-page-${route} .boundary-traffic`
    await page.goto(`${url}/${route}?clicks=0`, { waitUntil: 'domcontentloaded' })
    await page.locator(selector).waitFor(); await page.waitForTimeout(650)
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(160)
    const moving = await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').map(a => ({ name: a.animationName, iterations: a.effect.getTiming().iterations })))
    assert.ok(moving.some(a => a.name.startsWith('boundary-packet')))
    assert.ok(moving.every(a => a.iterations === 1))
    await capture(`${route}-motion`)
    await page.waitForTimeout(1100)
    assert.equal(await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowLeft')
    await page.locator(`${selector}[data-step="0"]`).waitFor()
    report.checks.push(`${route}: visible finite packets, no loops, rapid reverse not blocked`)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const route of [89, 92]) {
    await page.goto(`${url}/${route}`, { waitUntil: 'domcontentloaded' })
    await page.locator(`.slidev-page-${route} .faris-slide`).waitFor()
    await page.evaluate(() => document.fonts.ready)
    await capture(`${route}-neighbor`)
  }
  await page.goto(`${url}/presenter/90?clicks=1`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-page-90 .boundary-traffic[data-step="1"]').first().waitFor()
  await page.waitForFunction(() => document.body.textContent.includes('Data leaving the BFF is egress.'))
  await capture('presenter')
  assert.deepEqual(report.errors, []); assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1 }
finally {
  await browser.close()
  await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ directory, ...report }))
}
