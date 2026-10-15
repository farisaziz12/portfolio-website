import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './slides/review.mjs'

const url = process.argv[2]
assert.match(url || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const directory = await mkdtemp(path.resolve('artifacts/reviews/caching-dark-arts/website-'))
const report = { status: 'running', checks: [], errors: [], blocked: [] }
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
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`HTTP ${response.status()} ${response.url()}`) })
  for (const route of [1, 3, 6, 42, 45, 68, 94, 109]) {
    await page.goto(`${url}/${route}?clicks=0`, { waitUntil: 'domcontentloaded' })
    const slide = page.locator(`.slidev-page-${route} .faris-slide`)
    await slide.waitFor()
    await page.evaluate(() => document.fonts.ready)
    await slide.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
    await page.mouse.move(1919, 0)
    assert.deepEqual(await page.evaluate(measureSlide, `.slidev-page-${route} .faris-slide`), [])
    assert.equal(await slide.evaluate(el => el.classList.contains('website-skin')), true)
    assert.match(await slide.locator('h1').evaluate(el => getComputedStyle(el).fontFamily), /Figtree/)
    assert.equal(await slide.locator('[data-illustration]').count(), 1)
    assert.equal(await slide.locator('.faris-illustration__missing').count(), 0)
    assert.equal(await slide.locator('[data-illustration]').evaluate(el => getComputedStyle(el).transform), 'none')
    assert.equal(await slide.evaluate(el => {
      const accent = el.querySelector('.faris-slide__accent')
      if (!accent || getComputedStyle(accent).display === 'none') return true
      const a = accent.getBoundingClientRect(), b = el.querySelector('[data-illustration]').getBoundingClientRect()
      const frame = el.getBoundingClientRect()
      return a.top <= frame.top + 1 && a.bottom >= frame.bottom - 1
        && (a.right + 24 <= b.left || b.right + 24 <= a.left)
    }), true, `Route ${route}: band needs clear space from the illustration`)
    await page.screenshot({ path: path.join(directory, `${route}.png`) })
    await page.emulateMedia({ media: 'print' })
    assert.deepEqual(await page.evaluate(measureSlide, `.slidev-page-${route} .faris-slide`), [])
    await page.emulateMedia({ media: 'screen' })
    report.checks.push(`${route}: local Figtree, approved sprite, loaded images, bounds and print bounds`)
  }
  await page.goto(`${url}/2`, { waitUntil: 'networkidle' })
  assert.equal(await page.locator('.slidev-page-2 .faris-slide').evaluate(el => el.classList.contains('website-skin')), false)
  assert.match(await page.locator('.slidev-page-2 h1').evaluate(el => getComputedStyle(el).fontFamily), /Inter/)
  report.checks.push('Adjacent slide retains Inter and original styling')
  // CSS-owned FontFace entries cannot be deleted. Block the actual file on
  // a fresh document to prove the check rejects a real font-load failure.
  await page.route('**/*figtree*woff2*', route => route.abort())
  await page.goto(`${url}/3`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-page-3 .faris-slide').waitFor()
  await page.evaluate(() => document.fonts.ready)
  assert.ok((await page.evaluate(measureSlide, '.slidev-page-3 .faris-slide')).includes('Figtree Variable is not ready'))
  report.checks.push('Missing Figtree is detected instead of accepting the fallback')
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) {
  report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1
} finally {
  await browser.close()
  await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ directory, ...report }, null, 2))
}
