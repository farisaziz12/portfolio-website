import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './slides/review.mjs'

const url = process.argv[2]
assert.match(url || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const directory = await mkdtemp(path.resolve('artifacts/reviews/caching-dark-arts/response-'))
const report = { status: 'running', checks: [], errors: [], blocked: [], knownWarnings: [] }
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
  const demo = route => page.locator(`.slidev-page-${route} :is(.response-demo, .typing-demo)`)
  async function open(route, step) {
    await page.goto(`${url}/${route}?clicks=${step}`, { waitUntil: 'domcontentloaded' })
    await demo(route).waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.mouse.move(1919, 0)
  }
  async function capture(name) { await page.screenshot({ path: path.join(directory, `${name}.png`) }) }
  async function verify(route, step) {
    await page.waitForFunction(({ route, step }) => document.querySelector(`.slidev-page-${route} :is(.response-demo, .typing-demo)`)?.getAttribute('data-step') === String(step), { route, step })
    assert.deepEqual(await page.evaluate(measureSlide, `.slidev-page-${route} .faris-slide`), [])
    assert.equal(await demo(route).evaluate(el => {
      const slide = el.closest('.faris-slide'), box = el.getBoundingClientRect()
      return box.top >= slide.querySelector('header').getBoundingClientRect().bottom + 12
        && box.bottom <= slide.querySelector('.caching-caption').getBoundingClientRect().top - 12
    }), true)
  }
  for (const [route, total] of [[20,1],[21,2],[22,1]]) {
    await open(route, 0)
    assert.equal(await page.evaluate(() => window.__slidev__.nav.clicksTotal), total)
    for (let step = 0; step <= total; step++) {
      if (step) await page.keyboard.press('ArrowRight')
      await verify(route, step)
      assert.equal(await demo(route).evaluate(el => el.getAnimations({ subtree: true }).length), 0)
      await capture(`${route}-${step}`)
    }
    await page.emulateMedia({ media: 'print' }); await verify(route, total); await capture(`${route}-print`)
    await page.emulateMedia({ media: 'screen' })
    for (let step = total - 1; step >= 0; step--) { await page.keyboard.press('ArrowLeft'); await verify(route, step) }
    await open(route, total); await verify(route, total)
    assert.equal(await demo(route).evaluate(el => el.classList.contains('play')), false)
    report.checks.push(`${route}: clicks, bounds, reverse, static deep link, print and reduced motion`)
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const [route, step, delay] of [[20,1,100],[22,1,10000]]) {
    await open(route, step - 1)
    await page.keyboard.press('ArrowRight'); await verify(route, step)
    assert.equal(await demo(route).getAttribute('data-delay'), String(delay))
    // Seek the actual browser animations to either side of completion. This
    // checks CSS timing without relying on a scheduler waking within 100 ms.
    const timing = await demo(route).evaluate(el => {
      const animations = el.getAnimations({ subtree: true })
      animations.forEach(a => a.pause())
      const style = getComputedStyle(el)
      return { action: parseFloat(style.getPropertyValue('--action')), done: parseFloat(style.getPropertyValue('--done')), count: animations.length,
        finite: animations.every(a => a.effect.getTiming().iterations === 1) }
    })
    assert.ok(timing.count > 0); assert.ok(timing.finite)
    assert.equal(timing.done - timing.action, delay)
    async function seek(ms) {
      await demo(route).evaluate((el, ms) => el.getAnimations({ subtree: true }).forEach(a => { a.currentTime = ms }), ms)
      await page.waitForTimeout(30)
    }
    await seek(timing.done - 5)
    assert.equal(await demo(route).locator('.saved').evaluate(el => getComputedStyle(el).opacity), '0')
    await seek(timing.done + 5)
    assert.equal(await demo(route).locator('.saved').evaluate(el => getComputedStyle(el).opacity), '1')
    await seek(route === 20 ? 450 : timing.action + Math.min(delay / 2, 2300))
    await capture(`${route}-${step}-waiting`)
    if (route !== 20) {
      await seek(700)
      assert.equal(await demo(route).locator('.workflow-pointer').evaluate(el => getComputedStyle(el).opacity), '1')
      if (delay > 1000) assert.equal(await demo(route).locator('.distracted-pointer').evaluate(el => getComputedStyle(el).opacity), '0')
      await capture(`${route}-${step}-drag`)
    }
    await page.keyboard.press('ArrowLeft'); await verify(route, step - 1)
    assert.equal(await demo(route).evaluate(el => el.getAnimations({ subtree: true }).length), 0)
    report.checks.push(`${route}/${step}: real CSS delay ${delay} ms, finite animation and immediate reverse`)
  }
  for (const step of [1, 2]) {
    await open(21, step - 1)
    await page.keyboard.press('ArrowRight'); await verify(21, step)
    assert.equal(await demo(21).evaluate(el => {
      const animations = el.getAnimations({ subtree: true })
      animations.forEach(a => a.pause())
      return animations.length > 0 && animations.every(a => a.effect.getTiming().iterations === 1)
    }), true)
    for (const ms of step === 1 ? [1200, 3100] : [1600, 3100, 3900, 5600, 6800, 7405, 7720, 8250]) {
      await demo(21).evaluate((el, ms) => el.getAnimations({ subtree: true }).forEach(a => { a.currentTime = ms }), ms)
      await page.waitForTimeout(30)
      const state = await demo(21).evaluate(el => {
        const visible = [...el.querySelectorAll('.typing-frame')].filter(f => getComputedStyle(f).visibility === 'visible')
        return { count: visible.length, typed: visible[0]?.querySelector('.typing-row code').textContent,
          screen: visible[0]?.querySelector('.screen-row code').textContent,
          status: visible[0]?.querySelector('strong').textContent }
      })
      assert.equal(state.count, 1, JSON.stringify({ step, ms, state }))
      if (step === 2 && ms === 3100) { assert.equal(state.typed, "Let's ship the demo"); assert.equal(state.screen, "Let's ship ") }
      if (ms === 6800) assert.equal(state.screen, "Let's ship the demooo")
      if (ms === 7405) assert.equal(state.status, 'Backspace To Fix It')
      if (ms === 8250) { assert.equal(state.typed, state.screen); assert.equal(state.screen, "Let's ship the demo") }
      await capture(`21-${step}-typing-${ms}`)
    }
    await page.keyboard.press('ArrowLeft'); await verify(21, step - 1)
    assert.equal(await demo(21).evaluate(el => el.getAnimations({ subtree: true }).length), 0)
    report.checks.push(`21/${step}: finite typing, visible input/output states, three-second lag, correction and immediate reverse`)
  }
  await open(21, 1); await page.keyboard.press('ArrowRight'); await verify(21, 2)
  await page.waitForTimeout(8500)
  assert.equal(await demo(21).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(200); await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => window.__slidev__.nav.currentPage === 22)
  assert.equal(await page.locator('.typing-demo.play').count(), 0)
  report.checks.push('typing finishes at 8.2 seconds; leaving early clears its animations')
  // Let the longest example really run once, then verify it stops and can be
  // left early on a repeat. No timers or animation loops survive navigation.
  await open(22, 0); await page.keyboard.press('ArrowRight'); await verify(22, 1)
  await page.waitForTimeout(5000); await capture('22-real-wait')
  assert.equal(await demo(22).locator('.saved').evaluate(el => getComputedStyle(el).opacity), '0')
  await page.waitForTimeout(7800)
  assert.equal(await demo(22).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
  const completed = await demo(22).evaluate(el => ({ saved: getComputedStyle(el.querySelector('.saved')).opacity, animations: el.getAnimations({ subtree: true }).map(a => ({ name: a.animationName, state: a.playState, time: a.currentTime, timing: a.effect.getTiming() })) }))
  assert.equal(completed.saved, '1', JSON.stringify(completed))
  await capture('22-done')
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(200); await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => window.__slidev__.nav.currentPage === 23)
  assert.equal(await page.locator('.response-demo.play').count(), 0)
  report.checks.push('ten-second wait completes; early navigation stops animation')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${url}/presenter/21?clicks=2`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-page-21 .typing-demo[data-step="2"]').first().waitFor()
  await page.waitForFunction(() => document.body.textContent.includes('the screen falls three seconds behind.'))
  await capture('presenter')
  assert.deepEqual(report.errors, []); assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1 }
finally { await browser.close(); await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify({ directory, ...report })) }
