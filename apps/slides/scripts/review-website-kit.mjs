import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright-chromium'

const kit = path.resolve('artifacts/website-handoff/faris-brand-kit')
const output = path.resolve('artifacts/website-handoff/review')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const report = { browser: browser.version(), errors: [], checks: [], visualReview: 'pending' }
try {
  const context = await browser.newContext({ reducedMotion: 'reduce', serviceWorkers: 'block' })
  await context.route('**/*', route => {
    if (route.request().url().startsWith('file:')) return route.continue()
    report.errors.push(`External request: ${route.request().url()}`)
    return route.abort()
  })
  const page = await context.newPage()
  page.on('pageerror', error => report.errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()) })
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(pathToFileURL(path.join(kit, 'preview.html')).href)
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map(image => image.decode()))
    })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.equal(await page.evaluate(() => [...document.fonts].some(font => font.family.replace(/["']/g, '') === 'Faris Inter' && font.status === 'loaded')), true)
    for (const mode of ['light', 'dark']) {
      await page.locator(`[data-theme="${mode}"]`).screenshot({ path: path.join(output, `${width}-${mode}.png`) })
      report.checks.push({ width, mode, images: 'loaded', font: 'loaded', horizontalOverflow: false })
    }
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('faris-link')), true)
    assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid')
  }
  await page.locator('[data-theme="light"]').evaluate(element => element.dataset.theme = 'auto')
  for (const scheme of ['dark', 'light']) {
    await page.emulateMedia({ colorScheme: scheme })
    assert.equal(await page.locator('[data-theme="auto"]').evaluate(element => getComputedStyle(element).backgroundColor), scheme === 'dark' ? 'rgb(15, 15, 16)' : 'rgb(248, 244, 235)')
  }
  report.checks.push({ autoMode: 'passed', keyboardFocus: 'passed', transport: 'file URL; no server or external requests' })
  assert.deepEqual(report.errors, [])
  console.log(JSON.stringify(report, null, 2))
}
finally {
  await browser.close()
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n')
}
