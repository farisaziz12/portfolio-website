// `pnpm slides` with no arguments: a guided menu over the same commands.
// Every action prints the plain command it runs, so the menu also teaches
// the shortcuts. Nothing here commits, pushes or deploys.
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import * as p from '@clack/prompts'
import { validateName } from './contracts.ts'
import { root, newDeck } from './workspace.mjs'
import { listDecks, slideMap, customizeSlide, insertSlide, removeSlide, createEdition } from './editions.mjs'
import { PASSES, agentPrompt, approveOutline, deckStatus, emptyBriefFields, fillBrief } from './agent.mjs'

const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url))
const repo = path.resolve(root, '..', '..')
const siteSlides = path.join(repo, 'apps', 'web', 'public', 'slides')
const rel = file => path.relative(repo, file)
const BACK = Symbol('back')

class Cancelled extends Error {}
// Esc or Ctrl+C inside a prompt goes back one level instead of exiting.
async function ask(prompt) {
  const answer = await prompt
  if (p.isCancel(answer)) throw new Cancelled()
  return answer
}

const exists = file => access(file).then(() => true, () => false)
const nameError = value => { try { validateName(value ?? ''); return undefined } catch (error) { return error.message } }
const slugify = text => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64)

// Run the regular CLI as a child so the menu and the commands never drift.
// Ctrl+C stops the child (for example the preview server) and returns here.
async function run(args, label) {
  p.log.step(`${label}\n${'pnpm slides ' + args.join(' ')}`)
  const ignore = () => {}
  process.on('SIGINT', ignore)
  try {
    const code = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['--experimental-strip-types', '--no-warnings', cli, ...args], { cwd: root, stdio: 'inherit' })
      child.once('error', reject)
      child.once('close', (status, signal) => resolve(signal === 'SIGINT' ? 0 : signal ? 1 : status))
    })
    if (code === 0) p.log.success(args[0] === 'dev' ? 'Preview stopped.' : 'Done.')
    else p.log.error(`Stopped with exit code ${code}. Read the output above.`)
    return code === 0
  }
  finally { process.off('SIGINT', ignore) }
}

// Claude Code, if installed, can take the hand-off directly in this terminal.
async function findClaude() {
  for (const directory of (process.env.PATH ?? '').split(path.delimiter).filter(Boolean))
    if (await exists(path.join(directory, 'claude'))) return path.join(directory, 'claude')
}

async function startClaude(prompt) {
  const claude = await findClaude()
  const ignore = () => {}
  process.on('SIGINT', ignore)
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(claude, [prompt], { cwd: repo, stdio: 'inherit' })
      child.once('error', reject)
      child.once('close', resolve)
    })
  }
  finally { process.off('SIGINT', ignore) }
  p.log.info('Back from Claude. Check the deck status to see what changed.')
}

const BRIEF_HINTS = {
  'Audience and prior knowledge': 'e.g. mid-level React devs, know fetching basics',
  'Duration': 'e.g. 30 min + 5 min Q&A',
  'One outcome for the audience': 'the one thing they should leave able to do',
  'Required claims or demos': 'e.g. live demo of streaming SSR',
  'Source material': 'links, old decks, blog posts, notes',
  'Conference and offline constraints': 'e.g. no wifi on stage, 16:9 projector',
}

async function askBrief(directory) {
  const brief = await readFile(path.join(directory, 'brief.md'), 'utf8').catch(() => '')
  const missing = emptyBriefFields(brief)
  if (!missing.length) { p.log.info('The brief has no empty fields left.'); return }
  p.log.info('A few questions for brief.md. Press Enter to skip any; you or Claude can fill them later.')
  const answers = {}
  for (const field of missing) answers[field] = await ask(p.text({ message: field, placeholder: BRIEF_HINTS[field] ?? '', defaultValue: '' }))
  await fillBrief(directory, answers)
  const left = emptyBriefFields(await readFile(path.join(directory, 'brief.md'), 'utf8'))
  p.log.success(left.length ? `Saved. Still empty: ${left.join(', ')}.` : 'Brief saved.')
}

