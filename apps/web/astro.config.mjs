import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://faziz-dev.com',
  integrations: [
    tailwind(),
    sitemap(),
    react(),
  ],
  vite: {
    ssr: {
      noExternal: ['shared'],
    },
  },
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});
