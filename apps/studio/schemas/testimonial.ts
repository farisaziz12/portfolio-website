import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Testimonial Type',
      type: 'string',
      options: {
        list: [
          { title: 'LinkedIn Recommendation', value: 'linkedin' },
          { title: 'Workshop Review', value: 'workshop' },
          { title: 'Talk/Conference Review', value: 'talk' },
          { title: 'MentorCruise Review', value: 'mentorcruise' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'linkedin',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Author Role',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Author Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      description: 'For MentorCruise reviews or other rated testimonials',
      validation: (Rule) => Rule.min(1).max(5),
      hidden: ({ parent }) => parent?.type !== 'mentorcruise',
    }),
    defineField({
      name: 'source',
      title: 'Source/Link',
      type: 'url',
      description: 'Link to original testimonial (LinkedIn, Twitter, etc.)',
    }),
    defineField({
      name: 'context',
      title: 'Relationship Context',
      type: 'string',
      options: {
        list: [
          { title: 'Worked Together', value: 'worked_together' },
          { title: 'Managed Directly', value: 'managed' },
          { title: 'Reported to Me', value: 'reported' },
          { title: 'Mentored', value: 'mentored' },
          { title: 'Workshop Attendee', value: 'workshop_attendee' },
          { title: 'Conference Attendee', value: 'conference_attendee' },
          { title: 'Speaking Engagement', value: 'speaking' },
          { title: 'Consulting Client', value: 'consulting' },
          { title: 'Collaboration', value: 'collaboration' },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'When the testimonial was given',
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
      quote: 'quote',
      author: 'author',
      company: 'company',
      type: 'type',
      media: 'image',
      featured: 'featured',
    },
    prepare({ quote, author, company, type, media, featured }) {
      const truncatedQuote = quote?.length > 50 ? `${quote.slice(0, 50)}...` : quote;
      const typeIcons: Record<string, string> = {
        linkedin: '💼',
        workshop: '🛠️',
        talk: '🎤',
        mentorcruise: '🚀',
        other: '💬',
      };
      const icon = typeIcons[type] || '💬';
      return {
        title: `${icon} ${truncatedQuote}${featured ? ' ⭐' : ''}`,
        subtitle: `${author}${company ? ` - ${company}` : ''}`,
        media,
      };
    },
  },
});
