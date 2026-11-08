// Offline, deterministic preparation of the four approved static poses.
// Requires pngjs in NODE_PATH (asset tooling only) and workspace Playwright.
// Originals are read-only; output files are intentionally reproducible.
import { createRequire } from 'node:module'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright-chromium'

const { PNG } = createRequire(import.meta.url)('pngjs')
const sourceDir = 'media/sprites/review-v1'
const outputDir = 'packages/slidev-theme-faris/assets/illustrations'
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const originalManifest = JSON.parse(await readFile(`${sourceDir}/manifest.json`, 'utf8'))
const logoBytes = await readFile('references/zurichjs-official.png')
const logo = `data:image/png;base64,${logoBytes.toString('base64')}`
const poses = [
  { id: 'faris-speaking', mirror: false, mark: { left: 0.56, top: 0.67, width: 0.05 } },
  { id: 'faris-thinking', mirror: true, mark: { left: 0.57, top: 0.69, width: 0.05 } },
  { id: 'duck-curious', mirror: false },
  { id: 'duck-celebrating', mirror: false },
]

const manifest = {
  status: 'prepared from user-approved likenesses; final visual checkpoint',
  format: 'RGBA PNG static poses, not vectors or an animated atlas',
  approval: '2026-09-26: likenesses and deterministic cleanup/compositing approved',
  recipe: 'scripts/prepare-sprites.mjs',
  cleanup: 'Clear RGBA where source alpha < 16/255. Preserve all other pixels, except the approved thinking reflection and chest-logo composite. No resizing or cropping.',
  logo: { source: 'references/zurichjs-official.png', sha256: sha256(logoBytes), treatment: 'Original white, blue and black letterforms; yellow masked to reveal garment. Mark is never mirrored.' },
  chromium: null,
  sprites: [],
}

await mkdir(outputDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
manifest.chromium = browser.version()
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  await page.route('**/*', route => route.abort())
  for (const pose of poses) {
    const source = await readFile(`${sourceDir}/${pose.id}.png`)
    const expected = originalManifest.sprites.find(sprite => sprite.id === pose.id)
    if (sha256(source) !== expected.sha256)
      throw new Error(`Approved source changed: ${pose.id}`)
    const input = PNG.sync.read(source)
    const output = new PNG({ width: input.width, height: input.height })
    let removedLowAlphaPixels = 0
    for (let y = 0; y < input.height; y++) {
      for (let x = 0; x < input.width; x++) {
        const from = (y * input.width + x) * 4
        const to = (y * input.width + (pose.mirror ? input.width - 1 - x : x)) * 4
        if (input.data[from + 3] < 16) {
          if (input.data[from + 3] > 0) removedLowAlphaPixels++
          output.data.fill(0, to, to + 4)
        }
        else input.data.copy(output.data, to, from, from + 4)
      }
    }

    let placement = null
    if (pose.mark) {
      placement = {
        x: Math.round(input.width * pose.mark.left),
        y: Math.round(input.height * pose.mark.top),
        size: Math.round(input.width * pose.mark.width),
      }
      // Render the reviewed raster-source SVG mask once at the target pixel size.
      // This is the same mask used in the historical ShirtMark review fixture.
      await page.setViewportSize({ width: placement.size, height: placement.size })
      await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:100%;height:100%}</style>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 625 625">
          <defs>
            <filter id="ink" color-interpolation-filters="sRGB">
              <feColorMatrix type="saturate" values="0"/>
              <feComponentTransfer>
                <feFuncR type="discrete" tableValues="1 0 0 0"/>
                <feFuncG type="discrete" tableValues="1 0 0 0"/>
                <feFuncB type="discrete" tableValues="1 0 0 0"/>
              </feComponentTransfer>
            </filter>
            <mask id="mask" maskUnits="userSpaceOnUse" x="0" y="0" width="625" height="625">
              <image href="${logo}" width="625" height="625" filter="url(#ink)"/>
              <path d="M0 0H625L312.5 312.5 0 625Z" fill="white"/>
            </mask>
          </defs>
          <image href="${logo}" width="625" height="625" mask="url(#mask)"/>
        </svg>`)
      await page.evaluate(async (src) => { const img = new Image(); img.src = src; await img.decode() }, logo)
      const mark = PNG.sync.read(await page.screenshot({ omitBackground: true }))
      for (let y = 0; y < mark.height; y++) {
        for (let x = 0; x < mark.width; x++) {
          const from = (y * mark.width + x) * 4
          const to = ((y + placement.y) * output.width + x + placement.x) * 4
          const a = mark.data[from + 3] / 255
          if (!a) continue
          const b = output.data[to + 3] / 255
          const alpha = a + b * (1 - a)
          for (let channel = 0; channel < 3; channel++)
            output.data[to + channel] = Math.round((mark.data[from + channel] * a + output.data[to + channel] * b * (1 - a)) / alpha)
          output.data[to + 3] = Math.round(alpha * 255)
        }
      }
    }
    const bytes = PNG.sync.write(output)
    await writeFile(`${outputDir}/${pose.id}.png`, bytes)
    manifest.sprites.push({
      id: pose.id, file: `${pose.id}.png`, source: `${sourceDir}/${pose.id}.png`,
      sourceSha256: sha256(source), sha256: sha256(bytes), width: input.width,
      height: input.height, removedLowAlphaPixels, mirrored: pose.mirror,
      bakedLogo: placement,
    })
    console.log(`${pose.id}: cleared ${removedLowAlphaPixels} low-alpha pixels; ${placement ? 'official logo baked' : 'duck preserved'}`)
  }
  await writeFile(`${outputDir}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`)
}
finally { await browser.close() }
