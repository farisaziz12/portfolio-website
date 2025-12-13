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
            { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'duration', title: 'Duration', type: 'string', description: 'e.g., "30 min", "1 hour"' },
            {
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'H4', value: 'h4' },
                  ],
                  lists: [
                    { title: 'Bullet', value: 'bullet' },
                    { title: 'Number', value: 'number' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Bold', value: 'strong' },
                      { title: 'Italic', value: 'em' },
                      { title: 'Code', value: 'code' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [{ name: 'href', type: 'url', title: 'URL' }],
                      },
                    ],
                  },
                },
              ],
              description: 'Detailed description of this agenda item (shown when expanded)',
            },
          ],
          preview: {
            select: { title: 'title', duration: 'duration' },
            prepare({ title, duration }) {
              return { title: title || 'Untitled', subtitle: duration };
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
