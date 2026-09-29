import { defineType, defineField } from 'sanity';
import { SERVICE_TYPES, titleFor } from 'shared';
import { cta } from './_fields';

/**
 * A way to work together. /services shows one card per type (Events, Advisory,
 * Mentorship); /mentorship lists every mentorship offer. Legacy `consulting`
 * offers render as Advisory.
 */
export default defineType({
  name: 'serviceOffer',
  title: 'Service offer',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'pricing', title: 'Pricing & Booking' },
    { name: 'proof', title: 'Social Proof' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          ...SERVICE_TYPES.map(({ value, title }) => ({ value, title })),
          { title: 'Consulting (legacy → Advisory)', value: 'consulting' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'One-liner for cards (max 120 chars)',
      validation: (Rule) => Rule.max(120),
      group: 'content',
    }),
    defineField({
      name: 'audience',
      title: 'Audience tag',
      type: 'string',
      description: 'Top-right of the card: "Companies and founders · limited availability".',
      group: 'content',
    }),
    defineField({
      name: 'reachOutIf',
      title: 'Reach out if',
      type: 'text',
      rows: 3,
      description: 'Lower-case, finishes the sentence: "you want an outside view on frontend architecture…".',
      group: 'content',
    }),
    defineField({
      name: 'youGet',
      title: 'You get',
      type: 'text',
      rows: 3,
      description: 'Finishes the sentence: "a close look at where you are, and a clear, written view of what to change first."',
      group: 'content',
    }),
    cta('primaryCta', 'Card button', 'content'),
    cta('secondaryCta', 'Card secondary link', 'content'),
    defineField({
      name: 'bestFor',
      title: 'Best for',
      type: 'string',
      description: 'Who is this for? Used on /mentorship offer cards.',
      validation: (Rule) => Rule.max(100),
      group: 'content',
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [{ type: 'string' }],
      description: '3–5 specific outcomes (mentorship offer cards).',
      validation: (Rule) => Rule.max(5),
      group: 'content',
    }),
    defineField({
      name: 'engagementFormat',
      title: 'Engagement Format',
      type: 'string',
      options: {
        list: [
          { title: 'One-off Session', value: 'one-off' },
          { title: 'Package (Multiple Sessions)', value: 'package' },
          { title: 'Retainer', value: 'retainer' },
          { title: 'Project-based', value: 'project' },
        ],
      },
      group: 'pricing',
    }),
    defineField({
      name: 'showPricing',
      title: 'Show Pricing',
      type: 'boolean',
      initialValue: true,
      group: 'pricing',
    }),
    defineField({
      name: 'priceFrom',
      title: 'Starting Price',
      type: 'number',
      description: 'Starting price in USD (shown as "From $X")',
      hidden: ({ parent }) => !parent?.showPricing,
      group: 'pricing',
    }),
    defineField({
      name: 'priceCurrency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'USD ($)', value: 'USD' },
          { title: 'EUR (€)', value: 'EUR' },
          { title: 'CHF', value: 'CHF' },
        ],
      },
      initialValue: 'USD',
      hidden: ({ parent }) => !parent?.showPricing,
      group: 'pricing',
    }),
    defineField({
      name: 'priceUnit',
      title: 'Price Unit',
      type: 'string',
      options: {
        list: [
          { title: 'Per session', value: 'session' },
          { title: 'Per hour', value: 'hour' },
          { title: 'Per month', value: 'month' },
          { title: 'Fixed', value: 'fixed' },
        ],
      },
      hidden: ({ parent }) => !parent?.showPricing,
      group: 'pricing',
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'url',
      description: 'Cal.com or Calendly link for this specific offer',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'pricing',
    }),
    defineField({
      name: 'bookingLabel',
      title: 'Booking Button Label',
      type: 'string',
      initialValue: 'Book a call',
      group: 'pricing',
    }),
    defineField({
      name: 'proofLinks',
      title: 'Proof Links',
      type: 'array',
      description: 'Links to talks, case studies, or impact metrics related to this offer',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Talk', value: 'talk' },
                  { title: 'Case Study', value: 'case-study' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'Impact', value: 'impact' },
                  { title: 'Article', value: 'article' },
                ],
              },
            },
          ],
          preview: {
            select: { label: 'label', type: 'type' },
            prepare: ({ label, type }) => ({
              title: label,
              subtitle: type,
            }),
          },
        },
      ],
      group: 'proof',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Offer',
      type: 'boolean',
      description: 'Show on services overview page',
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      group: 'content',
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Type, then Order',
      name: 'typeOrder',
      by: [
        { field: 'serviceType', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      serviceType: 'serviceType',
      featured: 'featured',
    },
    prepare: ({ title, serviceType, featured }) => ({
      title: `${featured ? '★ ' : ''}${title}`,
      subtitle: serviceType === 'consulting' ? 'Advisory (legacy consulting)' : titleFor(SERVICE_TYPES, serviceType),
    }),
  },
});
