import { defineType, defineField, defineArrayMember } from 'sanity';
import { AVAILABILITY_STATUSES, titleFor } from 'shared';
import { options } from './_fields';

/**
 * Singleton: the 12-month availability calendar on /invite. Months without an
 * entry show as open. The "Already booked" list is derived from events.
 */
export default defineType({
  name: 'availability',
  title: 'Availability',
  type: 'document',
  fields: [
    defineField({
      name: 'months',
      title: 'Months',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'availabilityMonth',
          fields: [
            defineField({
              name: 'month',
              title: 'Month',
              type: 'date',
              options: { dateFormat: 'MMMM YYYY' },
              description: 'Any day in the month.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: { list: options(AVAILABILITY_STATUSES), layout: 'radio', direction: 'horizontal' },
              initialValue: 'open',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'note', title: 'Note', type: 'string', description: 'Optional: "Conference season", "Two weekends left".' }),
          ],
          preview: {
            select: { month: 'month', status: 'status', note: 'note' },
            prepare: ({ month, status, note }) => ({
              title: month ? new Date(month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'No month',
              subtitle: [titleFor(AVAILABILITY_STATUSES, status), note].filter(Boolean).join(' · '),
            }),
          },
        }),
      ],
    }),
    defineField({ name: 'leadTime', title: 'Lead time', type: 'string', description: 'For "Good to know": "Six to eight weeks is comfortable; shorter works for meetups."' }),
  ],
  preview: { prepare: () => ({ title: 'Availability' }) },
});
