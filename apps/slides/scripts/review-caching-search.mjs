import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './slides/review.mjs'

const url = process.argv[2]
assert.match(url || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const directory = await mkdtemp(`${process.cwd()}/artifacts/reviews/caching-dark-arts/search-`)
const report = { checks: [], failures: [], blocked: [], status: 'running' }
const browser = await chromium.launch()
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, serviceWorkers: 'block' })
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
  page.on('pageerror', error => report.failures.push(error.message))
  page.on('response', response => { if (response.status() >= 400) report.failures.push(`HTTP ${response.status()}`) })
  const root = '.slidev-page-22 .faris-slide'
  const demo = page.locator(`${root} .search-demo`)
  const capture = async name => {
    assert.deepEqual(await page.evaluate(measureSlide, root), [])
    await page.screenshot({ path: `${directory}/${name}.png` })
  }
  await page.goto(`${url}/22?clicks=0`, { waitUntil: 'networkidle' })
  await demo.waitFor()
  await page.evaluate(() => document.fonts.ready)
  await demo.locator('.search-field b').hover()
  assert.equal(await demo.locator('.search-field b').evaluate(el => getComputedStyle(el).cursor), 'pointer')
  await page.mouse.move(1919, 0)
  await capture('ready')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.querySelector('.slidev-page-22 .search-demo')?.classList.contains('play'))
  const durations = await demo.evaluate(el => {
    const style = getComputedStyle(el)
    return ['--search-at', '--results-at', '--wait'].map(key => parseFloat(style.getPropertyValue(key)))
  })
  assert.equal(durations[1] - durations[0], 10000)
  assert.equal(durations[0], 400)
  const seek = async at => demo.evaluate((el, time) => {
    for (const animation of el.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = time }
  }, at)
  const opacity = selector => demo.locator(selector).evaluate(el => Number(getComputedStyle(el).opacity))
  await seek(200)
  assert.equal(await opacity('.search-hand'), 1)
  assert.equal(await opacity('.search-arrow'), 0)
  await seek(450)
  assert.equal(await opacity('.search-loading'), 1)
  await capture('quick-start')
  await seek(600)
  assert.equal(await opacity('.search-hand'), 0)
  assert.equal(await opacity('.search-arrow'), 1)
  report.checks.push('Pointer cursor on hover; animated hand switches to arrow on departure; search starts in 400 ms')
  await seek(5000)
  assert.equal(await opacity('.search-loading'), 1)
  assert.equal(await opacity('.search-results'), 0)
  await capture('waiting')
  await seek(durations[1] - 1)
  assert.equal(await opacity('.search-results'), 0)
  await seek(durations[1] + 500)
  assert.equal(await opacity('.search-loading'), 0)
  assert.equal(await opacity('.search-results'), 1)
  await capture('results')
  await seek(durations[1] + 1700)
  await capture('reread')
  await seek(durations[1] + 3600)
  await capture('reoriented')
  report.checks.push('Results appear only after a real 10-second wait; pointer rereads query and scans results')
  await page.keyboard.press('ArrowLeft')
  await page.waitForFunction(() => !document.querySelector('.slidev-page-22 .search-demo')?.classList.contains('started'))
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.querySelector('.slidev-page-22 .search-demo')?.classList.contains('play'))
  await page.keyboard.press('ArrowRight')
  await page.waitForURL('**/23*')
  assert.equal(await demo.evaluate(el => el.classList.contains('play')), false)
  report.checks.push('Reverse resets and navigation immediately interrupts playback')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${url}/22?clicks=1`, { waitUntil: 'networkidle' })
  await capture('reduced')
  assert.equal(await demo.evaluate(el => el.getAnimations({ subtree: true }).length), 0)
  assert.equal(await opacity('.search-results'), 1)
  await page.emulateMedia({ media: 'print' })
  await capture('print')
  assert.equal(await demo.evaluate(el => el.getAnimations({ subtree: true }).length), 0)
  report.checks.push('Deep link, reduced motion and print show a readable completed scene')
  assert.deepEqual(report.failures, [])
  assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) {
  report.status = 'failed'; report.failures.push(error.stack); process.exitCode = 1
} finally {
  await browser.close()
  await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ directory, ...report }, null, 2))
}
