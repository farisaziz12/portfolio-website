import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './slides/review.mjs'
const url = process.argv[2]
assert.match(url || '', /^http:\/\/127\.0\.0\.1:\d+$/)
const directory = await mkdtemp(path.resolve('artifacts/reviews/caching-dark-arts/technical-'))
const report = { status: 'running', screenshots: [], checks: [], errors: [], blocked: [] }
const browser = await chromium.launch()
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce', serviceWorkers: 'block' })
  await context.grantPermissions(['screen-wake-lock'], { origin: url })
  await context.route('**/*', r => new URL(r.request().url()).origin === url ? r.continue() : (report.blocked.push(r.request().url()), r.abort()))
  await context.routeWebSocket('**/*', s => new URL(s.url()).host === new URL(url).host ? s.connectToServer() : (report.blocked.push(s.url()), s.close()))
  const page = await context.newPage()
  page.on('pageerror', e => report.errors.push(e.message))
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`HTTP ${r.status()} ${r.url()}`) })
  page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to patch FloatingVue')) report.errors.push(m.text()) })
  async function capture(name) {
    await page.screenshot({ path: path.join(directory, `${name}.png`) }); report.screenshots.push(`${name}.png`)
  }
  for (const route of [72,97,103,104,105,106,107]) {
    const max = route === 103 ? 3 : route === 104 ? 5 : 0
    await page.goto(`${url}/${route}?clicks=${max}`, { waitUntil: 'domcontentloaded' })
    const slide = `.slidev-page-${route} .faris-slide`
    await page.locator(slide).waitFor(); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300)
    assert.deepEqual(await page.evaluate(measureSlide, slide), [])
    assert.doesNotMatch(await page.locator(slide).innerText(), /\u2014/)
    await capture(`${route}-screen`)
    await page.emulateMedia({ media: 'print' })
    assert.equal(await page.locator(slide).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
    await capture(`${route}-print`)
    await page.emulateMedia({ media: 'screen' })
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const [route, start, target] of [[103,0,1],[103,1,2],[104,3,4]]) {
    await page.goto(`${url}/${route}?clicks=${start}`, { waitUntil: 'domcontentloaded' })
    const selector = `.slidev-page-${route} ${route === 103 ? '.performance-viz' : '.architecture-flow'}`
    await page.locator(selector).waitFor(); await page.waitForTimeout(1100)
    await page.keyboard.press('ArrowRight'); await page.locator(`${selector}[data-step="${target}"]`).waitFor()
    await page.waitForTimeout(120)
    assert.ok(await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === 'running')))
    await capture(`${route}-${target}-motion`)
    await page.waitForTimeout(900)
    assert.equal(await page.locator(selector).evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0)
    await page.keyboard.press('ArrowLeft'); await page.locator(`${selector}[data-step="${start}"]`).waitFor()
  }
  report.checks.push('Code/layout bounds, em-dash-free visible text, static print, finite timeline/recovery animation and reverse clicks')
  assert.deepEqual(report.errors, []); assert.deepEqual(report.blocked, [])
  report.status = 'passed'
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1 }
finally { await browser.close(); await writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify({ directory, ...report })) }
