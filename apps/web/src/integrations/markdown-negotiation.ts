import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { negotiablePages, withMarkdownNegotiation, type VercelRoute } from '../lib/markdown-negotiation';

/**
 * Adds `Accept: text/markdown` negotiation routes to the Vercel build output
 * (see lib/markdown-negotiation.ts). Astro runs the adapter's
 * `astro:build:done` before other integrations', so config.json already
 * exists when this hook runs.
 */
export default function markdownNegotiation(): AstroIntegration {
  let root: URL;
  return {
    name: 'markdown-negotiation',
    hooks: {
      'astro:config:done': ({ config }) => {
        root = config.root;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const configPath = fileURLToPath(new URL('./.vercel/output/config.json', root));
        const raw = await readFile(configPath, 'utf8').catch(() => null);
        if (!raw) {
          logger.warn('no .vercel/output/config.json; skipping markdown negotiation');
          return;
        }
        const clientDir = fileURLToPath(dir);
        const files = (await readdir(clientDir, { recursive: true })).map((f) => f.replaceAll('\\', '/'));
        const pages = negotiablePages(files);
        const config = JSON.parse(raw) as { routes: VercelRoute[] };
        config.routes = withMarkdownNegotiation(config.routes, pages);
        await writeFile(configPath, JSON.stringify(config, null, 2));
        logger.info(`Accept: text/markdown negotiation for / and ${pages.length} pages`);
      },
    },
  };
}
