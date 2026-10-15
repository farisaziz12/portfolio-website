export type Command = {
  action: 'new' | 'dev' | 'review' | 'export' | 'build' | 'publish'
  deck: string
  format: 'pdf' | 'png'
  clicks: 'all' | 'final'
  base?: string
  slug?: string
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
    if (!['export', 'build', 'publish'].includes(action!) || seen.has(flag)) throw new Error(`Unexpected or repeated option: ${flag}`)
    seen.add(flag)
    if (action === 'build') {
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
  return result
}
