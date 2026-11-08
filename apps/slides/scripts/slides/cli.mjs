import path from 'node:path'
import { parseCommand } from './contracts.ts'
import { root, newDeck, deckPath, artifactDirectory, sourceHash, saveReport } from './workspace.mjs'

const help = `Faris Slides

pnpm slides new <talk>       Create planning files and one placeholder slide
pnpm slides dev <talk>       Run on an available local port
pnpm slides review <talk>    Typecheck, build, capture every slide/click state
pnpm slides export <talk>    Native Slidev PDF with all click steps
pnpm slides build <talk>     Static website folder, no speaker notes, checked
                             in a browser. Copy web/ to your site; never deploys.
pnpm slides publish <talk>   Same checked build, written into the portfolio site
                             at apps/web/public/slides/<slug>/. Never deploys.

Build options: --base /path/ (/talks/<talk>/), the folder's URL path on your site
Publish options: --slug <name> (<talk>), served at /slides/<name>/

Export options: --format pdf|png (pdf), --clicks all|final (all)
Reviews and exports use fresh artifacts/reviews/<talk>/<run>/ directories.
Commands never approve an outline or overwrite a deck or approved baseline.
`

try {
  const command = parseCommand(process.argv.slice(2))
  if (!command) console.log(help)
  else if (command.action === 'new') {
    console.log(`Created ${await newDeck(root, command.deck)}\nNext: fill brief.md and propose outline.md. Wait for approval before drafting.`)
  }
  else {
    const entry = await deckPath(root, command.deck)
    const { runNode, startDeck, slidevCli, typecheckCli } = await import('./slidev.mjs')
    if (command.action === 'dev') {
      const server = await startDeck(entry)
      console.log(`\n${command.deck}: ${server.url}\nPress Ctrl+C to stop.`)
      const stop = async () => { await server.close(); process.exit(0) }
      process.once('SIGINT', stop)
      process.once('SIGTERM', stop)
    }
    else {
      const directory = await artifactDirectory(root, command.deck)
      const report = { deck: command.deck, action: command.action, status: 'running', startedAt: new Date().toISOString(), node: process.version, slidev: '53.0.0', sourceSha256: await sourceHash(entry), stages: [] }
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
            report.stages.push(`published to ${report.published}; commit it with the site`)
          }
        }
        else {
          report.format = command.format
          report.clickPolicy = command.clicks
          report.output = command.format === 'pdf' ? `${command.deck}.pdf` : 'png'
          await runNode(root, slidevCli, ['export', entry, '--format', command.format, '--output', path.join(directory, report.output), '--with-clicks', String(command.clicks === 'all')], path.join(directory, 'export.log'))
          report.stages.push('native export completed; visual inspection pending')
        }
        if (await sourceHash(entry) !== report.sourceSha256) throw new Error('slides.md changed during this run. Rerun against a stable draft.')
        report.status = 'passed'
      }
      catch (error) { report.status = 'failed'; report.failure = error.message; throw error }
      finally { report.finishedAt = new Date().toISOString(); await saveReport(directory, report); console.log(`Report: ${path.join(directory, 'report.json')}`) }
    }
  }
}
catch (error) { console.error(`Faris Slides: ${error.message}`); process.exitCode = 1 }
