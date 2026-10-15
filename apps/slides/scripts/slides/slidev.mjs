import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { writeFile } from 'node:fs/promises'
const require = createRequire(import.meta.url)

export async function runNode(workspace, script, args, logFile) {
  const child = spawn(process.execPath, [script, ...args], { cwd: workspace, env: { ...process.env, CI: 'true', NO_COLOR: '1' }, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  child.stdout.on('data', chunk => { output += chunk; process.stdout.write(chunk) })
  child.stderr.on('data', chunk => { output += chunk; process.stderr.write(chunk) })
  const stop = () => child.kill('SIGTERM')
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  try {
    const code = await new Promise((resolve, reject) => {
      child.once('error', reject)
      child.once('close', (status, signal) => resolve(signal ? 1 : status))
    })
    if (logFile) await writeFile(logFile, output)
    if (code !== 0) throw new Error(`Command failed (${code}): ${script} ${args.join(' ')}. See ${logFile ?? 'output above'}.`)
  }
  finally { process.off('SIGINT', stop); process.off('SIGTERM', stop) }
}

export const slidevCli = require.resolve('@slidev/cli/bin/slidev.mjs')
export const typecheckCli = require.resolve('vue-tsc/bin/vue-tsc.js')

export async function startDeck(entry) {
  // Pinned Slidev 53 adapter; no shell, port guessing, or adoption of someone
  // else's server. Vite owns the OS-assigned loopback port and its cleanup.
  const { createServer, resolveOptions } = await import('@slidev/cli')
  const options = await resolveOptions({ entry }, 'dev')
  const server = await createServer(options, { server: { host: '127.0.0.1', port: 0, strictPort: true, open: false }, logLevel: 'warn' })
  try {
    await server.listen()
    const address = server.httpServer.address()
    return { url: `http://127.0.0.1:${address.port}`, close: () => server.close() }
  }
  catch (error) { await server.close(); throw error }
}
