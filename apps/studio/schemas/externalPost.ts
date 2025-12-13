import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'externalPost',
  title: 'External Post',
  type: 'document',
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
