import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

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
  output: 'hybrid',
  build: {
    inlineStylesheets: 'auto',
  },
});
