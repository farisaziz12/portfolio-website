import { defineType, defineField } from 'sanity';

/**
 * One entry on the career timeline (Track record). Kept as `company` for
 * data compatibility; think of it as "role at an organisation".
 */
export default defineType({
  name: 'company',
  title: 'Career entry',
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
      name: 'periodLabel',
      title: 'Timeline label',
      type: 'string',
      description: 'Optional. Leave empty and the timeline shows the dates ("2024 →" while current, "2021–2023" once ended). Fill it only to override ("Now", "Before code").',
    }),
    defineField({ name: 'startDate', title: 'Start', type: 'date', description: 'Drives the timeline label and order.' }),
    defineField({ name: 'endDate', title: 'End', type: 'date', description: 'Empty = current role.' }),
    defineField({
      name: 'isPublic',
      title: 'Show publicly',
      type: 'boolean',
      initialValue: true,
      description: 'Off keeps an unannounced role private until the reveal.',
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
