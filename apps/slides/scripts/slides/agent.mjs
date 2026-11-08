// Where a talk is in its workflow, and the prompt that hands the next pass to
// an agent. Stage detection only trusts the markers `pnpm slides new` writes;
// older decks with free-form planning files report "in progress".
import path from 'node:path'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const read = file => readFile(file, 'utf8').catch(error => { if (error.code === 'ENOENT') return ''; throw error })
const sha256 = text => createHash('sha256').update(text).digest('hex')

export const PASSES = {
  plan: { label: 'Plan the outline', skill: 'slides-plan' },
  write: { label: 'Write the slides from the approved outline', skill: 'slides-write' },
  edit: { label: 'Fact-check and edit the copy', skill: 'slides-edit' },
  review: { label: 'Review screenshots and fix layout problems', skill: 'slides-review' },
}

/** Brief fields still empty in a template brief (`- Field:` with nothing after it). */
export function emptyBriefFields(brief) {
  return [...brief.matchAll(/^- ([^:\n]+):[ \t]*$/gm)].map(match => match[1].trim())
}

export async function deckStatus(directory) {
  const [brief, outline, review, slides] = await Promise.all(['brief.md', 'outline.md', 'review.md', 'slides.md'].map(file => read(path.join(directory, file))))
  const approval = /^Outline approval: approved .*?outline\.md SHA-256: ([0-9a-f]{64})/m.exec(review)
  const status = {
    briefMissing: emptyBriefFields(brief),
    outline: outline.includes('Status: awaiting outline') ? 'missing' : 'written',
    approval: approval ? (approval[1] === sha256(outline) ? 'approved' : 'changed') : review.includes('Outline approval: pending') ? 'pending' : 'unknown',
    drafted: !slides.includes('Outline pending approval.'),
  }
  const template = status.approval !== 'unknown'
  if (!template) Object.assign(status, { stage: 'In progress (planning files are free-form)', next: undefined })
  else if (status.briefMissing.length) Object.assign(status, { stage: `Brief incomplete: ${status.briefMissing.join(', ')}`, next: 'brief' })
  else if (status.outline === 'missing') Object.assign(status, { stage: 'Brief done, no outline yet', next: 'plan' })
  else if (status.approval === 'pending') Object.assign(status, { stage: 'Outline written, waiting for your approval', next: 'approve' })
  else if (status.approval === 'changed') Object.assign(status, { stage: 'Outline changed since you approved it', next: 'approve' })
  else if (!status.drafted) Object.assign(status, { stage: 'Outline approved, slides not written', next: 'write' })
  else Object.assign(status, { stage: 'Slides drafted', next: 'review' })
  return status
}

/** Fill the template brief's empty fields; filled ones are left alone. */
export async function fillBrief(directory, answers) {
  const file = path.join(directory, 'brief.md')
  let brief = await read(file)
  for (const [field, value] of Object.entries(answers)) {
    if (!value?.trim()) continue
    const pattern = new RegExp(`^- ${field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:[ \\t]*$`, 'm')
    brief = brief.replace(pattern, `- ${field}: ${value.trim().replace(/\n+/g, ' ')}`)
  }
  await writeFile(file, brief)
}

/** Human-only: record outline approval with the outline's hash, as slides-plan requires. */
export async function approveOutline(directory, message, date = new Date()) {
  const outline = await read(path.join(directory, 'outline.md'))
  if (!outline.trim() || outline.includes('Status: awaiting outline')) throw new Error('outline.md has no outline yet. Plan it first.')
  const file = path.join(directory, 'review.md')
  const review = await read(file)
  const line = `Outline approval: approved ${date.toISOString().slice(0, 10)} by Faris, outline.md SHA-256: ${sha256(outline)}. Message: "${message.replace(/"/g, "'")}"`
  const next = /^Outline approval: .*$/m.test(review) ? review.replace(/^Outline approval: .*$/m, line) : `${line}\n\n${review}`
  await writeFile(file, next)
  return line
}

/** The opening message for an agent pass. Paths are repo-relative. */
export function agentPrompt(pass, { deck, edition }) {
  if (!Object.hasOwn(PASSES, pass)) throw new Error(`Unknown pass "${pass}". Use one of: ${Object.keys(PASSES).join(', ')}.`)
  const dir = `apps/slides/decks/${deck}`
  const entry = edition ? `${dir}/slides.${edition}.md` : `${dir}/slides.md`
  const flag = edition ? ` --edition ${edition}` : ''
  const intro = `Read apps/slides/AGENTS.md and apps/slides/skills/${PASSES[pass].skill}/SKILL.md first, then the deck's brief.md, outline.md, sources.md and review.md in ${dir}/.`
  const editionNote = edition
    ? ` This is the ${edition} edition (${entry}): change slides only through \`pnpm slides edition ${deck} --edition ${edition} --change|--add-after|--remove <n>\`, never by editing its src ranges, and keep shared fixes in slides.md.`
    : ''
  const text = {
    plan: `Plan my talk in ${dir}/. ${intro} Using the brief and source material, write a timed outline into outline.md: one point per slide, evidence, speaking time, layout and clicks or media, plus evidence gaps. Ask me only about omissions that change the argument. Do not draft slides.md and do not approve the outline yourself: stop and wait for me to approve it with \`pnpm slides\`.`,
    write: `Write the slides for ${entry}. ${intro} Check that review.md records my outline approval and that its SHA-256 matches outline.md; if not, stop and tell me. Draft in ordinary Slidev Markdown with presenter notes, track sources in sources.md, then run \`pnpm slides review ${deck}${flag}\` and look at the screenshots before reporting back.${editionNote}`,
    edit: `Run the claims, talk-shape and voice passes on ${entry}. ${intro} Verify factual claims against primary sources, cut filler and AI tells, keep my opinions and voice (no em dashes), and record findings by slide in review.md. Make scoped copy fixes only; flag anything that changes the argument instead of rewriting it.${editionNote}`,
    review: `Review the rendered deck for ${entry}. ${intro} Run \`pnpm slides review ${deck}${flag}\`, read the report.json it prints, inspect every screenshot including click states, fix layout or overflow problems you find, and record the run directory and findings in review.md. A passing run is not my visual approval.${editionNote}`,
  }[pass]
  return text
}
