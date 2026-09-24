import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://faziz-dev.com',
  // /services (the old services hub) merged into /contact ("Work with me").
  // The CMS-driven /services/[slug] landing pages still live under /services/.
  redirects: {
    '/services': '/contact',
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/workshops/attend/') &&
        !page.includes('/admin'),
    }),
    react(),
  ],
  vite: {
    ssr: {
      noExternal: ['shared'],
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
