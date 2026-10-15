import path from 'node:path'
import { createRequire } from 'node:module'
import { mkdir, readFile, readdir, stat } from 'node:fs/promises'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './review.mjs'
import { slidevCli } from './slidev.mjs'

const cliRequire = createRequire(slidevCli)

// Serve the static build at its real base path, as a host would, then visit
// every slide by hash URL. Checks media paths, notes removal and file sizes;
// click states and presenter flow stay with `pnpm slides review`.
export async function checkSite(entry, web, base, directory, report) {
  const { preview } = await import(cliRequire.resolve('vite'))
  const { parse } = await import(cliRequire.resolve('@slidev/parser'))
  report.states = []
  report.runtimeErrors = []
  report.blockedRequests = []
  report.httpFailures = []
  report.visualReview = 'pending human inspection; machine pass is not approval'

  const files = []
  const walk = async folder => {
    for (const item of await readdir(folder, { withFileTypes: true })) {
      const file = path.join(folder, item.name)
      if (item.isDirectory()) await walk(file)
      else files.push({ file: path.relative(web, file), bytes: (await stat(file)).size })
    }
  }
  await walk(web)
  report.site = { base, files: files.length, totalBytes: files.reduce((sum, file) => sum + file.bytes, 0), largest: files.sort((a, b) => b.bytes - a.bytes).slice(0, 5) }
  // 25 MB is the smallest common static-host per-file limit (Cloudflare Pages).
  const oversized = files.filter(file => file.bytes > 25 * 1024 * 1024)
  if (oversized.length) throw new Error(`Files too large to host: ${oversized.map(file => file.file).join(', ')}`)

  const { slides } = await parse(await readFile(entry, 'utf8'))
  const text = (await Promise.all(files.filter(file => /\.(?:js|html|json)$/.test(file.file)).map(file => readFile(path.join(web, file.file), 'utf8')))).join('\n')
  const leaked = slides.map(slide => slide.note?.trim().split('\n')[0].slice(0, 60)).filter(line => line && line.length > 20 && text.includes(line))
  if (leaked.length) throw new Error(`Speaker notes found in the build: ${leaked[0]}`)
  report.stages.push('speaker notes absent from build')

  let server, browser
  let active = { slide: 0 }
  try {
    server = await preview({ configFile: false, base, logLevel: 'warn', build: { outDir: web }, preview: { host: '127.0.0.1', port: 0, strictPort: true, open: false } })
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, reducedMotion: 'reduce', serviceWorkers: 'block' })
    await context.grantPermissions(['screen-wake-lock'], { origin })
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin === origin) return route.continue()
      report.blockedRequests.push({ ...active, url: route.request().url() })
      return route.abort('blockedbyclient')
    })
    const page = await context.newPage()
    page.on('console', message => {
      if (message.type() === 'error' && !message.text().startsWith('Failed to patch FloatingVue')) report.runtimeErrors.push({ ...active, message: message.text() })
    })
    page.on('pageerror', error => report.runtimeErrors.push({ ...active, message: error.message }))
    page.on('response', response => {
      if (response.status() >= 400) report.httpFailures.push({ ...active, status: response.status(), url: response.url() })
    })
    await mkdir(path.join(directory, 'screenshots'))
    // Production builds do not expose window.__slidev__; count from the source.
    const total = slides.filter(slide => !slide.frontmatter.hide && !slide.frontmatter.disabled).length
    report.slideCount = total
    for (let slide = 1; slide <= total; slide++) {
      active = { slide }
      // A fresh load per slide proves every deep link works without host rewrites.
      await page.goto(`${origin}${base}#/${slide}?clicks=0`, { waitUntil: 'domcontentloaded' })
      const selector = `.slidev-page-${slide} .slidev-layout.faris-slide`
      await page.locator(selector).waitFor({ state: 'visible', timeout: 15000 })
      await page.evaluate(async () => {
        await document.fonts.ready
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})))
      })
      await page.waitForFunction(slide => [...document.querySelectorAll(`.slidev-page-${slide} video`)]
        .every(video => video.error || video.readyState >= 2), slide, { timeout: 15000 })
      await page.mouse.move(1919, 0)
      const failures = await page.evaluate(measureSlide, selector)
      const screenshot = `screenshots/${String(slide).padStart(3, '0')}.png`
      await page.screenshot({ path: path.join(directory, screenshot) })
      report.states.push({ slide, click: 0, screenshot, failures })
      console.log(`${report.deck}: site slide ${slide}/${total}${failures.length ? ' FAILED' : ''}`)
    }
    if (report.states.some(state => state.failures.length) || report.runtimeErrors.length || report.blockedRequests.length || report.httpFailures.length)
      throw new Error('Static site check found failures. See report.json.')
  }
  catch (error) {
    throw new Error(`Slide ${active.slide}: ${error.message}`, { cause: error })
  }
  finally {
    await browser?.close()
    await server?.close()
  }
}
