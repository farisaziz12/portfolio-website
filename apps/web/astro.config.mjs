import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://faziz-dev.com',
  // V3 IA. /services is the "How I can help" overview again; /consulting folds
  // into it. /media folds into the press kit. CMS-driven /services/[slug]
  // landing pages still live under /services/.
  redirects: {
    '/services/speaking': '/speaking',
    '/consulting': '/services',
    '/media': '/press-kit',
    '/schedule': '/events',
    '/writing': '/blog',
    '/track-record': '/impact',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/workshops/attend/') &&
        !page.includes('/admin') &&
        !page.includes('/og/'),
    }),
    react(),
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
      expiration: 60 * 60, // 1 hour
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
