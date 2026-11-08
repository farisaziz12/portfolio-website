import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const cliRequire = createRequire(require.resolve('@slidev/cli/bin/slidev.mjs'))
const { parse } = await import(cliRequire.resolve('@slidev/parser'))
const deck = new URL('../decks/caching-dark-arts/', import.meta.url)
const markdown = await readFile(new URL('slides.md', deck), 'utf8')
const { slides } = await parse(markdown)
const bySource = number => slides.find(slide => slide.frontmatter.sourceSlide === number || slide.frontmatter.summarizesSources?.includes(number))
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const webMedia = JSON.parse(await readFile(new URL('migration/web-media.json', deck), 'utf8')).outputs
// Extracted originals that were replaced by web copies now live outside public/.
const extracted = recordedPath => {
  const web = webMedia.find(output => output.path.replace(/\.\w+$/, '') === recordedPath.replace(/\.\w+$/, ''))
  return web ? new URL(`../../${web.original}`, deck) : new URL(recordedPath, deck)
}
// Raw recordings (media/source-video/) are gitignored, so a fresh clone or CI
// has only the web copies. Check their hashes wherever they are present.
const missingOriginal = (url, t) => {
  if (existsSync(url)) return false
  t.diagnostic(`raw original not present, hash check skipped: ${url.pathname}`)
  return true
}

test('caching is dark-first without depending on the operating system', () => {
  assert.equal(slides[0].frontmatter.colorSchema, 'dark')
  assert.equal(slides[0].frontmatter.themeConfig.farisMode, 'dark')
  for (const slide of slides) assert.equal(slide.frontmatter.faris?.mode ?? slides[0].frontmatter.themeConfig.farisMode, 'dark')
})

