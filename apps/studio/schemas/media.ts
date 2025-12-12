import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'media',
  title: 'Media',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Photo', value: 'photo' },
          { title: 'Video', value: 'video' },
          { title: 'Press', value: 'press' },
          { title: 'Screenshot', value: 'screenshot' },
          { title: 'Podcast', value: 'podcast' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility'),
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'city', title: 'City', type: 'string' },
        { name: 'country', title: 'Country', type: 'string' },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'event',
      title: 'Related Event',
      type: 'reference',
      to: [{ type: 'event' }],
    }),
    defineField({
      name: 'talk',
      title: 'Related Talk',
      type: 'reference',
      to: [{ type: 'talk' }],
    }),
    defineField({
      name: 'peopleTags',
      title: 'People Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'credit',
      title: 'Photo Credit',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      date: 'date',
      media: 'image',
    },
    prepare({ title, type, date, media }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '';
      return {
        title: title || 'Untitled',
        subtitle: `${type} ${formattedDate ? `- ${formattedDate}` : ''}`,
        media,
      };
    },
  },
});
