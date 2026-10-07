import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { table } from '@sanity/table';
import { BulkDelete } from 'sanity-plugin-bulk-delete';
import { schemaTypes, SINGLETON_TYPES, LEGACY_TYPES } from './schemas';
import { deskStructure } from './desk/structure';

const singletons = new Set<string>(SINGLETON_TYPES);
const noCreate = new Set<string>([...SINGLETON_TYPES, ...LEGACY_TYPES]);

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
    codeInput(),
    table(),
    BulkDelete({
      schemaTypes,
    }),
  ],

  schema: {
    types: schemaTypes,
    // Singletons and legacy types never appear in "Create new".
    templates: (templates) => templates.filter(({ schemaType }) => !noCreate.has(schemaType)),
  },

  document: {
    // Singletons: no duplicate / delete, so the one document can't be lost.
    actions: (actions, { schemaType }) =>
      singletons.has(schemaType)
        ? actions.filter(({ action }) => action !== 'duplicate' && action !== 'delete' && action !== 'unpublish')
        : actions,
    newDocumentOptions: (prev) => prev.filter((item) => !noCreate.has(item.templateId)),
  },
});
