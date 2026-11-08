export type Command = {
  action: 'new' | 'dev' | 'review' | 'export' | 'build' | 'publish'
  deck: string
  format: 'pdf' | 'png'
  clicks: 'all' | 'final'
  base?: string
  slug?: string
  /** Alternate entry `decks/<deck>/slides.<edition>.md`; it shares the deck's components and media. */
  edition?: string
}

export function validateName(name: string): string {
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name) || name.length > 64)
    throw new Error('Deck name must be lowercase words separated by hyphens (max 64 characters).')
  return name
}

export function parseCommand(args: string[]): Command | undefined {
  if (!args.length || (args.length === 1 && ['help', '--help', '-h'].includes(args[0]!))) return
  const [action, name, ...options] = args
  if (!['new', 'dev', 'review', 'export', 'build', 'publish'].includes(action!)) throw new Error(`Unknown command: ${action}`)
  if (!name) throw new Error('Provide a deck name. Run pnpm slides --help for examples.')
  const result: Command = { action: action as Command['action'], deck: validateName(name), format: 'pdf', clicks: 'all' }
  if (action === 'build') result.base = `/talks/${result.deck}/`
  if (action === 'publish') { result.slug = result.deck; result.base = `/slides/${result.deck}/` }
  const seen = new Set<string>()
  for (let i = 0; i < options.length; i += 2) {
    const flag = options[i]!
    const value = options[i + 1]
    if (action === 'new' || seen.has(flag) || (flag !== '--edition' && !['export', 'build', 'publish'].includes(action!))) throw new Error(`Unexpected or repeated option: ${flag}`)
    seen.add(flag)
    if (flag === '--edition') {
      if (!value) throw new Error('Invalid option: --edition')
      result.edition = validateName(value)
    }
    else if (action === 'build') {
      // A site path such as /talks/my-talk/: no host, query or parent segments.
      if (flag !== '--base' || !value || !/^\/(?:[a-z0-9._-]+\/)*$/i.test(value) || value.includes('/../')) throw new Error(`Invalid option: ${flag} ${value ?? ''}`)
      result.base = value
    }
    else if (action === 'publish') {
      // The site URL is /slides/<slug>/; the slug follows deck naming rules.
      if (flag !== '--slug' || !value) throw new Error(`Invalid option: ${flag} ${value ?? ''}`)
      result.slug = validateName(value)
      result.base = `/slides/${result.slug}/`
    }
    else if (flag === '--format' && (value === 'pdf' || value === 'png')) result.format = value
    else if (flag === '--clicks' && (value === 'all' || value === 'final')) result.clicks = value
    else throw new Error(`Invalid option: ${flag} ${value ?? ''}`)
  }
  // An edition gets its own default URL so it never replaces the main deck's.
  if (result.edition) {
    const name = `${result.deck}-${result.edition}`
    if (action === 'build' && !seen.has('--base')) result.base = `/talks/${name}/`
    if (action === 'publish' && !seen.has('--slug')) { result.slug = validateName(name); result.base = `/slides/${name}/` }
  }
  return result
}

export type ToolCommand =
  | { action: 'list', json: boolean }
  | { action: 'status', deck: string, edition?: string, json: boolean }
  | { action: 'edition', deck: string, op: 'new', edition: string, from?: string, event?: string }
  | { action: 'edition', deck: string, op: 'change' | 'add' | 'remove', edition: string, slide: number }
  | { action: 'prompt', deck: string, pass: string, edition?: string }

const slideNumber = (flag: string, value: string | undefined) => {
  if (!value || !/^[1-9]\d{0,3}$/.test(value)) throw new Error(`${flag} needs a slide number.`)
  return Number(value)
}

// Agent-friendly commands that need no terminal prompts. The interactive menu
// calls the same functions, so both paths share one implementation.
export function parseToolCommand(args: string[]): ToolCommand | undefined {
  const [action, ...rest] = args
  if (!['list', 'status', 'edition', 'prompt'].includes(action!)) return
  const options = new Map<string, string | true>()
  const positional: string[] = []
  for (let i = 0; i < rest.length; i++) {
    const item = rest[i]!
    if (!item.startsWith('--')) { positional.push(item); continue }
    if (options.has(item)) throw new Error(`Repeated option: ${item}`)
    if (item === '--json') { options.set(item, true); continue }
    const value = rest[++i]
    if (value === undefined || value.startsWith('--')) throw new Error(`${item} needs a value.`)
    options.set(item, value)
  }
  const allow = (...flags: string[]) => {
    for (const flag of options.keys()) if (!flags.includes(flag)) throw new Error(`Unexpected option for ${action}: ${flag}`)
  }
  const text = (flag: string) => { const value = options.get(flag); return typeof value === 'string' ? value : undefined }
  if (action === 'list') {
    allow('--json')
    if (positional.length) throw new Error('list takes no deck name.')
    return { action, json: options.has('--json') }
  }
  const [name, extra, ...more] = positional
  if (!name) throw new Error(`Provide a deck name: pnpm slides ${action} <talk>`)
  const deck = validateName(name)
  const edition = text('--edition') && validateName(text('--edition')!)
  if (action === 'status') {
    allow('--edition', '--json')
    if (extra) throw new Error('status takes one deck name.')
    return { action, deck, ...(edition && { edition }), json: options.has('--json') }
  }
  if (action === 'prompt') {
    allow('--edition')
    if (!extra || more.length) throw new Error('Usage: pnpm slides prompt <talk> <plan|write|edit|review> [--edition <name>]')
    return { action, deck, pass: extra, ...(edition && { edition }) }
  }
  if (extra) throw new Error('edition takes one deck name.')
  const created = text('--new')
  if (created) {
    allow('--new', '--from', '--event')
    const from = text('--from')
    return { action: 'edition', deck, op: 'new', edition: validateName(created), ...(from && { from: validateName(from) }), ...(text('--event') && { event: text('--event') }) }
  }
  allow('--edition', '--change', '--add-after', '--remove')
  if (!edition) throw new Error('Name the edition: --edition <name> (or --new <name> to create one).')
  const ops = (['--change', '--add-after', '--remove'] as const).filter(flag => options.has(flag))
  if (ops.length !== 1) throw new Error('Pick exactly one of --change <n>, --add-after <n>, --remove <n>.')
  const op = ({ '--change': 'change', '--add-after': 'add', '--remove': 'remove' } as const)[ops[0]!]
  return { action: 'edition', deck, op, edition, slide: slideNumber(ops[0]!, text(ops[0]!)) }
}
