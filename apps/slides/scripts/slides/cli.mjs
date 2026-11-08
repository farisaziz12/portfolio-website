import path from 'node:path'
import { parseCommand, parseToolCommand } from './contracts.ts'
import { root, newDeck, deckPath, artifactDirectory, sourceHash, saveReport } from './workspace.mjs'

const help = `Faris Slides

pnpm slides                  Interactive menu: pick a deck and what to do,
                             with each step explained. Start here.

pnpm slides new <talk>       Create planning files and one placeholder slide
pnpm slides dev <talk>       Run on an available local port
pnpm slides review <talk>    Typecheck, build, capture every slide/click state
pnpm slides export <talk>    Native Slidev PDF with all click steps
pnpm slides build <talk>     Static website folder, no speaker notes, checked
                             in a browser. Copy web/ to your site; never deploys.
pnpm slides publish <talk>   Same checked build, written into the portfolio site
                             at apps/web/public/slides/<slug>/. Never deploys.

Editions: --edition <name> on any command but new uses decks/<talk>/slides.<name>.md,
a variant that imports slides from slides.md. Defaults become /talks/<talk>-<name>/
and /slides/<talk>-<name>/.

Build options: --base /path/ (/talks/<talk>/), the folder's URL path on your site
Publish options: --slug <name> (<talk>), served at /slides/<name>/

Export options: --format pdf|png (pdf), --clicks all|final (all)

For agents and scripts (no prompts):
pnpm slides list [--json]                      Decks, editions, published URLs
pnpm slides status <talk> [--edition <name>] [--json]
                                               Workflow stage, next step, slide list
pnpm slides prompt <talk> <plan|write|edit|review> [--edition <name>]
                                               Print the hand-off message for an agent
pnpm slides edition <talk> --new <name> [--from <edition>] [--event "JSNation 2027"]
pnpm slides edition <talk> --edition <name> --change <n>
                                               Copy slide n into the edition to edit it
pnpm slides edition <talk> --edition <name> --add-after <n> | --remove <n>
Edition edits verify the rendered deck and roll back if another slide changed.
Outline approval is human-only: use the interactive menu.

Reviews and exports use fresh artifacts/reviews/<talk>/<run>/ directories.
Commands never approve an outline or overwrite a deck or approved baseline.
`

try {
  const args = process.argv.slice(2)
  const tool = parseToolCommand(args)
  const command = tool ? undefined : parseCommand(args)
  if (tool) {
    const { runTool } = await import('./tools.mjs')
    await runTool(tool)
  }
  else if (!command && !args.length && process.stdin.isTTY && process.stdout.isTTY) {
    const { interactive } = await import('./interactive.mjs')
    await interactive()
  }
  else if (!command) console.log(help)
  else if (command.action === 'new') {
    console.log(`Created ${await newDeck(root, command.deck)}\nNext: fill brief.md and propose outline.md. Wait for approval before drafting.`)
  }
  else {
    const entry = await deckPath(root, command.deck, false, command.edition)
    const label = command.edition ? `${command.deck} (${command.edition})` : command.deck
    const { runNode, startDeck, slidevCli, typecheckCli } = await import('./slidev.mjs')
    if (command.action === 'dev') {
      const server = await startDeck(entry)
      console.log(`\n${label}: ${server.url}\nPress Ctrl+C to stop.`)
      const stop = async () => { await server.close(); process.exit(0) }
      process.once('SIGINT', stop)
      process.once('SIGTERM', stop)
    }
    else {
      const directory = await artifactDirectory(root, command.deck, command.edition)
      const report = { deck: command.deck, ...(command.edition && { edition: command.edition }), action: command.action, status: 'running', startedAt: new Date().toISOString(), node: process.version, slidev: '53.0.0', sourceSha256: await sourceHash(entry), stages: [] }
      console.log(`Artifacts: ${directory}`)
      try {
        if (command.action === 'review') {
          await runNode(root, typecheckCli, ['--noEmit', '-p', 'tsconfig.json'], path.join(directory, 'typecheck.log'))
          report.stages.push('typecheck passed')
          await runNode(root, slidevCli, ['build', entry, '--out', path.join(directory, 'web')], path.join(directory, 'build.log'))
          report.stages.push('production build passed')
          const { reviewDeck } = await import('./review.mjs')
          await reviewDeck(entry, directory, report)
          report.stages.push('browser checks passed; visual inspection pending')
        }
        else if (command.action === 'build' || command.action === 'publish') {
          const web = path.join(directory, 'web')
          report.base = command.base
          // Hash routing: deep links work on any static host without rewrites.
          await runNode(root, slidevCli, ['build', entry, '--out', web, '--base', command.base, '--without-notes', '--router-mode', 'hash'], path.join(directory, 'build.log'))
          report.stages.push('static build passed')
          const { checkSite } = await import('./site.mjs')
          await checkSite(entry, web, command.base, directory, report)
          if (command.action === 'build') report.stages.push(`site checks passed; copy ${web} to ${command.base} on your site`)
          else {
            report.stages.push('site checks passed')
            const { publishSite } = await import('./publish.mjs')
            report.published = await publishSite(root, web, command.slug)
            const { recordPublish } = await import('./editions.mjs')
            await recordPublish(path.dirname(entry), command.slug, command.edition)
            report.stages.push(`published to ${report.published}; commit it with the site`)
          }
        }
        else {
          report.format = command.format
          report.clickPolicy = command.clicks
          report.output = command.format === 'pdf' ? `${command.edition ? `${command.deck}-${command.edition}` : command.deck}.pdf` : 'png'
          await runNode(root, slidevCli, ['export', entry, '--format', command.format, '--output', path.join(directory, report.output), '--with-clicks', String(command.clicks === 'all')], path.join(directory, 'export.log'))
          report.stages.push('native export completed; visual inspection pending')
        }
        if (await sourceHash(entry) !== report.sourceSha256) throw new Error('Deck markdown changed during this run. Rerun against a stable draft.')
        report.status = 'passed'
      }
      catch (error) { report.status = 'failed'; report.failure = error.message; throw error }
      finally { report.finishedAt = new Date().toISOString(); await saveReport(directory, report); console.log(`Report: ${path.join(directory, 'report.json')}`) }
    }
  }
}
catch (error) { console.error(`Faris Slides: ${error.message}`); process.exitCode = 1 }
