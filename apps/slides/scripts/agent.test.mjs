import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { newDeck } from './slides/workspace.mjs'
import { agentPrompt, approveOutline, deckStatus, emptyBriefFields, fillBrief } from './slides/agent.mjs'
import { parseToolCommand } from './slides/contracts.ts'

async function talk(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'faris-agent-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, 'decks'))
  return newDeck(root, 'my-talk', 'My Talk: Subtitle')
}

test('a new talk walks brief, plan, approve, write, review', async (t) => {
  const directory = await talk(t)
  assert.match(await readFile(path.join(directory, 'slides.md'), 'utf8'), /^title: "My Talk: Subtitle"$/m)
  let status = await deckStatus(directory)
  assert.equal(status.next, 'brief')
  assert.equal(status.briefMissing.length, 6)

  await fillBrief(directory, { 'Duration': '30 min', 'Audience and prior knowledge': 'React devs\nwho ship', 'Source material': '  ' })
  const brief = await readFile(path.join(directory, 'brief.md'), 'utf8')
  assert.match(brief, /^- Duration: 30 min$/m)
  assert.match(brief, /^- Audience and prior knowledge: React devs who ship$/m)
  assert.deepEqual(emptyBriefFields(brief), ['One outcome for the audience', 'Required claims or demos', 'Source material', 'Conference and offline constraints'])
  await fillBrief(directory, Object.fromEntries(emptyBriefFields(brief).map(field => [field, 'x'])))
  assert.equal((await deckStatus(directory)).next, 'plan')

  await assert.rejects(approveOutline(directory, 'ok'), /no outline yet/)
  const outline = path.join(directory, 'outline.md')
  await writeFile(outline, '# My Talk: outline\n\n1. Hook, 2 min\n')
  assert.equal((await deckStatus(directory)).next, 'approve')
  const line = await approveOutline(directory, 'Looks "good"', new Date('2027-01-05T09:00:00Z'))
  assert.match(line, /^Outline approval: approved 2027-01-05 by Faris, outline\.md SHA-256: [0-9a-f]{64}\. Message: "Looks 'good'"$/)
  assert.match(await readFile(path.join(directory, 'review.md'), 'utf8'), /^Outline approval: approved 2027-01-05/m)
  status = await deckStatus(directory)
  assert.equal(status.approval, 'approved')
  assert.equal(status.next, 'write')

  await writeFile(outline, '# My Talk: outline\n\n1. Hook, 3 min\n')
  assert.equal((await deckStatus(directory)).approval, 'changed')
  await approveOutline(directory, 'Re-approved')
  await writeFile(path.join(directory, 'slides.md'), '---\ntheme: faris\n---\n\n# Real slides\n')
  assert.equal((await deckStatus(directory)).next, 'review')
})

test('free-form planning files do not get a guessed stage', async (t) => {
  const directory = await talk(t)
  await writeFile(path.join(directory, 'review.md'), '# Old review notes\nApproved in chat.\n')
  const status = await deckStatus(directory)
  assert.equal(status.next, undefined)
  assert.match(status.stage, /In progress/)
})

test('agent prompts name the skill, the deck and the human approval gate', () => {
  const plan = agentPrompt('plan', { deck: 'my-talk' })
  assert.match(plan, /skills\/slides-plan\/SKILL\.md/)
  assert.match(plan, /apps\/slides\/decks\/my-talk\//)
  assert.match(plan, /do not approve the outline yourself/)
  const write = agentPrompt('write', { deck: 'my-talk', edition: 'conf' })
  assert.match(write, /slides\.conf\.md/)
  assert.match(write, /pnpm slides review my-talk --edition conf/)
  assert.match(write, /never by editing its src ranges/)
  assert.throws(() => agentPrompt('deploy', { deck: 'my-talk' }), /Unknown pass/)
  for (const pass of ['plan', 'write', 'edit', 'review']) assert.doesNotMatch(agentPrompt(pass, { deck: 'x' }), /[–—]/)
})

test('agent commands parse strictly', () => {
  assert.equal(parseToolCommand(['dev', 'talk']), undefined)
  assert.deepEqual(parseToolCommand(['list', '--json']), { action: 'list', json: true })
  assert.deepEqual(parseToolCommand(['status', 'talk', '--edition', 'conf']), { action: 'status', deck: 'talk', edition: 'conf', json: false })
  assert.deepEqual(parseToolCommand(['prompt', 'talk', 'plan']), { action: 'prompt', deck: 'talk', pass: 'plan' })
  assert.deepEqual(parseToolCommand(['edition', 'talk', '--new', 'conf', '--event', 'Conf 2027']), { action: 'edition', deck: 'talk', op: 'new', edition: 'conf', event: 'Conf 2027' })
  assert.deepEqual(parseToolCommand(['edition', 'talk', '--edition', 'conf', '--change', '15']), { action: 'edition', deck: 'talk', op: 'change', edition: 'conf', slide: 15 })
  assert.deepEqual(parseToolCommand(['edition', 'talk', '--edition', 'conf', '--add-after', '2']).op, 'add')
  for (const args of [['list', 'talk'], ['status'], ['status', '../x'], ['prompt', 'talk'], ['edition', 'talk', '--change', '3'], ['edition', 'talk', '--edition', 'c', '--change', '0'],
    ['edition', 'talk', '--edition', 'c', '--change', '2', '--remove', '3'], ['edition', 'talk', '--edition', 'c'], ['edition', 'talk', '--new', 'A B'], ['edition', 'talk', '--edition', 'c', '--change'], ['status', 'talk', '--slug', 'x'], ['list', '--json', '--json']])
    assert.throws(() => parseToolCommand(args), undefined, args.join(' '))
})
