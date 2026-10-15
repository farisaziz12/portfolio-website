import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-chromium'
import { startDeck } from './slidev.mjs'

// Evaluated in the real browser, not a mock of Slidev's rendering.
export function measureSlide(selector) {
  const layout = document.querySelector(selector)
  if (!(layout instanceof HTMLElement)) return ['Active Faris layout missing']
  const failures = []
  const bounds = layout.getBoundingClientRect()
  const visible = element => {
    for (let current = element; current && current !== layout.parentElement; current = current.parentElement) {
      const style = getComputedStyle(current)
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.01) return false
    }
    return element.getBoundingClientRect().width > 0
  }
  const describe = element => `${element.tagName.toLowerCase()}: ${(element.textContent || element.getAttribute('alt') || '').trim().slice(0, 90)}`
  const outside = rect => rect.left < bounds.left - 1 || rect.top < bounds.top - 1 || rect.right > bounds.right + 1 || rect.bottom > bounds.bottom + 1
  for (const image of layout.querySelectorAll('img'))
    if (!image.complete || !image.naturalWidth) failures.push(`Broken image: ${image.getAttribute('src')}`)
  for (const video of layout.querySelectorAll('video')) {
    if (video.error) failures.push(`Video error: ${video.error.message}`)
    if (video.readyState < 2) failures.push('Video first frame is not ready')
    if (!video.poster) failures.push('Video poster is missing')
  }
  for (const placeholder of layout.querySelectorAll('.faris-illustration__missing')) failures.push(placeholder.textContent.trim())
  for (const element of layout.querySelectorAll('h1,h2,h3,p,li,pre,img,svg,.faris-slide__footer')) {
    if (!visible(element)) continue
    if (outside(element.getBoundingClientRect())) failures.push(`Outside slide: ${describe(element)}`)
    if (element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 2)
      failures.push(`Horizontal overflow: ${describe(element)}`)
  }
  // Element boxes can fit while an unbreakable text run escapes them.
  const walker = document.createTreeWalker(layout, NodeFilter.SHOW_TEXT)
  let hasVisibleText = false
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.textContent.trim() || !visible(node.parentElement) || node.parentElement.closest('script,style,video')) continue
    const range = document.createRange()
    range.selectNodeContents(node)
    if ([...range.getClientRects()].some(rect => rect.width > 0 && rect.height > 0)) hasVisibleText = true
    if (node.parentElement.closest('svg')) continue
    if ([...range.getClientRects()].some(outside)) failures.push(`Text outside slide: ${node.textContent.trim().slice(0, 90)}`)
  }
  for (const code of layout.querySelectorAll('pre code'))
    if (visible(code) && parseFloat(getComputedStyle(code).fontSize) < 20) failures.push('Code below 20 logical pixels')
  // Bounding boxes can remain inside the canvas while a tall code block
  // covers the title, caption or footer. Compare these independent regions.
  const overlaps = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1
  const protectedRegions = [...layout.querySelectorAll('header,.faris-slide__footer,.payments-caption')]
    .filter(element => visible(element) && element.textContent.trim())
  for (const block of layout.querySelectorAll('pre')) {
    if (!visible(block)) continue
    for (const region of protectedRegions)
      if (overlaps(block.getBoundingClientRect(), region.getBoundingClientRect())) failures.push(`Code overlaps ${describe(region)}`)
  }
  const fontReady = family => [...document.fonts].some(face => face.family.replace(/["']/g, '') === family && face.status === 'loaded')
  // A video-only slide has no DOM text and need not fetch a text font.
  const textFont = layout.classList.contains('website-skin') ? 'Figtree Variable' : 'Inter Variable'
  if (hasVisibleText && !fontReady(textFont)) failures.push(`${textFont} is not ready`)
  if (layout.querySelector('pre') && !fontReady('JetBrains Mono Variable')) failures.push('Monospace font is not ready')
  return [...new Set(failures)]
}

export async function reviewDeck(entry, directory, report) {
  let server, browser
  report.states = []
  report.navigation = []
  report.knownWarnings = []
  report.runtimeErrors = []
  report.blockedRequests = []
  report.httpFailures = []
  report.visualReview = 'pending human inspection; machine pass is not approval'
  let active = { slide: 0, click: 0 }
  const stop = () => { void browser?.close(); void server?.close() }
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  try {
    server = await startDeck(entry)
    browser = await chromium.launch({ headless: true })
    report.browser = browser.version()
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light', serviceWorkers: 'block' })
    await context.grantPermissions(['screen-wake-lock'], { origin: server.url })
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin === server.url) return route.continue()
      report.blockedRequests.push({ ...active, url: route.request().url() })
      return route.abort('blockedbyclient')
    })
    await context.routeWebSocket('**/*', route => {
      const url = new URL(route.url())
      if (url.host === new URL(server.url).host) return route.connectToServer()
      report.blockedRequests.push({ ...active, url: route.url() })
      route.close({ code: 1008, reason: 'External origin blocked during review' })
    })
    const page = await context.newPage()
    page.on('console', message => {
      if (message.text().startsWith('Failed to patch FloatingVue')) report.knownWarnings.push({ ...active, message: message.text() })
      else if (message.type() === 'error') report.runtimeErrors.push({ ...active, message: message.text() })
    })
    page.on('pageerror', error => report.runtimeErrors.push({ ...active, message: error.message }))
    page.on('response', response => {
      if (response.status() >= 400) report.httpFailures.push({ ...active, status: response.status(), url: response.url() })
    })
    await mkdir(path.join(directory, 'screenshots'))
    // Streaming video can keep the network busy; readiness is asserted below.
    await page.goto(`${server.url}/1`, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => Number.isInteger(window.__slidev__?.nav?.total))
    const total = await page.evaluate(() => window.__slidev__.nav.total)
    if (total < 1 || total > 200) throw new Error(`Review supports 1-200 slides, received ${total}`)
    report.slideCount = total
    let count = 0

    const waitState = async (slide, click) => {
      await page.waitForFunction(({ slide, click }) => {
        const nav = window.__slidev__?.nav
        return nav?.currentSlideNo === slide && nav?.clicks === click
      }, { slide, click }, { timeout: 5000 })
      // Navigation state can update before an async slide component mounts.
      // Wait for the layout before querying its images/videos: an empty list
      // would otherwise pass the readiness predicate prematurely.
      await page.locator(`.slidev-page-${slide} .slidev-layout.faris-slide`).waitFor({ state: 'visible' })
      await page.evaluate(async () => {
        await document.fonts.ready
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})))
      })
      await page.waitForFunction(slide => [...document.querySelectorAll(`.slidev-page-${slide} video`)]
        .every(video => video.error || (video.readyState >= 4 && !video.seeking)), slide, { timeout: 15000 })
      await page.evaluate(async slide => {
        await Promise.all([...document.querySelectorAll(`.slidev-page-${slide} video[poster]`)].map(async video => {
          const image = new Image()
          image.src = video.poster
          await image.decode()
        }))
      }, slide)
      // Native media controls finish their loading-indicator animation after
      // readyState changes; allow it to settle without playing or hiding it.
      const hasVideo = await page.locator(`.slidev-page-${slide} video`).count()
      await page.waitForTimeout(hasVideo ? 2000 : 220)
    }

    for (let slide = 1; slide <= total; slide++) {
      active = { slide, click: 0 }
      await page.goto(`${server.url}/${slide}?clicks=0`, { waitUntil: 'domcontentloaded' })
      await waitState(slide, 0)
      const selector = `.slidev-page-${slide} .slidev-layout.faris-slide`
      await page.locator(selector).waitFor({ state: 'visible' })
      const maximum = await page.evaluate(() => window.__slidev__.nav.clicksTotal)
      if (!Number.isInteger(maximum) || maximum < 0 || maximum > 100) throw new Error(`Slide ${slide}: unsupported click count ${maximum}`)
      for (let click = 0; click <= maximum; click++) {
        if (++count > 1000) throw new Error('Review exceeded 1000 states; split this deck for review.')
        active = { slide, click }
        if (click) { await page.keyboard.press('ArrowRight'); await waitState(slide, click) }
        await page.mouse.move(1919, 0)
        const failures = await page.evaluate(measureSlide, selector)
        const screenshot = `screenshots/${String(slide).padStart(3, '0')}-${String(click).padStart(3, '0')}.png`
        await page.screenshot({ path: path.join(directory, screenshot) })
        report.states.push({ slide, click, screenshot, failures })
        console.log(`${report.deck}: slide ${slide}/${total}, click ${click}/${maximum}${failures.length ? ' FAILED' : ''}`)
      }
      for (let click = maximum - 1; click >= 0; click--) {
        active = { slide, click }
        await page.keyboard.press('ArrowLeft')
        await waitState(slide, click)
        report.navigation.push({ slide, click, direction: 'back', status: 'passed' })
      }
      if (slide < total) {
        for (let click = 1; click <= maximum; click++) { await page.keyboard.press('ArrowRight'); await waitState(slide, click) }
        active = { slide: slide + 1, click: 0 }
        await page.keyboard.press('ArrowRight')
        await waitState(slide + 1, 0)
        await page.keyboard.press('ArrowLeft')
        await waitState(slide, maximum)
        report.navigation.push({ slide, direction: 'next-slide-and-back', status: 'passed' })
      }
    }
    if (report.states.some(state => state.failures.length) || report.runtimeErrors.length || report.blockedRequests.length || report.httpFailures.length)
      throw new Error('Browser review found failures. See per-slide/click findings and network/runtime failures in report.json.')
  }
  catch (error) {
    report.failureState = { ...active }
    throw new Error(`Slide ${active.slide}, click ${active.click}: ${error.message}`, { cause: error })
  }
  finally {
    process.off('SIGINT', stop)
    process.off('SIGTERM', stop)
    await browser?.close()
    await server?.close()
  }
}