async function handOff(version, suggested) {
  const status = await deckStatus(version.deck.directory)
  const order = Object.keys(PASSES)
  const recommended = suggested ?? (order.includes(status.next) ? status.next : undefined)
  const pass = await ask(p.select({
    message: 'What should Claude do?',
    initialValue: recommended,
    options: order.map(key => ({ value: key, label: PASSES[key].label, hint: key === recommended ? `recommended now, uses skills/${PASSES[key].skill}` : `skills/${PASSES[key].skill}` })),
  }))
  if (pass === 'write' && status.approval !== 'approved' && status.approval !== 'unknown')
    p.log.warn('The outline is not approved yet. Claude is told to stop and ask in that case. Approve it first from this menu.')
  const prompt = agentPrompt(pass, { deck: version.deck.name, edition: version.edition })
  const claude = await findClaude()
  const how = await ask(p.select({
    message: 'How do you want to hand it over?',
    options: [
      ...(claude ? [{ value: 'start', label: 'Start Claude Code here with this task', hint: 'you come back to this menu when it exits' }] : []),
      { value: 'show', label: 'Show the message to copy', hint: 'paste it into Claude Code, the app or a cloud session' },
      { value: BACK, label: 'Back' },
    ],
  }))
  if (how === 'show') p.note(prompt, `Message for Claude (${PASSES[pass].skill})`)
  if (how === 'start') await startClaude(prompt)
}

async function approve(version) {
  const status = await deckStatus(version.deck.directory)
  const outline = path.join(version.deck.directory, 'outline.md')
  p.log.info(`Read it first: ${rel(outline)}
Approving records today's date, your note and a fingerprint of the outline in review.md. If the outline changes later, the menu asks you to approve again.`)
  if (status.outline === 'missing') { p.log.warn('There is no outline yet. Use "Get help from Claude" to plan one.'); return }
  const message = await ask(p.text({ message: 'Approval note (what you are agreeing to, any conditions)', placeholder: 'Approved, cut the demo if we run long', validate: value => value?.trim() ? undefined : 'Write a short note.' }))
  if (!await ask(p.confirm({ message: 'Approve this outline? Claude may then write the full slides from it.' }))) return
  const line = await approveOutline(version.deck.directory, message)
  p.log.success(`Recorded in ${rel(path.join(version.deck.directory, 'review.md'))}:
${line}`)
}

const versionArgs = version => version.edition ? ['--edition', version.edition] : []
const versionLabel = version => version.edition ? `${version.deck.name}, ${version.edition} edition` : `${version.deck.name} (main deck)`

async function latestRun(deck, edition) {
  const directory = path.join(root, 'artifacts', 'reviews', deck, ...(edition ? [edition] : []))
  const runs = await readdir(directory).catch(() => [])
  const dated = await Promise.all(runs.map(async name => ({ name, time: (await stat(path.join(directory, name))).mtimeMs })))
  const latest = dated.sort((a, b) => b.time - a.time)[0]
  return latest && path.join(directory, latest.name)
}

// ---------------------------------------------------------------- screens

const GUIDE = `How a talk moves through this tool

1. Start a new talk. Creates decks/<talk>/ with brief.md, outline.md,
   sources.md, review.md and a placeholder slides.md.
2. Plan. Answer the brief questions, then "Get help from Claude" plans a
   timed outline into outline.md (skills/slides-plan). Read it and use
   "Approve the outline"; Claude will not write slides before that.
3. Write and preview. Claude drafts slides.md from the approved outline
   (skills/slides-write), or you edit it with "Preview and edit live" on.
   "Get help from Claude" also runs the fact-check/voice pass
   (slides-edit) and the screenshot review (slides-review).
4. Review. Typechecks, builds and screenshots every slide and click
   state into apps/slides/artifacts/reviews/. Look at the screenshots;
   a passing run is not visual approval.
5. Publish. Builds without speaker notes, checks every slide in a
   browser and writes apps/web/public/slides/<url>/. You still commit
   and push, then set the session's Slides URL in Sanity.

Editions: a conference cut of an existing talk. It lives next to
slides.md as slides.<edition>.md, imports every slide from the main deck
and keeps its own copy only of the slides you change for that event.
Fixes in slides.md reach every edition the next time it is published.
Changing or inserting slides in an edition is safe from this menu.
Inserting or deleting slides in the middle of slides.md shifts the
editions' imports, so check each edition's slide map afterwards.`

