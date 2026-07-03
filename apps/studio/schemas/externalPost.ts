import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'externalPost',
  title: 'External Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'deepDive', title: 'Episode deep-dive' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'Video', value: 'video' },
          { title: 'Panel', value: 'panel' },
          { title: 'Interview', value: 'interview' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'source',
      title: 'Source/Publication',
      type: 'string',
      description: 'e.g., "Medium", "Dev.to", "YouTube"',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
    // ── Episode deep-dive ─────────────────────────────────────────────
    // Fill these (podcast/interview types) to give the episode its own page
    // at /podcasts/[slug] with an embedded player, jumpable chapters, key
    // takeaways, and pull quotes. Leave empty → the card links out as before.
    // Workflow: run the episode transcript through AI with the prompt in
    // docs/sanity-guide.md ("Turn a podcast episode into a deep-dive page")
    // and paste the results here.
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'deepDive',
      description: 'Required for the on-site episode page. e.g. "scaling-payments-with-faris"',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'summary',
      title: 'Episode summary',
      type: 'text',
      rows: 5,
      group: 'deepDive',
      description: '2–4 sentences on what the conversation covers — first person, casual.',
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key takeaways',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'deepDive',
      description: '3–7 one-sentence learnings. These are the skimmable heart of the page.',
    }),
    defineField({
      name: 'chapters',
      title: 'Chapters',
      type: 'array',
      group: 'deepDive',
      description: 'Timestamped sections. Timestamps jump the embedded player (YouTube) or deep-link the platform (Spotify).',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'timestamp', title: 'Timestamp', type: 'string', description: 'mm:ss or hh:mm:ss, e.g. "12:45"', validation: (Rule: any) => Rule.required().regex(/^\d{1,2}(:\d{2}){1,2}$/, { name: 'timestamp' }) },
            { name: 'title', title: 'Section title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'note', title: 'One-line note', type: 'string' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'timestamp' },
          },
        },
      ],
    }),
    defineField({
      name: 'quotes',
      title: 'Pull quotes',
      type: 'array',
      group: 'deepDive',
      description: '1–3 quotable lines from the episode.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', title: 'Quote', type: 'text', rows: 2, validation: (Rule: any) => Rule.required() },
            { name: 'timestamp', title: 'Timestamp', type: 'string', description: 'Optional, mm:ss' },
          ],
          preview: { select: { title: 'text', subtitle: 'timestamp' } },
        },
      ],
    }),
    defineField({
      name: 'relatedTalk',
      title: 'Related talk',
      type: 'reference',
      to: [{ type: 'talk' }],
      group: 'deepDive',
      description: 'The bookable talk this conversation relates to — cross-links the episode page and the talk page.',
    }),
  preview: {
    select: {
      title: 'title',
      source: 'source',
      type: 'type',
      media: 'image',
    },
    prepare({ title, source, type, media }) {
      return {
        title,
        subtitle: `${type} ${source ? `- ${source}` : ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
