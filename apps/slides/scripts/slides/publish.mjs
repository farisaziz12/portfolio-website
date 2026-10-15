import path from 'node:path'
import { cp, lstat, realpath, rm } from 'node:fs/promises'
import { validateName } from './contracts.ts'

// The portfolio site serves public/ as-is. Hash routing means no host
// rewrites, so the Netlify/Cloudflare `_redirects` Slidev writes is dropped.
export async function publishSite(workspace, web, slug) {
  validateName(slug)
  const site = path.join(workspace, '..', 'web', 'public')
  const info = await lstat(site).catch(() => undefined)
  if (!info?.isDirectory() || info.isSymbolicLink()) throw new Error(`Portfolio site not found at ${site}`)
  const destination = path.join(await realpath(site), 'slides', slug)
  await rm(destination, { recursive: true, force: true })
  await cp(web, destination, { recursive: true, filter: source => path.basename(source) !== '_redirects' })
  return path.relative(path.join(workspace, '..', '..'), destination)
}
