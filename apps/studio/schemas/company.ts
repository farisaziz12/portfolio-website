import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'company',
  title: 'Company',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      options: {
        list: [
          { title: 'Connected TV', value: 'Connected TV' },
          { title: 'FinTech', value: 'FinTech' },
          { title: 'SaaS', value: 'SaaS' },
          { title: 'Fitness', value: 'Fitness' },
          { title: 'Media', value: 'Media' },
          { title: 'Education', value: 'Education' },
          { title: 'Other', value: 'Other' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'role',
      title: 'My Role',
      type: 'string',
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'e.g., "2022-2024" or "2022-Present"',
    }),
    defineField({
      name: 'url',
      title: 'Company URL',
      type: 'url',
    }),
    defineField({
      name: 'highlight',
      title: 'Key Highlight',
      type: 'text',
      rows: 3,
      description: 'Main achievement or contribution',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      period: 'period',
      media: 'logo',
    },
    prepare({ title, role, period, media }) {
      return {
        title,
        subtitle: `${role || ''} ${period ? `(${period})` : ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