const CHEATSHEET = `Everything the menu does, as commands (run from the repo root)

pnpm slides new <talk>
pnpm slides dev <talk> [--edition <name>]
pnpm slides review <talk> [--edition <name>]
pnpm slides export <talk> [--edition <name>] [--format pdf|png] [--clicks all|final]
pnpm slides publish <talk> [--edition <name>] [--slug <url-slug>]
pnpm slides --help

For agents and scripts (no prompts):
pnpm slides list [--json]
pnpm slides status <talk> [--edition <name>] [--json]
pnpm slides prompt <talk> <plan|write|edit|review> [--edition <name>]
pnpm slides edition <talk> --new <name> [--from <edition>] [--event "..."]
pnpm slides edition <talk> --edition <name> --change|--add-after|--remove <n>

Outline approval is only in this menu: an agent must not approve
its own outline.`

async function overview() {
  const decks = await listDecks(root)
  const tracked = new Set(decks.flatMap(deck => Object.keys(deck.published)))
  const lines = decks.map(deck => {
    const urls = Object.entries(deck.published).map(([slug, info]) => `    /slides/${slug}/  from ${info.entry}, ${info.publishedAt}`)
    return [`${deck.name}${deck.editions.length ? `  (editions: ${deck.editions.join(', ')})` : ''}`, ...urls].join('\n')
  })
  const untracked = (await readdir(siteSlides).catch(() => [])).filter(slug => !tracked.has(slug))
  if (untracked.length) lines.push(`Published but not linked to a deck yet:\n${untracked.map(slug => `    /slides/${slug}/`).join('\n')}`)
  p.note(lines.join('\n\n'), 'Decks and published URLs')
}

async function newTalk() {
  const title = await ask(p.text({ message: 'What is the talk called?', placeholder: 'Caching, Payloads, and Other Dark Arts', validate: value => value?.trim() ? undefined : 'Give it a working title.' }))
  const name = await ask(p.text({
    message: 'Folder name for the deck (lowercase, hyphens)',
    initialValue: slugify(title),
    validate: nameError,
  }))
  if (await exists(path.join(root, 'decks', name))) { p.log.error(`decks/${name} already exists. Open it from "Work on a deck".`); return }
  p.log.step(`Creating the planning files\npnpm slides new ${name}`)
  const directory = await newDeck(root, name, title.trim())
  p.log.success(`Created ${rel(directory)}/`)
  await askBrief(directory)
  p.note([
    'How this talk moves forward:',
    '1. Plan: Claude turns the brief into a timed outline (outline.md).',
    '2. Approve: you read it and approve it from this menu.',
    '3. Write: Claude drafts slides.md from the approved outline.',
    '4. Edit and review: fact-check, voice pass, screenshots.',
    '5. Publish.',
    '',
    'Each step is under "Work on a deck" > this deck; the menu shows where you are.',
  ].join('\n'), `"${title}"`)
  const version = { deck: { name, directory, editions: [], published: {} }, edition: undefined }
  if (await ask(p.confirm({ message: 'Hand the outline to Claude now?', initialValue: true }))) await handOff(version, 'plan')
}

async function pickDeck() {
  const decks = await listDecks(root)
  if (!decks.length) { p.log.warn('No decks yet. Start a new talk first.'); return BACK }
  return ask(p.select({
    message: 'Which deck?',
    options: [
      ...decks.map(deck => ({
        value: deck,
        label: deck.name,
        hint: [deck.editions.length && `${deck.editions.length} edition${deck.editions.length > 1 ? 's' : ''}`, Object.keys(deck.published).length && `${Object.keys(deck.published).length} published`].filter(Boolean).join(', ') || undefined,
      })),
      { value: BACK, label: 'Back' },
    ],
  }))
}

async function pickVersion(deck) {
  if (!deck.editions.length) return { deck, edition: undefined }
  const publishedFrom = entry => Object.entries(deck.published).filter(([, info]) => info.entry === entry).map(([slug]) => `/slides/${slug}/`).join(', ')
  return ask(p.select({
    message: `Which version of ${deck.name}?`,
    options: [
      { value: { deck, edition: undefined }, label: 'Main deck', hint: `slides.md${publishedFrom('slides.md') ? `, live at ${publishedFrom('slides.md')}` : ''}` },
      ...deck.editions.map(edition => ({ value: { deck, edition }, label: `${edition} edition`, hint: `slides.${edition}.md${publishedFrom(`slides.${edition}.md`) ? `, live at ${publishedFrom(`slides.${edition}.md`)}` : ''}` })),
      { value: BACK, label: 'Back' },
    ],
  }))
}

