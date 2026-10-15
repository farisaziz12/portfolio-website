import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'

const base = process.argv[2]
assert.match(base || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const directory = await mkdtemp(path.resolve('artifacts/reviews/caching-dark-arts/magic-'))
const report = { status: 'running', checks: [], errors: [], blocked: [] }
const browser = await chromium.launch()
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  await context.grantPermissions(['screen-wake-lock'], { origin: base })
  await context.route('**/*', r => new URL(r.request().url()).origin === base ? r.continue() : (report.blocked.push(r.request().url()), r.abort()))
  await context.routeWebSocket('**/*', s => new URL(s.url()).host === new URL(base).host ? s.connectToServer() : (report.blocked.push(s.url()), s.close()))
  const page = await context.newPage()
  page.on('pageerror', e => report.errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to patch FloatingVue')) report.errors.push(m.text()) })
  const animatedCharacters = () => document.getAnimations().filter(a => a.effect?.pseudoElement?.startsWith('::view-transition-group(caching-')).length
  async function go(route, clicks = 0, prefix = '') {
    await page.goto(`${base}/${prefix}${route}?clicks=${clicks}`, { waitUntil: 'domcontentloaded' })
    await page.locator(`.slidev-page-${route}`).first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(600)
  }
  for (const [from, clicks, to] of [[7,0,8],[61,1,62],[62,1,63],[81,1,82],[102,0,103],[45,0,46]]) {
    await go(from, clicks)
    await page.keyboard.press('ArrowRight')
    await page.waitForFunction(n => window.__slidev__.nav.currentPage === n, to)
    const count = await page.evaluate(animatedCharacters)
    if (to !== 46) assert.ok(count > 0, `${from}→${to}: individual character snapshots`)
    if (to !== 46) {
      const timings = await page.evaluate(() => document.getAnimations()
        .filter(a => a.effect?.pseudoElement?.startsWith('::view-transition-group(caching-'))
        .map(a => ({ duration: a.effect.getTiming().duration, easing: a.effect.getKeyframes()[0].easing })))
      assert.ok(timings.every(t => t.duration === 760 && t.easing === 'cubic-bezier(0.45, 0, 0.25, 1)'), JSON.stringify(timings))
      report.checks.push(`${from}→${to}: 760 ms gentle ease-in/ease-out verified in browser`)
    }
    await page.waitForTimeout(240)
    await page.screenshot({ path: path.join(directory, `${from}-${to}-motion.png`) })
    await page.waitForTimeout(900)
    assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.effect?.pseudoElement?.startsWith('::view-transition') && a.playState === 'running').length), 0)
    await page.screenshot({ path: path.join(directory, `${to}-settled.png`) })
    const heading = page.locator(`.slidev-page-${to} h1`)
    if (await heading.count()) assert.equal(await heading.getAttribute('aria-label'), await heading.textContent())
    await page.keyboard.press('ArrowLeft')
    await page.waitForFunction(n => window.__slidev__.nav.currentPage === n, from)
    report.checks.push(`${from}↔${to}: finite character move, reverse, accessible heading or video fallback`)
  }
  await go(7)
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(1100)
  const rapidPage = await page.evaluate(() => window.__slidev__.nav.currentPage)
  assert.ok(rapidPage > 7 && rapidPage <= 13)
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(1100)
  assert.equal(await page.evaluate(() => window.__slidev__.nav.currentPage), rapidPage - 1)
  report.checks.push('Rapid navigation remains responsive; interrupted native transitions settle')
  await go(62, 1, 'presenter/')
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1100)
  assert.equal(await page.evaluate(() => window.__slidev__.nav.currentPage), 63)
  await page.screenshot({ path: path.join(directory, 'presenter.png') })
  await page.goto(`${base}/overview`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(1200)
  assert.equal(await page.locator('.disable-view-transition .magic-character').evaluateAll(els => els.filter(e => getComputedStyle(e).viewTransitionName !== 'none').length), 0)
  report.checks.push('Presenter navigation and overview isolation')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await go(61, 1); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500)
  assert.equal(await page.locator('.slidev-page-62 .magic-character').evaluateAll(els => els.filter(e => getComputedStyle(e).viewTransitionName !== 'none').length), 0)
  await page.emulateMedia({ media: 'print', reducedMotion: 'no-preference' })
  assert.equal(await page.locator('.slidev-page-62 .magic-character').evaluateAll(els => els.filter(e => getComputedStyle(e).viewTransitionName !== 'none').length), 0)
  await page.screenshot({ path: path.join(directory, 'print.png') })
  report.checks.push('Reduced motion and print disable character morphs')
  await page.emulateMedia({ media: 'screen' })
  // Native Slidev feature detection uses `in`, so remove the prototype method.
  await page.addInitScript(() => { delete document.startViewTransition; delete Document.prototype.startViewTransition })
  await go(7); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(700)
  assert.equal(await page.evaluate(() => window.__slidev__.nav.currentPage), 8)
  report.checks.push('Unsupported View Transitions API falls back to native fade navigation')
  assert.deepEqual(report.errors, []); assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1 }
finally { await browser.close(); await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify({ directory, ...report })) }
