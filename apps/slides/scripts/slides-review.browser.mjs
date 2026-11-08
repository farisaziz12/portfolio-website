import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium } from 'playwright-chromium'
import { measureSlide } from './slides/review.mjs'

test('browser quality checks distinguish healthy content, hidden reveals and actual defects', async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
    await page.setContent(`<style>
      body { margin: 0 } .faris-slide { width:1280px;height:720px;padding:64px;box-sizing:border-box }
      pre code {font-size:24px} .hidden {visibility:hidden;position:absolute;left:2000px}
      </style><main class="faris-slide"><h1>A useful slide</h1><pre><code>const answer = 42</code></pre>
      <div class="hidden"><p>Not revealed yet</p></div></main>`)
    await page.evaluate(async () => {
      for (const family of ['Inter Variable', 'JetBrains Mono Variable']) {
        const face = new FontFace(family, 'local("Arial")')
        await face.load()
        document.fonts.add(face)
      }
    })
    assert.deepEqual(await page.evaluate(measureSlide, '.faris-slide'), [])
    await page.evaluate(() => {
      const pre = document.querySelector('pre')
      const rect = pre.getBoundingClientRect()
      document.querySelector('main').insertAdjacentHTML('beforeend', `<header style="position:absolute;left:${rect.left}px;top:${rect.top}px">Collision probe</header>`)
    })
    assert.ok((await page.evaluate(measureSlide, '.faris-slide')).some(text => text.includes('Code overlaps header: Collision probe')))
    await page.locator('header').evaluate(element => element.remove())
    await page.locator('main').evaluate(element => element.insertAdjacentHTML('beforeend', '<video aria-label="Unprepared video probe"></video>'))
    const videoFailures = await page.evaluate(measureSlide, '.faris-slide')
    assert.ok(videoFailures.includes('Video first frame is not ready'))
    assert.ok(videoFailures.includes('Video poster is missing'))
    await page.locator('video').evaluate(element => element.remove())
    await page.evaluate(() => {
      const layout = document.querySelector('main')
      layout.insertAdjacentHTML('beforeend', '<p style="position:absolute;left:1800px">Overflow probe</p><img src="data:image/png;base64,broken" alt="Broken image probe"><span class="faris-illustration__missing">Unavailable illustration: probe</span>')
      document.querySelector('code').style.fontSize = '12px'
      document.fonts.clear()
    })
    const failures = await page.evaluate(measureSlide, '.faris-slide')
    assert.ok(failures.some(text => text.includes('Outside slide: p: Overflow probe')))
    assert.ok(failures.some(text => text.startsWith('Broken image:')))
    assert.ok(failures.includes('Unavailable illustration: probe'))
    assert.ok(failures.includes('Code below 20 logical pixels'))
    assert.ok(failures.includes('Inter is not ready'))
    assert.ok(failures.includes('Monospace font is not ready'))
    assert.ok(!failures.some(text => text.includes('Not revealed yet')))
    await page.locator('main').evaluate(element => { element.innerHTML = '<video><p>Browser fallback text</p></video>' })
    const videoOnlyFailures = await page.evaluate(measureSlide, '.faris-slide')
    assert.ok(!videoOnlyFailures.includes('Inter is not ready'), 'No text font required on video-only slides')
    assert.ok(videoOnlyFailures.includes('Video first frame is not ready'))
    assert.ok(videoOnlyFailures.includes('Video poster is missing'))
  }
  finally { await browser.close() }
})
