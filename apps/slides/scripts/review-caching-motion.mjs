import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-chromium'
import { startDeck } from './slides/slidev.mjs'

const root = path.resolve('artifacts/reviews/caching-dark-arts')
await mkdir(root, { recursive: true })
const directory = await mkdtemp(path.join(root, `motion-${new Date().toISOString().replaceAll(':', '-')}-`))
const report = { status: 'running', checks: [], errors: [], blocked: [] }
let server, browser
try {
  server = await startDeck(path.resolve('decks/caching-dark-arts/slides.md'))
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'no-preference', recordVideo: { dir: directory, size: { width: 1280, height: 720 } } })
  await context.grantPermissions(['screen-wake-lock'], { origin: server.url })
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === server.url) return route.continue()
    report.blocked.push(route.request().url()); return route.abort()
  })
  await context.routeWebSocket('**/*', socket => {
    if (new URL(socket.url()).host === new URL(server.url).host) return socket.connectToServer()
    report.blocked.push(socket.url()); socket.close()
  })
  const page = await context.newPage()
  page.on('pageerror', error => report.errors.push(error.message))
  const go = async number => {
    await page.goto(`${server.url}/${number}`, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(number => window.__slidev__?.nav.currentSlideNo === number, number)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(350)
  }
  const settled = async number => {
    await page.waitForFunction(number => window.__slidev__?.nav.currentSlideNo === number, number)
    await page.waitForTimeout(350)
    const state = await page.locator(`.slidev-page-${number}`).first().evaluate(el => ({ opacity: getComputedStyle(el).opacity, translate: getComputedStyle(el).translate, activeAnimations: el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length }))
    assert.equal(state.opacity, '1')
    assert.equal(state.translate, 'none')
    assert.equal(state.activeAnimations, 0)
    return state
  }
  for (const number of [8, 49, 74, 100, 108]) {
    await go(number - 1)
    await page.keyboard.press('ArrowRight')
    await page.waitForFunction(number => document.querySelector(`.slidev-page-${number}.caching-flow-enter-active`), number)
    const transition = await page.locator(`.slidev-page-${number}`).first().evaluate(el => ({ duration: getComputedStyle(el).transitionDuration, animations: el.getAnimations({ subtree: true }).map(a => a.effect.getTiming().duration) }))
    assert.equal(transition.duration, '0.22s, 0.22s')
    assert.ok(transition.animations.length > 0)
    await page.screenshot({ path: path.join(directory, `slide-${number}-transition.png`) })
    await settled(number)
    await page.screenshot({ path: path.join(directory, `slide-${number}-settled.png`) })
    await page.keyboard.press('ArrowLeft')
    await settled(number - 1)
    report.checks.push({ slide: number, transition, reverse: 'passed', settled: 'visible, no continuing animation' })
  }
  await go(8)
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await settled(11)
  report.checks.push({ rapidNavigation: '8 → 11 without waiting for transitions' })
  await go(47)
  assert.equal(await page.evaluate(() => window.__slidev__.nav.clicksTotal), 11)
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => window.__slidev__.nav.clicks === 1)
  report.checks.push({ narration: 'Existing eleven flow clicks retained; no decorative extra clicks' })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await go(8)
  const reduced = await page.locator('.slidev-page-8').first().evaluate(el => {
    el.classList.add('caching-flow-enter-active')
    const duration = getComputedStyle(el).transitionDuration
    const animations = el.getAnimations({ subtree: true }).length
    el.classList.remove('caching-flow-enter-active')
    return { duration, animations }
  })
  assert.equal(reduced.duration, '0s')
  assert.equal(reduced.animations, 0)
  report.checks.push({ reducedMotion: reduced })
  await page.emulateMedia({ reducedMotion: 'no-preference', media: 'print' })
  const print = await page.locator('.slidev-page-8').first().evaluate(el => {
    el.classList.add('caching-flow-enter-from', 'caching-flow-enter-active')
    const style = getComputedStyle(el)
    return { opacity: style.opacity, translate: style.translate, duration: style.transitionDuration }
  })
  assert.deepEqual(print, { opacity: '1', translate: 'none', duration: '0s' })
  report.checks.push({ print })
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.blocked, [])
  await context.close()
  report.video = await page.video().path()
  report.status = 'passed'
} catch (error) {
  report.status = 'failed'; report.failure = error.stack; process.exitCode = 1
} finally {
  await browser?.close()
  await server?.close()
  await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2))
  console.log(`Motion ${report.status}: ${directory}`)
  if (report.failure) console.error(report.failure)
}
