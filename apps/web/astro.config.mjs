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
  adapter: vercel(),
  build: {
    inlineStylesheets: 'auto',
  },
});
