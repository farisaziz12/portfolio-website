// Prompt-free commands for agents and scripts: list, status, prompt, edition.
import path from 'node:path'
import { root, deckPath } from './workspace.mjs'
import { listDecks, slideMap, customizeSlide, insertSlide, removeSlide, createEdition } from './editions.mjs'
import { deckStatus, agentPrompt } from './agent.mjs'

const repo = path.resolve(root, '..', '..')
const rel = file => path.relative(repo, file)
const print = (json, value, text) => console.log(json ? JSON.stringify(value, null, 2) : text())

async function findDeck(name) {
  const deck = (await listDecks(root)).find(candidate => candidate.name === name)
  if (!deck) throw new Error(`No deck named "${name}". Run pnpm slides list.`)
  return deck
}

export async function runTool(command) {
  if (command.action === 'list') {
    const decks = await listDecks(root)
    const value = decks.map(deck => ({ name: deck.name, path: rel(deck.directory), editions: deck.editions, published: deck.published }))
    return print(command.json, value, () => decks.map(deck => [
      `${deck.name}  ${rel(deck.directory)}`,
      ...deck.editions.map(edition => `  edition ${edition}  slides.${edition}.md`),
      ...Object.entries(deck.published).map(([slug, info]) => `  /slides/${slug}/  from ${info.entry}, ${info.publishedAt}`),
    ].join('\n')).join('\n\n'))
  }

  const deck = await findDeck(command.deck)
  if (command.action === 'status') {
    const entry = await deckPath(root, deck.name, false, command.edition)
    const [status, slides] = await Promise.all([deckStatus(deck.directory), slideMap(entry)])
    const value = { deck: deck.name, edition: command.edition ?? null, entry: rel(entry), ...status, slides: slides.map(({ number, title, local, line }) => ({ number, title, ...(command.edition && { editionCopy: local }), line })) }
    return print(command.json, value, () => [
      `${deck.name}${command.edition ? `, ${command.edition} edition` : ''}  ${rel(entry)}`,
      `Stage: ${status.stage}`,
      ...(status.next ? [`Next: ${status.next}`] : []),
      '',
      ...slides.map(slide => `${String(slide.number).padStart(3)}  ${command.edition && slide.local ? '* ' : '  '}${slide.title}`),
    ].join('\n'))
  }

  if (command.action === 'prompt') return console.log(agentPrompt(command.pass, command))

  const entryOf = edition => deckPath(root, deck.name, false, edition)
  if (command.op === 'new') {
    if (command.from && !deck.editions.includes(command.from)) throw new Error(`No edition "${command.from}" in ${deck.name}.`)
    const file = await createEdition(deck.directory, command.edition, { from: command.from, event: command.event })
    return console.log(`Created ${rel(file)}\nNext: pnpm slides edition ${deck.name} --edition ${command.edition} --change 1   (the cover)`)
  }
  const entry = await entryOf(command.edition)
  if (command.op === 'change') {
    const result = await customizeSlide(entry, command.slide)
    return console.log(`${result.changed ? `Slide ${command.slide} copied into the edition.` : `Slide ${command.slide} is already this edition's copy.`} Edit it at ${rel(entry)}:${result.line}`)
  }
  if (command.op === 'add') {
    const { line } = await insertSlide(entry, command.slide)
    return console.log(`Added a placeholder as slide ${command.slide + 1}. Write it at ${rel(entry)}:${line}`)
  }
  await removeSlide(entry, command.slide)
  console.log(`Removed slide ${command.slide} from the ${command.edition} edition.`)
}
