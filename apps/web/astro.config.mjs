import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import markdownNegotiation from './src/integrations/markdown-negotiation';
import { REDIRECTS } from './src/lib/redirects';

// https://astro.build/config
export default defineConfig({
  site: 'https://faziz-dev.com',
  // Retired URLs; the list lives in src/lib/redirects.ts (loaders read it too).
  redirects: REDIRECTS,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/workshops/attend/') &&
        !page.includes('/admin') &&
        !page.includes('/og/'),
    }),
    react(),
    // Accept: text/markdown → .md mirrors and a Markdown 404 (Vercel routes).
    markdownNegotiation(),
  ],
  vite: {
    ssr: {
      noExternal: ['shared'],
    },
    // Pre-bundle React's JSX runtimes with React itself. Without this, a dep
    // re-optimisation mid-session can leave islands with two React copies
    // ("jsxDEV is not a function" in dev only).
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
  },
  // ISR for SSR pages (e.g. homepage). Never cache API or admin — they use cookies.
  // Workshop short-path redirects are SSR with Cache-Control: no-store (see [shortPath].astro).
  adapter: vercel({
    isr: {
      expiration: 60 * 60 * 12, // 12 hours — at most twice a day on traffic
      exclude: [
        /^\/api\/.+/,
        /^\/admin(\/.*)?$/,
        /^\/workshops\/attend\/.+/,
      ],
    },
  }),
  build: {
    inlineStylesheets: 'auto',
  },
});
