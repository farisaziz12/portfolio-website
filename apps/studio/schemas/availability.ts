import { defineType, defineField, defineArrayMember } from 'sanity';
import { AVAILABILITY_STATUSES, titleFor } from 'shared';
import { options } from './_fields';

/**
 * Singleton: OVERRIDES for the 12-month availability calendar on /invite.
 * Every month is derived from your events automatically (1–2 confirmed
 * appearances = some dates taken, 3+ = limited). Add a month here only to
 * override that: a holiday, a month you're keeping free, a note.
 */
export default defineType({
  name: 'availability',
  title: 'Availability',
  type: 'document',
  fields: [
    defineField({
      name: 'months',
      title: 'Month overrides',
      description: 'Optional. Months are derived from your events; add one only to override it.',
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
