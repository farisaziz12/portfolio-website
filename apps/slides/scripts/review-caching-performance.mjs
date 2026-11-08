import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './slides/review.mjs'

const url = process.argv[2]
assert.match(url || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const latencyOnly = process.argv[3] === 'latency'
const directory = await mkdtemp(path.resolve('artifacts/reviews/caching-dark-arts/performance-'))
const report = { status: 'running', states: [], checks: [], errors: [], blocked: [], knownWarnings: [] }
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
  for (const [route, maximum] of (latencyOnly ? [[61,1],[62,1],[63,4]] : [[61,1],[62,1],[63,4],[76,2],[81,1],[82,1],[83,1],[85,1],[86,1],[87,1],[99,3],[103,3]])) {
    await page.goto(`${url}/${route}?clicks=0`, { waitUntil: 'domcontentloaded' })
    const selector = `.slidev-page-${route} .performance-viz`
    await page.locator(selector).waitFor()
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.evaluate(() => window.__slidev__.nav.clicksTotal), maximum)
    const fingerprints = []
    async function verify(step) {
      await page.waitForFunction(({ selector, step }) => document.querySelector(selector)?.getAttribute('data-step') === String(step), { selector, step })
      await page.waitForTimeout(240)
      assert.deepEqual(await page.evaluate(measureSlide, `.slidev-page-${route} .faris-slide`), [])
      assert.equal(await page.locator(selector).evaluate(el => {
        const slide = el.closest('.faris-slide')
        const top = slide.querySelector('.caching-content__title').getBoundingClientRect().bottom
        const bottom = slide.querySelector('.caching-caption').getBoundingClientRect().top
        const box = el.getBoundingClientRect()
        return box.top >= top + 12 && box.bottom <= bottom - 12
      }), true, `${route}/${step}: diagram must leave space before title and caption`)
      assert.equal(await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
      if ([61, 62, 63].includes(route)) {
        const text = await page.locator(`.slidev-page-${route} .faris-slide`).innerText()
        assert.match(text, /Ethernet/)
        assert.doesNotMatch(text, /\bLAN\b|Local Network|Keep The Same Time Axis|Now Add|Not The Whole Story/)
        if (route === 63) assert.match(text, /What About 4G And 5G\?/)
      }
      return page.locator(selector).evaluate(el => el.innerHTML)
    }
    for (let step = 0; step <= maximum; step++) {
      if (step) await page.keyboard.press('ArrowRight')
      fingerprints.push(await verify(step))
      const screenshot = `${route}-${step}.png`
      await page.mouse.move(1919, 0)
      await page.screenshot({ path: path.join(directory, screenshot) })
      report.states.push({ route, step, screenshot })
    }
    await page.emulateMedia({ media: 'print' })
    await verify(maximum)
    await page.screenshot({ path: path.join(directory, `${route}-print.png`) })
    await page.emulateMedia({ media: 'screen' })
    for (let step = maximum - 1; step >= 0; step--) { await page.keyboard.press('ArrowLeft'); assert.equal(await verify(step), fingerprints[step]) }
    await page.goto(`${url}/${route}?clicks=${maximum}`, { waitUntil: 'domcontentloaded' })
    assert.equal(await verify(maximum), fingerprints[maximum])
    report.checks.push(`${route}: forward/reverse/deep-link, reduced motion, print, layout`)
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const [route, start, target] of (latencyOnly ? [[61,0,1],[62,0,1],[63,2,3],[63,3,4]] : [[61,0,1],[63,2,3],[76,0,1],[83,0,1],[99,0,1],[103,0,1]])) {
    await page.goto(`${url}/${route}?clicks=${start}`, { waitUntil: 'domcontentloaded' })
    const selector = `.slidev-page-${route} .performance-viz`
    await page.locator(selector).waitFor(); await page.waitForTimeout(700)
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100)
    const moving = await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').map(a => ({ name: a.animationName || a.transitionProperty, iterations: a.effect.getTiming().iterations })))
    assert.ok(moving.length, `${route} must show explanatory motion`)
    assert.ok(moving.every(a => a.iterations === 1), 'No looping motion')
    await page.screenshot({ path: path.join(directory, `${route}-${target}-motion.png`) })
    if (route === 61) {
      const pulse = page.locator(`${selector} .roundtrip`)
      assert.equal(await pulse.evaluate(el => el.getAnimations()[0].effect.getTiming().duration), 1260)
      const positions = []
      for (const time of [315, 945]) {
        positions.push(await pulse.evaluate((el, time) => {
          const animation = el.getAnimations()[0]; animation.pause(); animation.currentTime = time
          return { left: parseFloat(getComputedStyle(el).left), color: getComputedStyle(el).backgroundColor }
        }, time))
        await page.screenshot({ path: path.join(directory, `61-${time}-motion.png`) })
      }
      assert.ok(positions.every(p => p.left > 30 && p.left < 150))
      assert.notEqual(positions[0].color, positions[1].color)
      await pulse.evaluate(el => el.getAnimations()[0].play())
      report.checks.push('Ethernet: 1260 ms duration, visible outbound and return positions with distinct colors')
    }
    await page.waitForTimeout(4200)
    assert.equal(await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
    // A running animation must never block a reverse click.
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowLeft')
    await page.waitForFunction(step => window.__slidev__.nav.clicks === step, start)
    report.checks.push(`${route}: visible finite animation and rapid reverse navigation to ${start}`)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${url}/presenter/63?clicks=4`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-page-63 .performance-viz[data-step="4"]').first().waitFor()
  await page.waitForFunction(() => document.body.textContent.includes('A slow connection might take 80–200 ms'))
  await page.screenshot({ path: path.join(directory, 'presenter.png') })
  assert.deepEqual(report.errors, []); assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1 }
finally {
  await browser.close()
  await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ directory, status: report.status, states: report.states.length, errors: report.errors }))
}
