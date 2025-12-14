import { defineType, defineField } from 'sanity';

/**
 * Impact Page singleton - Configuration for /impact page
 * Controls hero copy, defaults, and featured metric selections
 */
export default defineType({
  name: 'impactPage',
  title: 'Impact Page Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'defaults', title: 'Default Settings' },
    { name: 'featured', title: 'Featured Metrics' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─────────────────────────────────────────────────────────────
    // HERO GROUP - Page header content
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main page headline',
      initialValue: 'Impact by the Numbers',
      validation: (Rule) => Rule.required().max(60),
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      description: 'Supporting text below the headline',
      initialValue:
        'Real results from community building, engineering leadership, and public speaking. Every number backed by data.',
      rows: 2,
      validation: (Rule) => Rule.max(200),
      group: 'hero',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Small text above the headline',
      initialValue: 'Measurable Results',
      validation: (Rule) => Rule.max(40),
      group: 'hero',
    }),

    // ─────────────────────────────────────────────────────────────
    // DEFAULTS GROUP - Explorer default state
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'defaultDomain',
      title: 'Default Domain',
      type: 'string',
      description: 'Domain tab selected by default',
      options: {
        list: [
          { title: 'All', value: 'all' },
          { title: 'Community', value: 'community' },
          { title: 'Product / Monetization', value: 'product' },
          { title: 'Engineering Leadership', value: 'leadership' },
          { title: 'Speaking', value: 'speaking' },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
      group: 'defaults',
    }),
    defineField({
      name: 'defaultLens',
      title: 'Default Lens',
      type: 'string',
      description: 'Lens view selected by default',
      options: {
        list: [
          { title: 'Outcomes', value: 'outcomes' },
          { title: 'How', value: 'how' },
          { title: 'Proof', value: 'proof' },
        ],
        layout: 'radio',
      },
      initialValue: 'outcomes',
      group: 'defaults',
    }),

    // ─────────────────────────────────────────────────────────────
    // FEATURED GROUP - Manual metric selections
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'highlightStripMetrics',
      title: 'Highlight Strip Metrics',
      type: 'array',
      description: 'Top 3 metrics shown in the quick stats strip (clickable)',
      of: [
        {
          type: 'reference',
          to: [{ type: 'impactMetricV2' }],
        },
      ],
      validation: (Rule) => Rule.max(3),
      group: 'featured',
    }),
    defineField({
      name: 'featuredMetricsCommunity',
      title: 'Featured Metrics - Community',
      type: 'array',
      description: 'Hero metrics for Community domain (3-6 metrics)',
      of: [
        {
          type: 'reference',
          to: [{ type: 'impactMetricV2' }],
        },
      ],
      validation: (Rule) => Rule.max(6),
      group: 'featured',
    }),
    defineField({
      name: 'featuredMetricsProduct',
      title: 'Featured Metrics - Product/Monetization',
      type: 'array',
      description: 'Hero metrics for Product domain (3-6 metrics)',
      of: [
        {
          type: 'reference',
          to: [{ type: 'impactMetricV2' }],
        },
      ],
      validation: (Rule) => Rule.max(6),
      group: 'featured',
    }),
    defineField({
      name: 'featuredMetricsLeadership',
      title: 'Featured Metrics - Engineering Leadership',
      type: 'array',
      description: 'Hero metrics for Leadership domain (3-6 metrics)',
      of: [
        {
          type: 'reference',
          to: [{ type: 'impactMetricV2' }],
        },
      ],
      validation: (Rule) => Rule.max(6),
      group: 'featured',
    }),
    defineField({
      name: 'featuredMetricsSpeaking',
      title: 'Featured Metrics - Speaking',
      type: 'array',
      description: 'Hero metrics for Speaking domain (3-6 metrics)',
      of: [
        {
          type: 'reference',
          to: [{ type: 'impactMetricV2' }],
        },
      ],
      validation: (Rule) => Rule.max(6),
      group: 'featured',
    }),

    // ─────────────────────────────────────────────────────────────
    // SEO GROUP - Meta information
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title tag for SEO (defaults to headline if empty)',
      validation: (Rule) => Rule.max(60),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Meta description for SEO',
      rows: 2,
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'heroHeadline',
    },
    prepare({ title }) {
      return {
        title: 'Impact Page Settings',
        subtitle: title || 'Configure the impact page',
      };
    },
  },
});
