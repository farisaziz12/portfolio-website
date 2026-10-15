import { chromium } from 'playwright-chromium'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { startDeck } from './slides/slidev.mjs'

const deck = fileURLToPath(new URL('../decks/caching-dark-arts/', import.meta.url))
let server, browser
try {
  server = await startDeck(`${deck}slides.md`)
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ serviceWorkers: 'block' })
  await context.grantPermissions(['screen-wake-lock'], { origin: server.url })
  await context.route('**/*', route => new URL(route.request().url()).origin === server.url ? route.continue() : route.abort())
  const page = await context.newPage()
  await page.goto(server.url, { waitUntil: 'networkidle' })
  const results = []
  for (const number of [1, 2, 3]) {
    const data = await page.evaluate(async ({ number, base }) => {
      const video = document.createElement('video')
      video.muted = true
      video.preload = 'auto'
      video.src = `${base}/media/demo-${number}.mp4`
      const wait = event => new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Video ${number} ${event} timeout`)), 30000)
        video.addEventListener(event, () => { clearTimeout(timeout); resolve() }, { once: true })
        video.addEventListener('error', () => { clearTimeout(timeout); reject(new Error(`Video ${number} decode error: ${video.error?.message}`)) }, { once: true })
      })
      await wait('loadeddata')
      const seconds = 1
      const sought = wait('seeked')
      video.currentTime = seconds
      await sought
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)
      const result = { number, seconds, duration: video.duration, width: video.videoWidth, height: video.videoHeight, data: canvas.toDataURL('image/jpeg', 0.94) }
      result.printSeconds = { 1: 15, 2: 7, 3: 12 }[number]
      const printSought = wait('seeked')
      video.currentTime = result.printSeconds
      await printSought
      canvas.getContext('2d').drawImage(video, 0, 0)
      result.printData = canvas.toDataURL('image/jpeg', 0.94)
      video.removeAttribute('src')
      video.load()
      return result
    }, { number, base: server.url })
    await writeFile(`${deck}public/media/demo-${number}-poster.jpg`, Buffer.from(data.data.split(',')[1], 'base64'))
    await writeFile(`${deck}public/media/demo-${number}-print.jpg`, Buffer.from(data.printData.split(',')[1], 'base64'))
    delete data.data
    delete data.printData
    results.push(data)
    console.log(data)
  }
  await writeFile(`${deck}migration/posters.json`, JSON.stringify({ browser: browser.version(), method: 'Decoded original recording, JPEG at one second for playback; visually selected print frames at 15/7/12 seconds; no artwork generation', videos: results }, null, 2) + '\n')
}
finally { await browser?.close(); await server?.close() }