async function pickSlide(entry, message, filter = () => true) {
  const map = await slideMap(entry)
  return ask(p.autocomplete({
    message,
    placeholder: 'Type a number or words from the heading',
    maxItems: 12,
    options: map.filter(filter).map(slide => ({ value: slide.number, label: `${String(slide.number).padStart(3)}  ${slide.title}`, hint: slide.local ? 'edition copy' : undefined })),
  }))
}

async function showMap(version, entry) {
  const map = await slideMap(entry)
  const own = map.filter(slide => slide.local)
  const lines = map.map(slide => `${String(slide.number).padStart(3)}  ${slide.local && version.edition ? '* ' : '  '}${slide.title}`)
  p.note(lines.join('\n'), `${versionLabel(version)}: ${map.length} slides`)
  if (version.edition) p.log.info(`* = this edition's own copy (${own.length} slides). Everything else comes from slides.md.\nEdit the copies in ${rel(entry)}.`)
}

async function changeSlide(version, entry) {
  p.log.info('This copies the slide into the edition file. The main deck and other editions are not affected.')
  const number = await pickSlide(entry, 'Which slide should be different in this edition?')
  const result = await customizeSlide(entry, number)
  if (!result.changed) p.log.info(`Slide ${number} is already this edition's own copy.`)
  else p.log.success(`Slide ${number} is now an editable copy. Nothing renders differently until you edit it.`)
  p.log.message(`Edit it here: ${rel(entry)}:${result.line}`)
  if (await ask(p.confirm({ message: 'Open the live preview to edit it?', initialValue: true })))
    await run(['dev', version.deck.name, ...versionArgs(version)], `Live preview, go to slide ${number}. Press Ctrl+C to come back.`)
}

async function addSlide(version, entry) {
  const after = await pickSlide(entry, 'Add the new slide after which slide?')
  const { line } = await insertSlide(entry, after)
  p.log.success(`Added a placeholder "New Slide" as slide ${after + 1}. Slides after it move up by one.`)
  p.log.message(`Write it here: ${rel(entry)}:${line}`)
  if (await ask(p.confirm({ message: 'Open the live preview to write it?', initialValue: true })))
    await run(['dev', version.deck.name, ...versionArgs(version)], `Live preview, go to slide ${after + 1}. Press Ctrl+C to come back.`)
}

async function dropSlide(version, entry) {
  const number = await pickSlide(entry, 'Which slide should this edition skip?', slide => slide.number > 1)
  const map = await slideMap(entry)
  const slide = map[number - 1]
  const warning = slide.local ? ' Its edition copy, including your edits, is deleted from the file.' : ' It stays in slides.md and the other editions.'
  if (!await ask(p.confirm({ message: `Remove slide ${number} "${slide.title}" from this edition?${warning}`, initialValue: false }))) return
  await removeSlide(entry, number)
  p.log.success(`Removed. This edition now has ${map.length - 1} slides.`)
}

async function newEdition(deck) {
  p.log.info('An edition is a version of this talk for one event: different title, bio or a few slides, everything else shared.')
  const event = await ask(p.text({ message: 'Which event is it for?', placeholder: 'JSNation 2027' }))
  const edition = await ask(p.text({
    message: 'Edition name (used in the file name and commands)',
    initialValue: slugify(event),
    validate: value => nameError(value) ?? (deck.editions.includes(value) ? 'That edition exists already.' : undefined),
  }))
  const from = deck.editions.length ? await ask(p.select({
    message: 'Start from',
    options: [
      { value: undefined, label: 'The main deck', hint: 'only the cover is copied, every other slide is imported' },
      ...deck.editions.map(name => ({ value: name, label: `The ${name} edition`, hint: 'copies its changed slides too' })),
    ],
  })) : undefined
  const file = await createEdition(deck.directory, edition, { from, event })
  deck.editions.push(edition)
  p.note([
    `Created ${rel(file)}`,
    '',
    'Next, from this deck\'s menu with the new edition selected:',
    '- "Change a slide for this edition" for the cover (title, byline), bio, etc.',
    '- "Preview and edit live" to see it.',
    '- "Publish" when ready.',
  ].join('\n'), `${edition} edition`)
  return { deck, edition }
}

