import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://faziz-dev.com',
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
  // ISR globally: any route opted into server rendering (`export const prerender = false`)
  // is cached at the edge and revalidated in the background after `expiration` seconds.
  // Currently only `/` opts in for hourly refresh of the "Next up" event band.
  adapter: vercel({
    isr: {
      expiration: 60 * 60, // 1 hour
    },
  }),
  build: {
    inlineStylesheets: 'auto',
  },
});
