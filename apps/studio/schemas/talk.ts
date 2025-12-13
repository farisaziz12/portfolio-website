import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'talk',
  title: 'Talk',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'versioning', title: 'Versioning' },
    { name: 'assets', title: 'Assets' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      rows: 4,
      description: 'A brief description of the talk (2-3 paragraphs)',
      group: 'content',
    }),
    defineField({
      name: 'audience',
      title: 'Target Audience',
      type: 'string',
      description: 'Who is this talk for?',
      group: 'content',
    }),
    defineField({
      name: 'takeaways',
      title: 'Key Takeaways',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What will attendees learn?',
      group: 'content',
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Tags for filtering (e.g., React, Performance, Payments)',
      group: 'content',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      group: 'content',
    }),

    // Versioning fields
    defineField({
      name: 'parentTalk',
      title: 'Parent Talk',
      type: 'reference',
      to: [{ type: 'talk' }],
      description: 'If this is a variation of another talk, link to the original/parent version here',
      group: 'versioning',
      options: {
        filter: '!defined(parentTalk)', // Only show talks that are not themselves variations
      },
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Version identifier (e.g., "v2", "2024 Edition", "Conference Cut")',
      group: 'versioning',
    }),
    defineField({
      name: 'isCurrentVersion',
      title: 'Current Version',
      type: 'boolean',
      description: 'Is this the latest/recommended version to book? Only one version per talk family should be marked as current.',
      initialValue: true,
      group: 'versioning',
    }),
    defineField({
      name: 'versionNotes',
      title: 'Version Notes',
      type: 'text',
      rows: 3,
      description: 'What changed in this version? (e.g., "Updated for React 19, added live coding section")',
      group: 'versioning',
    }),
    defineField({
      name: 'firstDelivered',
      title: 'First Delivered',
      type: 'date',
      description: 'When was this version first presented?',
      group: 'versioning',
    }),

    defineField({
      name: 'isBookable',
      title: 'Bookable',
      type: 'boolean',
      description: 'Can this talk be booked by event organizers?',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'assets',
      title: 'Assets',
      type: 'object',
      fields: [
        { name: 'slidesUrl', title: 'Slides URL', type: 'url' },
        { name: 'repoUrl', title: 'Repository URL', type: 'url' },
      ],
      group: 'assets',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
        { name: 'ogImage', title: 'OG Image', type: 'image' },
      ],
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      version: 'version',
      isCurrentVersion: 'isCurrentVersion',
      parentTalk: 'parentTalk.title',
      topics: 'topics',
    },
    prepare({ title, version, isCurrentVersion, parentTalk, topics }) {
      const versionInfo = version ? ` (${version})` : '';
      const currentBadge = isCurrentVersion ? ' ✓' : '';
      const parentInfo = parentTalk ? `↳ ${parentTalk}` : topics?.join(', ') || 'No topics';

      return {
        title: `${title}${versionInfo}${currentBadge}`,
        subtitle: parentInfo,
      };
    },
  },
  orderings: [
    {
      title: 'Current Versions First',
      name: 'currentFirst',
      by: [
        { field: 'isCurrentVersion', direction: 'desc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
});
