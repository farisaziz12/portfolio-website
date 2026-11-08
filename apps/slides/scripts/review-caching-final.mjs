import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './slides/review.mjs'

const base = process.argv[2]
assert.match(base || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const directory = await mkdtemp(path.resolve('artifacts/reviews/caching-dark-arts/final-'))
const report = { status: 'running', checks: [], errors: [], blocked: [] }
const browser = await chromium.launch()
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  await context.grantPermissions(['screen-wake-lock'], { origin: base })
  await context.route('**/*', r => new URL(r.request().url()).origin === base ? r.continue() : (report.blocked.push(r.request().url()), r.abort()))
  await context.routeWebSocket('**/*', s => new URL(s.url()).host === new URL(base).host ? s.connectToServer() : (report.blocked.push(s.url()), s.close()))
  const page = await context.newPage()
  page.on('pageerror', e => report.errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to patch FloatingVue')) report.errors.push(m.text()) })
  for (const [route, clicks] of [[88,0],[88,1],[100,0],[100,1],[100,2],[100,3],[47,0],[79,0],[111,0]]) {
    await page.goto(`${base}/${route}?clicks=${clicks}`, { waitUntil: 'domcontentloaded' })
    const selector = `.slidev-page-${route} .faris-slide`
    await page.locator(selector).waitFor()
    await page.evaluate(() => document.fonts.ready)
    if ([47,79,111].includes(route)) {
      const video = page.locator(`${selector} video`)
      await video.evaluate(async v => { v.muted = true; await v.play() })
      await page.waitForFunction(s => document.querySelector(s).currentTime > 0.5, `${selector} video`)
      await video.evaluate(v => v.pause())
      await page.waitForFunction(s => document.querySelector(s).readyState >= 2, `${selector} video`)
      report.checks.push(`${route}: local video playback advances, pause works, decoded frame ready`)
    }
    await page.waitForTimeout(500)
    assert.deepEqual(await page.evaluate(measureSlide, selector), [])
    if (route === 88) assert.match(await page.locator(`${selector} h1`).textContent(), /Fewer Bytes Help The/)
    if (route === 100 && clicks === 3) assert.match(await page.locator(`${selector} .cache-nodes`).textContent(), /Stale Result Available/)
    await page.screenshot({ path: path.join(directory, `${route}-${clicks}.png`) })
    if ((route === 88 && clicks === 1) || (route === 100 && clicks === 3)) {
      await page.emulateMedia({ media: 'print' })
      await page.screenshot({ path: path.join(directory, `${route}-print.png`) })
      await page.emulateMedia({ media: 'screen' })
    }
    report.checks.push(`${route}/${clicks}: layout and copy`)
  }
  assert.deepEqual(report.errors, []); assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1 }
finally { await browser.close(); await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify({ directory, ...report })) }