async function review(version) {
  p.log.info('Runs the typecheck, a production build, then opens every slide and click state in a browser and saves screenshots. Takes a few minutes.')
  if (!await ask(p.confirm({ message: 'Start the review?' }))) return
  const ok = await run(['review', version.deck.name, ...versionArgs(version)], `Reviewing ${versionLabel(version)}`)
  const latest = await latestRun(version.deck.name, version.edition)
  if (latest) p.note([
    `Summary:     ${rel(path.join(latest, 'review.md'))}`,
    `Screenshots: ${rel(path.join(latest, 'screenshots'))}/`,
    '',
    ok ? 'Machine checks passed. Look through the screenshots yourself before publishing.' : 'Fix what review.md lists, then review again.',
  ].join('\n'), 'Review output')
}

async function exportDeck(version) {
  const format = await ask(p.select({ message: 'Format', options: [{ value: 'pdf', label: 'PDF', hint: 'for sharing or a backup on stage' }, { value: 'png', label: 'PNG images', hint: 'one image per page' }] }))
  const clicks = await ask(p.select({ message: 'Click animations', options: [{ value: 'final', label: 'One page per slide', hint: 'final state of each slide' }, { value: 'all', label: 'Every click step', hint: 'a page for each reveal' }] }))
  await run(['export', version.deck.name, ...versionArgs(version), '--format', format, '--clicks', clicks], `Exporting ${versionLabel(version)}`)
  const latest = await latestRun(version.deck.name, version.edition)
  if (latest) p.log.message(`Output: ${rel(latest)}/`)
}

async function publish(version) {
  const { deck, edition } = version
  const entry = edition ? `slides.${edition}.md` : 'slides.md'
  const own = Object.entries(deck.published).filter(([, info]) => info.entry === entry)
  const fallback = edition ? `${deck.name}-${edition}` : deck.name
  let slug = own.length ? await ask(p.select({
    message: 'Publish to which URL?',
    options: [
      ...own.map(([name, info]) => ({ value: name, label: `Update /slides/${name}/`, hint: `last published ${info.publishedAt}` })),
      { value: undefined, label: 'A new URL' },
    ],
  })) : undefined
  slug ??= await ask(p.text({
    message: 'URL name: the deck will live at faziz-dev.com/slides/<name>/',
    initialValue: fallback,
    validate: nameError,
  }))
  const folder = path.join(siteSlides, slug)
  const owner = (await listDecks(root)).flatMap(other => Object.entries(other.published).map(([name, info]) => ({ name, deck: other.name, entry: info.entry }))).find(item => item.name === slug)
  if (await exists(folder) && !(owner?.deck === deck.name && owner.entry === entry)) {
    const holder = owner ? `${owner.deck}/${owner.entry}` : 'a deck this tool does not know about'
    if (!await ask(p.confirm({ message: `/slides/${slug}/ already holds ${holder}. Replace it with ${versionLabel(version)}? Links to it will show the new deck.`, initialValue: false }))) return
  }
  p.log.info('Builds without speaker notes, checks every slide in a browser, then replaces the folder below. It does not commit or deploy.')
  if (!await ask(p.confirm({ message: `Publish ${versionLabel(version)} to ${rel(folder)}/?` }))) return
  if (!await run(['publish', deck.name, ...versionArgs(version), '--slug', slug], `Publishing ${versionLabel(version)}`)) return
  deck.published[slug] = { entry, publishedAt: new Date().toISOString().slice(0, 10) }
  p.note([
    `Live after deploy: https://faziz-dev.com/slides/${slug}/`,
    '',
    '1. Commit the build with the source:',
    `   git add ${rel(folder)} ${rel(deck.directory)}`,
    '2. Push and merge; Vercel deploys the site.',
    '3. In Sanity Studio: Event > the session > Slides URL.',
    '   Set it on the session, not the talk, so the event and talk pages both show it.',
  ].join('\n'), 'Published locally')
}

