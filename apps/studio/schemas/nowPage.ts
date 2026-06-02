import { defineType, defineField, defineArrayMember } from 'sanity'

// Singleton — only one nowPage document should exist. Enforce in Studio via
// structure/desk customization if needed; for now, the page fetcher queries
// `*[_type == "nowPage"][0]` so any extras are silently ignored.
export default defineType({
  name: 'nowPage',
  title: 'Now page',
  type: 'document',
  fields: [
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'datetime',
      description: 'Shown prominently on /now. Bump every time you edit any field below.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where you are right now (e.g., "Geneva, Switzerland").',
    }),
    defineField({
      name: 'headline',
      title: 'One-line headline',
      type: 'string',
      description: 'Optional short summary of what this season is about for you.',
    }),
    defineField({
      name: 'currentlyWorkingOn',
      title: 'Currently working on',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'currentlyLearning',
      title: 'Currently learning',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'currentlyReading',
      title: 'Currently reading / watching',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'readingItem',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'author', type: 'string' }),
            defineField({ name: 'url', type: 'url' }),
            defineField({
              name: 'kind',
              type: 'string',
              options: {
                list: [
                  { title: 'Book', value: 'book' },
                  { title: 'Article', value: 'article' },
                  { title: 'Talk', value: 'talk' },
                  { title: 'Podcast', value: 'podcast' },
                  { title: 'Course', value: 'course' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'author' },
          },
        }),
      ],
    }),
    defineField({
      name: 'currentlyThinkingAbout',
      title: 'Currently thinking about',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'notAvailableFor',
      title: 'Not available for',
      type: 'text',
      rows: 3,
      description: 'Set expectations — what you are *not* taking on right now.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'lastUpdated' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Now',
        subtitle: subtitle ? `Updated ${new Date(subtitle).toLocaleDateString()}` : 'Not yet updated',
      }
    },
  },
})
