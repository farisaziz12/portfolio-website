import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "3 hours", "Full day"',
    }),
    defineField({
      name: 'outcomes',
      title: 'Learning Outcomes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What will participants learn?',
    }),
    defineField({
      name: 'agenda',
      title: 'Agenda',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'topic', title: 'Topic', type: 'string' },
            { name: 'duration', title: 'Duration', type: 'string' },
          ],
          preview: {
            select: { topic: 'topic', duration: 'duration' },
            prepare({ topic, duration }) {
              return { title: topic, subtitle: duration };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'isBookable',
      title: 'Bookable',
      type: 'boolean',
      description: 'Can this workshop be booked by event organizers?',
      initialValue: true,
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
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
    },
    prepare({ title, duration }) {
      return {
        title,
        subtitle: duration || 'Duration not set',
      };
    },
  },
});
