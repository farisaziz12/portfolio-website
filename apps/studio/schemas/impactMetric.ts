import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'impactMetric',
  title: 'Impact Metric',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'display', title: 'Display' },
    { name: 'proof', title: 'Proof & Sources' },
  ],
  fields: [
    // Content Fields
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'What this metric measures (e.g., "Events Delivered", "Revenue Impact")',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'impactCategory' }],
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'metricType',
      title: 'Metric Type',
      type: 'string',
      options: {
        list: [
          { title: 'Number', value: 'number' },
          { title: 'Currency', value: 'currency' },
          { title: 'Percentage', value: 'percentage' },
          { title: 'Multiplier', value: 'multiplier' },
          { title: 'Delta/Growth', value: 'delta' },
          { title: 'Rating', value: 'rating' },
          { title: 'Sponsor Logo', value: 'sponsor' },
        ],
        layout: 'radio',
      },
      initialValue: 'number',
      group: 'content',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      description: 'The numeric value (e.g., 50, 1.2, 98)',
      hidden: ({ parent }) => parent?.metricType === 'sponsor',
      group: 'content',
    }),
    defineField({
      name: 'prefix',
      title: 'Prefix',
      type: 'string',
      description: 'Symbol before the value (e.g., "$", "+", "€")',
      hidden: ({ parent }) => parent?.metricType === 'sponsor',
      group: 'content',
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'Symbol/text after the value (e.g., "+", "K", "M", "%", "x", "/5")',
      hidden: ({ parent }) => parent?.metricType === 'sponsor',
      group: 'content',
    }),
    defineField({
      name: 'unit',
      title: 'Unit Label',
      type: 'string',
      description: 'Unit of measurement shown below (e.g., "events", "attendees", "countries")',
      hidden: ({ parent }) => parent?.metricType === 'sponsor',
      group: 'content',
    }),
    defineField({
      name: 'timeWindow',
      title: 'Time Window',
      type: 'string',
      description: 'Time period for this metric (e.g., "2024", "Since 2022", "Last 12 months")',
      hidden: ({ parent }) => parent?.metricType === 'sponsor',
      group: 'content',
    }),
    defineField({
      name: 'previousValue',
      title: 'Previous Value',
      type: 'number',
      description: 'Previous value for calculating growth delta (optional)',
      hidden: ({ parent }) => parent?.metricType === 'sponsor',
      group: 'content',
    }),

    // Sponsor-specific fields
    defineField({
      name: 'sponsorLogo',
      title: 'Sponsor Logo',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.metricType !== 'sponsor',
      group: 'content',
    }),
    defineField({
      name: 'sponsorName',
      title: 'Sponsor Name',
      type: 'string',
      hidden: ({ parent }) => parent?.metricType !== 'sponsor',
      group: 'content',
    }),
    defineField({
      name: 'sponsorUrl',
      title: 'Sponsor URL',
      type: 'url',
      hidden: ({ parent }) => parent?.metricType !== 'sponsor',
      group: 'content',
    }),

    // Display Fields
    defineField({
      name: 'featured',
      title: 'Featured (Hero Metric)',
      type: 'boolean',
      description: 'Show as large hero metric on homepage',
      initialValue: false,
      group: 'display',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      group: 'display',
    }),
    defineField({
      name: 'highlightColor',
      title: 'Highlight Color',
      type: 'string',
      options: {
        list: [
          { title: 'Accent (Default)', value: 'accent' },
          { title: 'Violet', value: 'violet' },
          { title: 'Pink', value: 'pink' },
          { title: 'Emerald', value: 'emerald' },
          { title: 'Amber', value: 'amber' },
        ],
      },
      group: 'display',
    }),

    // Proof Fields
    defineField({
      name: 'sourceNote',
      title: 'Source Note',
      type: 'string',
      description: 'Credibility note (e.g., "Based on Stripe data", "Meetup.com analytics")',
      group: 'proof',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Link to verify the source',
      group: 'proof',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      group: 'proof',
    }),
    defineField({
      name: 'proofItems',
      title: 'Proof Items',
      type: 'array',
      group: 'proof',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Screenshot', value: 'screenshot' },
                  { title: 'Link', value: 'link' },
                  { title: 'Case Study', value: 'caseStudy' },
                  { title: 'Testimonial', value: 'testimonial' },
                  { title: 'Document', value: 'document' },
                ],
              },
            },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            {
              name: 'image',
              title: 'Image/Screenshot',
              type: 'image',
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.type !== 'screenshot',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              hidden: ({ parent }) =>
                !['link', 'caseStudy', 'document'].includes(parent?.type || ''),
            },
            {
              name: 'testimonialRef',
              title: 'Testimonial Reference',
              type: 'reference',
              to: [{ type: 'testimonial' }],
              hidden: ({ parent }) => parent?.type !== 'testimonial',
            },
          ],
          preview: {
            select: {
              title: 'title',
              type: 'type',
            },
            prepare({ title, type }) {
              const typeLabels: Record<string, string> = {
                screenshot: '📷',
                link: '🔗',
                caseStudy: '📄',
                testimonial: '💬',
                document: '📎',
              };
              return {
                title: title || 'Untitled',
                subtitle: typeLabels[type] || type,
              };
            },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Featured First, then Order',
      name: 'featuredOrder',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      label: 'label',
      value: 'value',
      prefix: 'prefix',
      suffix: 'suffix',
      featured: 'featured',
      metricType: 'metricType',
      sponsorName: 'sponsorName',
    },
    prepare({ label, value, prefix, suffix, featured, metricType, sponsorName }) {
      if (metricType === 'sponsor') {
        return {
          title: `🏢 ${sponsorName || 'Sponsor'}`,
          subtitle: label,
        };
      }
      const displayValue = `${prefix || ''}${value ?? ''}${suffix || ''}`;
      return {
        title: `${displayValue} ${label}`,
        subtitle: featured ? '⭐ Featured' : '',
      };
    },
  },
});
