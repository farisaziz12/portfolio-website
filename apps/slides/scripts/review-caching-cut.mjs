// Pixel comparison for the approved source-46 cut. Earlier evidence is read-only.
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import assert from 'node:assert/strict'

const current = path.resolve(process.argv[2])
const targeted = path.resolve(process.argv[3])
const previous = path.resolve('artifacts/reviews/caching-dark-arts/2026-10-09T11-40-13.358Z-ob36qu/screenshots')
const build = JSON.parse(await readFile(path.join(current,'report.json'),'utf8'))
assert.equal(build.status, 'passed')
assert.equal(build.states.length, 172)
const browser = await chromium.launch()
const page = await browser.newPage()
const report = { previous, current, targeted, sameOutsidePageNumber: [], needsInspection: [] }
async function compare(file, oldFile, label) {
  const images = await Promise.all([file, oldFile].map(async p => (await readFile(p)).toString('base64')))
  const difference = await page.evaluate(async images => {
    const pixels = await Promise.all(images.map(async data => {
      const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode()
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0)
      return { width: image.width, height: image.height, data: ctx.getImageData(0, 0, image.width, image.height).data }
    }))
    const [a,b] = pixels
    if (a.width !== b.width || a.height !== b.height) return -1
    let changed = 0
    for (let y = 0; y < a.height; y++) for (let x = 0; x < a.width; x++) {
      // Only the small footer number changes after the removed slide.
      if (x >= 1770 && x < 1830 && y >= 1010 && y < 1050) continue
      const p = (y * a.width + x) * 4
      if (a.data[p] !== b.data[p] || a.data[p+1] !== b.data[p+1] || a.data[p+2] !== b.data[p+2] || a.data[p+3] !== b.data[p+3]) changed++
    }
    return changed
  }, images)
  ;(difference === 0 ? report.sameOutsidePageNumber : report.needsInspection).push({ file: label, changedPixels: difference })
}
try {
  for (const file of (await readdir(path.join(current, 'screenshots'))).filter(f => f.endsWith('.png'))) {
    const [route,step] = file.slice(0,-4).split('-').map(Number)
    const old = `${String(route >= 43 ? route+1 : route).padStart(3,'0')}-${String(step).padStart(3,'0')}.png`
    await compare(path.join(current,'screenshots',file), path.join(previous,old), `full/${file}`)
  }
  const variants = { client:[44,11], bff:[71,5], query:[97,4], prefetch:[105,5] }
  for (const file of (await readdir(targeted)).filter(f => /^(client|bff|query|prefetch)-(\d+|print)\.png$/.test(f))) {
    const [variant,step] = file.slice(0,-4).split('-'), [route,last] = variants[variant]
    const old = `${String(route).padStart(3,'0')}-${String(step === 'print' ? last : step).padStart(3,'0')}.png`
    await compare(path.join(targeted,file), path.join(previous,old), `targeted/${file}`)
  }
} finally {
  await browser.close()
  await writeFile(path.join(current,'cut-visual-comparison.json'), JSON.stringify(report,null,2))
  console.log(JSON.stringify({ compared: report.sameOutsidePageNumber.length, needsInspection: report.needsInspection }))
}
