import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
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
      name: 'source',
      title: 'Source/Link',
      type: 'url',
      description: 'Link to original testimonial (LinkedIn, Twitter, etc.)',
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'string',
      options: {
        list: [
          { title: 'Speaking', value: 'speaking' },
          { title: 'Mentorship', value: 'mentorship' },
          { title: 'Consulting', value: 'consulting' },
          { title: 'Collaboration', value: 'collaboration' },
        ],
      },
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
      media: 'image',
    },
    prepare({ quote, author, company, media }) {
      const truncatedQuote = quote?.length > 50 ? `${quote.slice(0, 50)}...` : quote;
      return {
        title: truncatedQuote,
        subtitle: `${author}${company ? ` - ${company}` : ''}`,
        media,
      };
    },
  },
});
