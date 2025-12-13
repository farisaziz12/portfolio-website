import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { BulkDelete } from 'sanity-plugin-bulk-delete';
import { schemaTypes } from './schemas';
import { deskStructure } from './desk/structure';

export default defineConfig({
  name: 'default',
  title: 'Faris Aziz Portfolio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    BulkDelete({
      schemaTypes: schemaTypes,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
