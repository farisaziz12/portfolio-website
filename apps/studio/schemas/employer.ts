import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'employer',
  title: 'Employer',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company name',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company URL',
      type: 'url',
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company logo',
      type: 'image',
      description: 'PNG/SVG with transparent background works best. Rendered greyscale + hover-restore on /about.',
      options: { hotspot: false },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        },
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role / title',
      type: 'string',
      description: 'e.g., "Staff Software Engineer"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      description: 'Leave blank if this is your current role.',
    }),
    defineField({
      name: 'current',
      title: 'Current employer?',
      type: 'boolean',
      description: 'Surfaces this employer as the headline "Currently…" on /about.',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'string',
      description: 'One short line about what you did/do there. Used on hover tooltip.',
      validation: (Rule) => Rule.max(120),
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      subtitle: 'role',
      current: 'current',
      media: 'companyLogo',
    },
    prepare({ title, subtitle, current, media }) {
      return {
        title: current ? `${title} (Current)` : title,
        subtitle,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Current first, then by end date',
      name: 'currentDesc',
      by: [
        { field: 'current', direction: 'desc' },
        { field: 'endDate', direction: 'desc' },
      ],
    },
  ],
})
