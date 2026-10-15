// Focused production media evidence. Use after the named-deck review build.
import { chromium } from 'playwright-chromium'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
const require = createRequire(import.meta.url)
const cliRequire = createRequire(require.resolve('@slidev/cli/bin/slidev.mjs'))
const { preview } = await import(cliRequire.resolve('vite'))
const input = path.resolve(process.argv[2] || '')
const buildReport = JSON.parse(await readFile(path.join(input, 'report.json'), 'utf8'))
assert.equal(buildReport.deck, 'caching-dark-arts')
assert.equal(buildReport.status, 'passed')
const output = path.join(input, `media-${new Date().toISOString().replaceAll(':', '-')}`)
await mkdir(output)
const report = { status: 'running', build: input, videos: [], errors: [], blockedRequests: [], knownWarnings: [], checks: [] }
let server, browser
try {
  server = await preview({ configFile: false, root: input, build: { outDir: 'web' }, preview: { host: '127.0.0.1', port: 0, open: false } })
  const base = `http://127.0.0.1:${server.httpServer.address().port}`
  browser = await chromium.launch({ headless: true })
  report.browser = browser.version()
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce', serviceWorkers: 'block' })
  await context.grantPermissions(['screen-wake-lock'], { origin: base })
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === base) return route.continue()
    report.blockedRequests.push(route.request().url()); return route.abort()
  })
  await context.routeWebSocket('**/*', socket => { report.blockedRequests.push(socket.url()); socket.close() })
  context.on('page', page => {
    page.on('pageerror', error => report.errors.push(error.message))
    page.on('console', message => {
      if (message.text().startsWith('Failed to patch FloatingVue')) report.knownWarnings.push(message.text())
      else if (message.type() === 'error') report.errors.push(message.text())
    })
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`) })
  })
  const page = await context.newPage()
  for (const [number, slide] of [[1, 50], [2, 82], [3, 114]]) {
    await page.goto(`${base}/${slide - 1}`, { waitUntil: 'domcontentloaded' })
    assert.equal(await page.locator(`.slidev-page-${slide - 1} h1`).innerText(), `Demo ${number}`)
    await page.goto(`${base}/${slide}`, { waitUntil: 'domcontentloaded' })
    const video = page.locator(`.slidev-page-${slide} video`)
    await video.waitFor({ state: 'visible' })
    await video.evaluate(video => new Promise((resolve, reject) => {
      if (video.readyState >= 2) return resolve()
      const timeout = setTimeout(() => reject(new Error('Video data timeout')), 15000)
      video.addEventListener('loadeddata', () => { clearTimeout(timeout); resolve() }, { once: true })
      video.load()
    }))
    const initial = await video.evaluate(v => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight, controls: v.controls, paused: v.paused, error: v.error?.message, poster: v.poster }))
    assert.ok(initial.controls && initial.paused && !initial.error && initial.duration > 0)
    const geometry = await video.evaluate(v => {
      const rect = v.getBoundingClientRect()
      const layout = v.closest('.slidev-layout')
      const bounds = layout.getBoundingClientRect()
      return { width: rect.width, height: rect.height, fullCanvas: ['left', 'top', 'right', 'bottom'].every(edge => Math.abs(rect[edge] - bounds[edge]) < 1), objectFit: getComputedStyle(v).objectFit, chromeCount: layout.querySelectorAll('h1,header,footer,.faris-slide__footer').length }
    })
    assert.ok(geometry.fullCanvas && geometry.width >= 1919 && geometry.height >= 1079)
    assert.equal(geometry.objectFit, 'contain')
    assert.equal(geometry.chromeCount, 0)
    await page.mouse.click(1850, 40)
    await video.evaluate(v => v.play())
    await page.waitForTimeout(750)
    assert.ok(await video.evaluate(v => !v.paused && v.currentTime > 0.2))
    await video.evaluate(v => v.pause())
    const seek = initial.duration / 2
    await video.evaluate((v, seek) => new Promise(resolve => { v.addEventListener('seeked', resolve, { once: true }); v.currentTime = seek }), seek)
    assert.ok(Math.abs(await video.evaluate(v => v.currentTime) - seek) < 0.2)
    await page.mouse.move(1919, 0)
    await page.screenshot({ path: path.join(output, `demo-${number}-midpoint.png`) })
    const handle = await video.elementHandle()
    await video.evaluate(v => v.play())
    await page.keyboard.press(slide === 125 ? 'ArrowLeft' : 'ArrowRight')
    await page.waitForTimeout(600)
    assert.equal(await handle.evaluate(v => v.paused), true, 'Leaving a slide pauses its video')
    await page.keyboard.press(slide === 125 ? 'ArrowRight' : 'ArrowLeft')
    await video.waitFor({ state: 'visible' })
    assert.equal(await video.evaluate(v => v.paused), true, 'Returning does not autoplay')
    report.videos.push({ number, slide, ...initial, geometry, seek, playback: 'passed', seekCheck: 'passed', pauseOnLeave: 'passed', returnPaused: 'passed' })
  }
  await page.goto(`${base}/overview`, { waitUntil: 'domcontentloaded' })
  await page.locator('video').first().waitFor({ state: 'attached' })
  assert.ok(await page.locator('video').count())
  assert.equal(await page.locator('video').evaluateAll(videos => videos.every(v => v.paused && !v.controls)), true)
  report.checks.push('Overview videos are paused without controls')
  await page.screenshot({ path: path.join(output, 'overview.png') })
  await page.goto(`${base}/presenter/50`, { waitUntil: 'domcontentloaded' })
  const presenterVideo = page.locator('video[controls]').first()
  await presenterVideo.waitFor({ state: 'visible' })
  await page.waitForFunction(() => [...document.querySelectorAll('video[controls]')].some(v => v.readyState >= 2 && !v.seeking))
  assert.equal(await presenterVideo.evaluate(v => v.paused), true)
  assert.ok((await page.locator('body').innerText()).includes('Playback recovery'))
  report.checks.push('Presenter current video controls and recovery notes visible; no autoplay')
  await page.screenshot({ path: path.join(output, 'presenter.png') })
  const audience = await context.newPage()
  await audience.goto(`${base}/50`, { waitUntil: 'domcontentloaded' })
  await audience.locator('.slidev-page-50 video').waitFor({ state: 'visible' })
  await page.mouse.click(1850, 40)
  await presenterVideo.evaluate(v => v.play())
  await page.waitForTimeout(700)
  const audiencePaused = await audience.locator('.slidev-page-50 video').evaluate(v => v.paused)
  report.presenterPlaybackSync = { audiencePausedWhilePresenterPlays: audiencePaused, recommendation: 'Operate playback in the audience window; presenter and audience videos are independent native elements.' }
  await presenterVideo.evaluate(v => v.pause())
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.blockedRequests, [])
  report.status = 'passed'
}
catch (error) { report.status = 'failed'; report.failure = error.stack; process.exitCode = 1 }
finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(`Media ${report.status}: ${output}`)
  if (report.failure) console.error(report.failure)
  await browser?.close()
  await new Promise(resolve => server ? server.httpServer.close(resolve) : resolve())
}