test('dark diagram roles contrast with the canvas and their focus surfaces', () => {
  const luminance = hex => {
    const values = hex.match(/\w\w/g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722
  }
  for (const [ink, wash] of [['68bce3','172d38'], ['f4c63a','332b16'], ['81cbb0','1b3028'], ['f4ac72','392719']]) {
    for (const background of ['0f0f10', wash])
      assert.ok((luminance(ink) + .05) / (luminance(background) + .05) >= 4.5)
  }
})

test('caching copy uses Start Case and the user-confirmed mileage', () => {
  assert.equal(slides[4].content.trim(), '# **620,000 Miles**')
  for (const slide of slides) {
    if (slide.frontmatter.sourceSlide === 15) {
      assert.equal(slide.content.trim(), '# What challenges do developers face in creating a seamless user experience due to **complex data fetching** and **management**?')
      continue
    }
    const headings = slide.content.replace(/```[\s\S]*?```/g, '').match(/^#+ .+$/gm) || []
    for (const heading of headings) {
      const text = heading.replace(/<[^>]*>/g, ' ')
      const words = text.match(/[A-Za-z][A-Za-z0-9]*(?:['’.][A-Za-z0-9]+)*/g) || []
      for (const word of words)
        assert.ok(/^[A-Z]/.test(word) || ['ms', 's'].includes(word), `Slide ${slide.frontmatter.sourceSlide}: ${word}`)
    }
  }
  assert.match(bySource(100).content, /TanStack Query/)
})

test('caching audience copy: no migration commentary and distinct biography items', async () => {
  for (const slide of slides) {
    assert.doesNotMatch(slide.content, /preserved from|original source|source (?:figure|framing|statistic|comparison|ingress|ranges|response)|need(?:s)? (?:review|verification)|not independently verified|caching-review-note/i)
  }
  const bio = slides[1]
  assert.equal(bio.frontmatter.class, 'caching-bio-slide')
  for (const item of ['Connected TV', 'Monetization & Growth', 'FinTech', 'Fitness Tech', 'Web Performance', 'Engineering Leadership'])
    assert.ok(bio.content.includes(`<li>${item}</li>`))
  assert.match(bio.content, /Community & Open Source/)
  const css = await readFile(new URL('style.css', deck), 'utf8')
  assert.match(css, /caching-bio img[^}]*width: calc\(100% \/ 3\)[^}]*height: 100%[^}]*object-fit: cover/)
})

test('caching real-world photo fills an unframed slide', () => {
  const photo = slides[3]
  assert.equal(photo.frontmatter.layout, 'none')
  assert.match(photo.frontmatter.class, /caching-photo/)
  assert.match(photo.content, /src="\/media\/traffic.png"/)
  assert.doesNotMatch(photo.content, /^#|::title::|::caption::/m)
})

test('caching real-world results use three full-canvas images without text', () => {
  assert.match(bySource(115).content, /What About<br>\*\*Real-World\*\* Results/)
  for (const [index, file] of ['in-flight-demo.jpg', 'flight-map.jpg', 'flight-speedtest.png'].entries()) {
    const slide = bySource(116 + index)
    assert.equal(slide.frontmatter.layout, 'none')
    assert.match(slide.frontmatter.class, /caching-photo/)
    assert.ok(slide.content.includes(`src="/media/${file}"`))
    assert.equal(slide.content.replace(/<img[^>]*>/g, '').trim(), '')
  }
})

test('caching migration: source emphasis and non-blocking native motion', () => {
  assert.equal(slides[0].frontmatter.transition, 'view-transition')
  for (const [number, highlighted] of [[8, 'Stable'], [16, 'Optimal'], [68, 'Initial Congestion Window'], [107, 'Server']])
    assert.ok(bySource(number).content.includes(`**${highlighted}**`), `Source ${number} retains emphasis`)
  assert.equal(slides.filter(slide => slide.frontmatter.clicks).length, 27)
})

test('performance explanations use native clicks with matching presenter cues', () => {
  assert.equal(bySource(96).frontmatter.clicks, 2)
  assert.equal((bySource(96).note.match(/\[click\]/g) || []).length, 2)
  assert.match(bySource(96).content, /ProxyCapacity host="lambda"/)
  assert.match(bySource(97).content, /ProxyCapacity host="ec2"/)
  for (const [source, clicks] of [[20,1],[21,2],[22,1],[65,1],[66,1],[67,4],[80,2],[85,1],[86,1],[87,1],[89,1],[90,1],[91,1],[93,1],[94,1],[103,3],[107,3]]) {
    const slide = bySource(source)
    assert.equal(slide.frontmatter.clicks, clicks)
    assert.match(slide.content, /:step="\$clicks"/)
    assert.equal((slide.note.match(/\[click\]/g) || []).length, clicks)
  }
})

test('ingress and egress use the BFF perspective without adding routes', () => {
  assert.match(bySource(93).content, /<BoundaryTraffic direction="ingress" :step="\$clicks"/)
  assert.match(bySource(94).content, /<BoundaryTraffic direction="egress" :step="\$clicks"/)
  assert.match(bySource(93).content, /Into<\/strong> The BFF/)
  assert.match(bySource(94).content, /Out Of<\/strong> The BFF/)
  assert.match(bySource(94).note, /direction from the BFF's perspective/)
  assert.equal(slides.reduce((total, slide) => total + 1 + (slide.frontmatter.clicks || 0), 0), 170)
})

test('caching migration: 109 slides preserve approved cuts and consolidated content', () => {
  assert.equal(slides.length, 109)
  assert.deepEqual(slides.flatMap(slide => slide.frontmatter.summarizesSources || [slide.frontmatter.sourceSlide]).filter(n => n !== undefined).sort((a,b) => a-b), Array.from({ length: 125 }, (_, i) => i + 1).filter(n => ![25, 26, 27, 46, 61, 98, 99].includes(n)))
  assert.equal(slides[83].frontmatter.sourceSlide, 97)
  assert.equal(slides[84].frontmatter.sourceSlide, 100)
  assert.equal(slides[23].frontmatter.sourceSlide, 24)
  assert.equal(slides[24].content.trim(), '# API Types')
  assert.ok(slides.some(slide => slide.frontmatter.faris?.mode === 'dark'))
  assert.ok(slides.every(slide => slide.frontmatter.faris?.mode !== 'light'))
})

test('Demo 1 summary preserves six distinct facts and their caveats', () => {
  const slide = bySource(51)
  assert.deepEqual(slide.frontmatter.summarizesSources, [51,52,53,54,55,56])
  assert.equal(slide.frontmatter.class, 'solution-summary')
  assert.equal((slide.content.match(/<section class="solution-fact /g) || []).length, 6)
  assert.match(slide.content, /<strong>~1.58 MB<\/strong>/)
  for (const text of ['80% Unused','5</b> Parallel','Custom','None','Staleness','Browser']) assert.ok(slide.content.includes(text))
  for (const text of ['memoization','HTTP caching','not optimized','maintenance']) assert.ok(slide.note.includes(text))
  assert.equal(slides[46], slide)
  assert.equal(slides[47].frontmatter.sourceSlide, 57)
})

test('BFF summary follows Demo 2 and distinguishes improvements from remaining work', () => {
  const slide = bySource(83)
  assert.equal(slides[slides.indexOf(slide)-1].frontmatter.sourceSlide,82)
  assert.deepEqual(slide.frontmatter.summarizesSources,[77,78,79,83])
  assert.match(slide.content, /Current State: \*\*BFF/)
  assert.match(slide.content, /<strong>~300 Bytes<\/strong>/)
  assert.equal((slide.content.match(/<section class="solution-fact /g)||[]).length,6)
  for(const phrase of ['5 Upstream Requests Remain','Custom Retry','Shared State And Staleness','No Application Cache','UI And Mapping Code Separated']) assert.ok(slide.content.includes(phrase))
})

test('Query summary preserves the BFF and makes cache-hit requests conditional', () => {
  const slide = bySource(105)
  assert.deepEqual(slide.frontmatter.summarizesSources, [102,104,105])
  assert.equal(slides[slides.indexOf(slide)-1].frontmatter.sourceSlide, 103)
  assert.match(slide.content, /Current State: \*\*BFF \+ TanStack Query/)
  assert.equal((slide.content.match(/<section class="solution-fact /g)||[]).length,6)
  for (const phrase of ['On A Fresh Hit','Otherwise, 1 To The Proxy','Built-In Retries','Control Refetching','Query Manages It','In The Proxy']) assert.ok(slide.content.includes(phrase))
  assert.match(slide.note, /upstream rate limits still apply/)
})

test('caching checkpoint: each full-canvas demo has a separate numbered intro', () => {
  for (const [index, sourceSlide] of [50, 82, 114].entries()) {
    const position = slides.findIndex(slide => slide.frontmatter.sourceSlide === sourceSlide)
    const intro = slides[position - 1]
    assert.equal(intro.frontmatter.demoIntroFor, sourceSlide)
    assert.equal(intro.frontmatter.sourceSlide, sourceSlide - 1)
    assert.ok(intro.content.includes(`# Demo ${index + 1}`))
    assert.ok(intro.content.includes(['Client-Side Fetching', 'BFF With Optimized Payload', 'Server Prefetching With TanStack Query'][index]))
    assert.equal(slides[position].frontmatter.layout, 'none')
    assert.match(slides[position].frontmatter.class, /caching-video/)
    assert.doesNotMatch(slides[position].content, /^#|::title::|::caption::/m)
  }
})

test('caching checkpoint: approved outline hash remains recorded', async () => {
  const hash = digest(await readFile(new URL('outline.md', deck)))
  assert.ok((await readFile(new URL('review.md', deck), 'utf8')).includes(hash))
})

test('caching flow: native clicks and speaker cues follow the approved narration', () => {
  const flow = slides.find(slide => slide.frontmatter.sourceSlide === 47)
  assert.equal(flow.frontmatter.clicks, 11)
  assert.match(flow.content, /<ClientRequestFlow :step="\$clicks"/)
  assert.equal((flow.note.match(/\[click\]/g) || []).length, 11)
  assert.match(flow.content, /5,000 Records/)
  assert.match(flow.content, /1,000 Per Request/)
  assert.match(flow.content, /ALL Requests/)
  assert.match(flow.content, /ONLY The Failed Requests/)
  assert.match(flow.note, /normal render does not inherently refetch/)
  assert.equal(slides[41].frontmatter.sourceSlide, 45)
  assert.equal(slides[42], flow)
  assert.doesNotMatch(markdown, /Five Requests\. One Result\.|<ParallelRequests/)
  assert.match(flow.note, /cannot change the upstream API/)
  assert.match(flow.note, /including any that already succeeded/)
  assert.match(flow.note, /keep the successful results and retry ONLY/)
})

test('caching checkpoint: three recordings retain extracted hashes and static posters', async t => {
  const manifest = JSON.parse(await readFile(new URL('migration/media.json', deck), 'utf8'))
  for (const [index, media] of manifest.videos.entries()) {
    if (!missingOriginal(extracted(media.path), t)) {
      const bytes = await readFile(extracted(media.path))
      assert.equal(bytes.length, media.bytes)
      assert.equal(digest(bytes), media.sha256)
    }
    const slide = slides.find(slide => slide.frontmatter.sourceSlide === media.sourceSlide)
    assert.match(slide.content, /<SlidevVideo autoplay muted controls playsinline preload="auto"/)
    assert.ok(slide.content.includes(`/media/demo-${index + 1}.mp4`))
    assert.doesNotMatch(slide.content, /<iframe/)
    for (const [, poster] of slide.content.matchAll(/(?:poster|printPoster)="([^"]+)"/g))
      assert.ok((await readFile(new URL(`public${poster}`, deck))).length > 10000)
  }
  assert.doesNotMatch(markdown, /(?:src|poster|printPoster)="https?:/)
})

test('caching visible copy excludes citations and editorial verification labels', () => {
  for (const slide of slides) {
    assert.doesNotMatch(slide.content, /Jakob Nielsen|Usability Engineering|Paraphrased|Source:|angusjf\.com|tanstack\.com\/query|Illustrative (?:Code|Comparison)|verif(?:y|ied|ication)|value to confirm/i)
  }
  assert.match(bySource(45).content, /The Data Source/)
  assert.equal(bySource(57).content.trim(), '# 14 **KB**')
  assert.equal(bySource(57).frontmatter.class, 'caching-number-question')
  assert.match(bySource(58).content, /Depends On Transport And Server Settings/)
  assert.match(bySource(58).content, /Initial Congestion Window/)
})

test('caching web copies trace to hashed originals that are never published', async t => {
  for (const output of webMedia) {
    const original = new URL(`../../${output.original}`, deck)
    if (!missingOriginal(original, t)) assert.equal(digest(await readFile(original)), output.originalSha256)
    assert.equal(digest(await readFile(new URL(output.path, deck))), output.sha256)
    assert.ok(output.bytes < 8 * 1024 * 1024, `${output.path} is too large to host`)
    assert.ok(!output.original.includes('public/'))
  }
  assert.doesNotMatch(markdown, /\/media\/(?:in-flight-demo|flight-map|speaker-montage)\.png/)
})

test('caching migration: code is editable and valid TS syntax', () => {
  const slide = slides.find(slide => slide.frontmatter.sourceSlide === 48)
  const code = slide.content.match(/```ts\n([\s\S]*?)\n```/)[1]
  const parsed = ts.createSourceFile('client.ts', code, ts.ScriptTarget.Latest, true)
  assert.deepEqual(parsed.parseDiagnostics, [])
  assert.match(code, /getFakeData\(true, Number\(QUANTITY\), signal\)/)
  assert.match(code, /total: response.length/)
  assert.doesNotMatch(slide.content, /<img|!\[/)
  for (const number of [75, 76, 101, 109]) {
    const source = bySource(number)
    const example = [...source.content.matchAll(/```ts\n([\s\S]*?)\n```/g)][number === 76 ? 1 : 0][1]
    assert.deepEqual(ts.createSourceFile(`source-${number}.ts`, example, ts.ScriptTarget.Latest, true).parseDiagnostics, [])
    assert.doesNotMatch(source.content, /<img|!\[/)
  }
})

test('caching migration: source images are local, hashed individual assets', async () => {
  const manifest = JSON.parse(await readFile(new URL('migration/source.json', deck), 'utf8'))
  assert.equal(manifest.pages.length, 125)
  assert.equal(manifest.assets.length, 10)
  for (const asset of manifest.assets) assert.equal(digest(await readFile(extracted(asset.path))), asset.sha256)
  assert.doesNotMatch(markdown, /src="[^"\n]*source-\d+\.png/)
  for (const source of [74, 100, 108]) assert.match(bySource(source).content, /<ServerRequestFlow/)
})