async function deckMenu(version) {
  for (;;) {
    const { deck, edition } = version
    const entry = path.join(deck.directory, edition ? `slides.${edition}.md` : 'slides.md')
    const status = await deckStatus(deck.directory)
    const nextHint = { brief: 'fill in the brief', plan: 'get Claude to plan the outline', approve: 'approve the outline', write: 'get Claude to write the slides', review: 'review and publish' }[status.next]
    const options = [
      ...(status.next === 'brief' ? [{ value: 'brief', label: 'Fill in the brief', hint: 'recommended now' }] : []),
      ...(status.next === 'approve' ? [{ value: 'approve', label: 'Approve the outline', hint: 'recommended now' }] : []),
      { value: 'claude', label: 'Get help from Claude', hint: ['plan, write, edit or review with the slides skills', ['plan', 'write'].includes(status.next) && 'recommended now'].filter(Boolean).join('; ') },
      { value: 'dev', label: 'Preview and edit live', hint: `opens a local URL; edits to ${path.basename(entry)} show on save` },
      { value: 'map', label: 'List slides' },
      ...(edition ? [
        { value: 'change', label: 'Change a slide for this edition', hint: 'copies it here so you can edit it' },
        { value: 'add', label: 'Add a slide to this edition' },
        { value: 'drop', label: 'Remove a slide from this edition' },
      ] : [
        { value: 'edition', label: 'Make an edition for another event', hint: 'reuse this talk with a new title or a few changed slides' },
      ]),
      { value: 'review', label: 'Review', hint: 'typecheck, build, screenshot every slide and click' },
      { value: 'export', label: 'Export PDF or images' },
      { value: 'publish', label: 'Publish to faziz-dev.com', hint: 'writes apps/web/public/slides/<url>/' },
      { value: 'files', label: 'Show the deck files' },
      { value: BACK, label: 'Back' },
    ]
    p.log.message(`${versionLabel(version)}  ${rel(entry)}\nStage: ${status.stage}${nextHint ? `. Next: ${nextHint}.` : ''}`)
    const action = await ask(p.select({ message: 'What do you want to do?', options }))
    if (action === BACK) return
    try {
      if (action === 'brief') await askBrief(deck.directory)
      else if (action === 'approve') await approve(version)
      else if (action === 'claude') await handOff(version)
      else if (action === 'dev') await run(['dev', deck.name, ...versionArgs(version)], 'Live preview. Press Ctrl+C to stop and come back here.')
      else if (action === 'map') await showMap(version, entry)
      else if (action === 'change') await changeSlide(version, entry)
      else if (action === 'add') await addSlide(version, entry)
      else if (action === 'drop') await dropSlide(version, entry)
      else if (action === 'edition') version = await newEdition(deck)
      else if (action === 'review') await review(version)
      else if (action === 'export') await exportDeck(version)
      else if (action === 'publish') await publish(version)
      else if (action === 'files') {
        const files = ['brief.md', 'outline.md', 'sources.md', 'review.md', 'EDITIONS.md', 'slides.md', ...deck.editions.map(name => `slides.${name}.md`)]
        const present = (await Promise.all(files.map(async file => await exists(path.join(deck.directory, file)) && file))).filter(Boolean)
        p.note([...present.map(file => rel(path.join(deck.directory, file))), '', `Deck-only components, layouts and media: ${rel(deck.directory)}/components, layouts, public/`, 'Shared theme: apps/slides/packages/slidev-theme-faris'].join('\n'), deck.name)
      }
    }
    catch (error) {
      if (error instanceof Cancelled) continue
      p.log.error(error.message)
    }
  }
}

export async function interactive() {
  p.intro('Faris Slides')
  for (;;) {
    const choice = await p.select({
      message: 'What do you want to do?',
      options: [
        { value: 'deck', label: 'Work on a deck', hint: 'preview, change slides, editions, review, publish' },
        { value: 'new', label: 'Start a new talk' },
        { value: 'overview', label: 'See all decks and published URLs' },
        { value: 'guide', label: 'How this works' },
        { value: 'commands', label: 'Command cheat sheet' },
        { value: 'quit', label: 'Quit' },
      ],
    })
    if (p.isCancel(choice) || choice === 'quit') break
    try {
      if (choice === 'new') await newTalk()
      else if (choice === 'overview') await overview()
      else if (choice === 'guide') p.note(GUIDE, 'Guide')
      else if (choice === 'commands') p.note(CHEATSHEET, 'Commands')
      else if (choice === 'deck') {
        const deck = await pickDeck()
        if (deck === BACK) continue
        const version = await pickVersion(deck)
        if (version !== BACK) await deckMenu(version)
      }
    }
    catch (error) {
      // Esc inside a flow returns to this menu.
      if (!(error instanceof Cancelled)) p.log.error(error.message)
    }
  }
  p.outro('Bye. Nothing was committed; check git status when you are done.')
}
