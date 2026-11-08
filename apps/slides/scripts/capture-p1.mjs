import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { chromium } from 'playwright-chromium'

const root = process.cwd()
const target = process.argv[2] ?? 'p1'
if (!['p1', 'p1-regression', 'variants', 'sprites-final'].includes(target))
  throw new Error(`Unknown review target: ${target}`)
const artifactDir = path.join(root, `artifacts/${target}`)
const outputDir = path.join(artifactDir, 'screenshots')
const isVariants = target === 'variants' || target === 'sprites-final'
const port = isVariants ? 4186 : 4173
const deck = isVariants ? 'variants' : 'showcase'
const baseUrl = `http://localhost:${port}`
const slides = !isVariants ? [
  { page: 1, name: '01-cover-light', clicks: 0 },
  { page: 2, name: '02-cover-dark', clicks: 0 },
  { page: 3, name: '03-statement-light', clicks: 1 },
  { page: 4, name: '04-statement-dark', clicks: 1 },
  { page: 5, name: '05-code-light', clicks: 2 },
  { page: 6, name: '06-code-dark', clicks: 2 },
] : [
  { page: 1, name: '01-editorial-light', clicks: 0 },
  { page: 2, name: '02-editorial-dark', clicks: 0 },
  { page: 3, name: '03-speaker-light', clicks: 0 },
  { page: 4, name: '04-speaker-dark', clicks: 0 },
  { page: 5, name: '05-section-light', clicks: 0 },
  { page: 6, name: '06-section-dark', clicks: 0 },
  { page: 7, name: '07-sprites-light', clicks: 0 },
  { page: 8, name: '08-sprites-dark', clicks: 0 },
]
const evidence = { target, status: 'running', startedAt: new Date().toISOString(), slides: [], knownWarnings: [], blockedRequests: [], failure: null }

await mkdir(outputDir, { recursive: true })

const server = spawn('pnpm', [
  'exec',
  'slidev',
  `decks/${deck}/slides.md`,
  '--port',
  String(port),
], {
  cwd: root,
  env: { ...process.env, NO_COLOR: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let serverOutput = ''
server.stdout.on('data', chunk => serverOutput += chunk.toString())
server.stderr.on('data', chunk => serverOutput += chunk.toString())

async function waitForServer() {
  const deadline = Date.now() + 90_000
  while (Date.now() < deadline) {
    if (server.exitCode !== null)
      throw new Error(`Slidev exited before capture.\n${serverOutput}`)

    try {
      const response = await fetch(baseUrl)
      if (response.ok)
        return
    }
    catch {
      // The server is still starting.
    }

    await new Promise(resolve => setTimeout(resolve, 250))
  }

  throw new Error(`Timed out waiting for Slidev.\n${serverOutput}`)
}

let browser

try {
  await waitForServer()
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  })
  await context.grantPermissions(['screen-wake-lock'], { origin: baseUrl })

  await context.route('**/*', (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost')
      route.continue()
    else {
      evidence.blockedRequests.push(url.href)
      route.abort('blockedbyclient')
    }
  })

  const page = await context.newPage()
  const runtimeErrors = []
  page.on('console', (message) => {
    // Slidev 53 installs Shiki's optional Twoslash hover client. Its current
    // FloatingVue compatibility shim reports a caught, non-fatal patch error
    // even when the deck does not enable Twoslash.
    const isKnownTwoslashNoise = message.text().startsWith('Failed to patch FloatingVue')
    if (isKnownTwoslashNoise)
      evidence.knownWarnings.push(message.text())
    if (message.type() === 'error' && !isKnownTwoslashNoise)
      runtimeErrors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', error => runtimeErrors.push(`page: ${error.message}`))

  for (const slide of slides) {
    runtimeErrors.length = 0
    await page.goto(`${baseUrl}/${slide.page}`, { waitUntil: 'networkidle' })
    const layoutSelector = `.slidev-page-${slide.page} .slidev-layout.faris-slide`
    await page.locator(layoutSelector).waitFor({ state: 'visible' }).catch(async (error) => {
      console.error({ url: page.url(), runtimeErrors, body: await page.locator('body').innerText() })
      throw error
    })
    await page.evaluate(() => document.fonts.ready)

    for (let click = 0; click < slide.clicks; click += 1) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(80)
    }

    await page.mouse.move(1919, 0)
    await page.waitForTimeout(220)

    const report = await page.evaluate(({ selector, requireMono }) => {
      const layout = document.querySelector(selector)

      if (!(layout instanceof HTMLElement))
        return { missingLayout: true }

      const brokenImages = [...layout.querySelectorAll('img')]
        .filter(image => !image.complete || image.naturalWidth === 0)
        .map(image => image.getAttribute('src'))

      const layoutRect = layout.getBoundingClientRect()
      const clippedElements = [...layout.querySelectorAll('h1, h2, h3, p, pre, img, .faris-slide__footer')]
        .filter((element) => {
          const style = getComputedStyle(element)
          const rect = element.getBoundingClientRect()
          return style.visibility !== 'hidden'
            && style.display !== 'none'
            && Number(style.opacity) > 0.01
            && rect.width > 0
            && rect.height > 0
            && (
              rect.left < layoutRect.left - 1
              || rect.top < layoutRect.top - 1
              || rect.right > layoutRect.right + 1
              || rect.bottom > layoutRect.bottom + 1
            )
        })
        .map(element => `${element.tagName.toLowerCase()}.${element.className}`)

      return {
        missingLayout: false,
        brokenImages,
        missingIllustrations: [...layout.querySelectorAll('.faris-illustration__missing')].map(element => element.textContent),
        clippedElements,
        interLoaded: document.fonts.check('16px "Inter Variable"'),
        monoLoaded: !requireMono || document.fonts.check('16px "JetBrains Mono Variable"'),
      }
    }, { selector: layoutSelector, requireMono: !isVariants && slide.page >= 5 })

    evidence.slides.push({ ...slide, report, runtimeErrors: [...runtimeErrors] })

    if (
      report.missingLayout
      || report.brokenImages?.length
      || report.missingIllustrations?.length
      || report.clippedElements?.length
      || !report.interLoaded
      || !report.monoLoaded
      || runtimeErrors.length
    ) {
      throw new Error(`Validation failed for ${slide.name}:\n${JSON.stringify({ report, runtimeErrors }, null, 2)}`)
    }

    await page.screenshot({
      path: path.join(outputDir, `${slide.name}.png`),
      fullPage: false,
    })
    console.log(`captured ${slide.name}.png`)
  }
  evidence.status = 'passed'
}
catch (error) {
  evidence.status = 'failed'
  evidence.failure = String(error)
  throw error
}
finally {
  await browser?.close()
  server.kill('SIGTERM')
  await writeFile(path.join(artifactDir, 'report.json'), JSON.stringify(evidence, null, 2))
}
