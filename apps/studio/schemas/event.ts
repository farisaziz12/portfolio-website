import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
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
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Conference', value: 'conference' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Meetup', value: 'meetup' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'Webinar', value: 'webinar' },
          { title: 'Panel', value: 'panel' },
          { title: 'Hosting', value: 'hosting' },
          { title: 'Judging', value: 'judging' },
          { title: 'Mentoring', value: 'mentoring' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'conference',
      title: 'Conference/Venue Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'For multi-day events',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'city', title: 'City', type: 'string' },
        { name: 'country', title: 'Country', type: 'string' },
        { name: 'isOnline', title: 'Online Event', type: 'boolean', initialValue: false },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'talk',
      title: 'Associated Talk',
      type: 'reference',
      to: [{ type: 'talk' }],
      description: 'Link to canonical talk if presenting a talk',
    }),
    defineField({
      name: 'workshop',
      title: 'Associated Workshop',
      type: 'reference',
      to: [{ type: 'workshop' }],
      description: 'Link to canonical workshop if presenting a workshop',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'object',
      fields: [
        { name: 'eventUrl', title: 'Event URL', type: 'url' },
        { name: 'videoUrl', title: 'Video Recording', type: 'url' },
        { name: 'slidesUrl', title: 'Slides URL', type: 'url' },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      conference: 'conference',
      date: 'date',
      type: 'type',
      city: 'location.city',
    },
    prepare({ title, conference, date, type, city }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '';
      return {
        title,
        subtitle: `${conference} - ${city || 'Online'} - ${formattedDate} (${type})`,
      };
    },
  },
  orderings: [
    {
      title: 'Date, Newest',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date, Oldest',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
});
