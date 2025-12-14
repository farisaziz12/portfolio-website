import { defineType, defineField } from 'sanity';

/**
 * Service Landing Page - SEO-optimized pages for specific services
 * Used for pages like /services/react-nextjs-consulting
 */
export default defineType({
  name: 'serviceLandingPage',
  title: 'Service Landing Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO', default: true },
    { name: 'hero', title: 'Hero Section' },
    { name: 'problem', title: 'Problem Section' },
    { name: 'expertise', title: 'Expertise Section' },
    { name: 'services', title: 'Services Section' },
    { name: 'audience', title: 'Target Audience' },
    { name: 'proof', title: 'Social Proof' },
    { name: 'faq', title: 'FAQ' },
    { name: 'cta', title: 'CTA Section' },
  ],
  fields: [
    // ─────────────────────────────────────────────────────────────
    // SEO GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Used for internal reference in Sanity',
      validation: (Rule) => Rule.required(),
      group: 'seo',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'URL path after /services/ (e.g., react-nextjs-consulting)',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: 'seo',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title tag for search engines (50-60 chars)',
      validation: (Rule) => Rule.max(70),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Meta description (150-160 chars)',
      validation: (Rule) => Rule.max(170),
      group: 'seo',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      description: 'Social sharing image (1200x630 recommended)',
      group: 'seo',
    }),

    // ─────────────────────────────────────────────────────────────
    // HERO GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Small text above headline (e.g., "Expert React & Next.js Consulting")',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main headline',
      validation: (Rule) => Rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 3,
      description: 'Supporting text below headline',
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string' },
        { name: 'url', title: 'URL', type: 'string' },
      ],
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string' },
        { name: 'url', title: 'URL', type: 'string' },
      ],
      group: 'hero',
    }),

    // ─────────────────────────────────────────────────────────────
    // PROBLEM GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'problemTitle',
      title: 'Problem Section Title',
      type: 'string',
      group: 'problem',
    }),
    defineField({
      name: 'painPoints',
      title: 'Pain Points',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
      group: 'problem',
    }),

    // ─────────────────────────────────────────────────────────────
    // EXPERTISE GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'expertiseTitle',
      title: 'Expertise Section Title',
      type: 'string',
      group: 'expertise',
    }),
    defineField({
      name: 'expertiseAreas',
      title: 'Expertise Areas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'icon', title: 'Emoji Icon', type: 'string' },
          ],
          preview: {
            select: { title: 'title', icon: 'icon' },
            prepare: ({ title, icon }) => ({ title: `${icon || ''} ${title}` }),
          },
        },
      ],
      group: 'expertise',
    }),

    // ─────────────────────────────────────────────────────────────
    // SERVICES GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'servicesTitle',
      title: 'Services Section Title',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'serviceOfferings',
      title: 'Service Offerings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Service Name', type: 'string' },
            { name: 'bestFor', title: 'Best For', type: 'string' },
            {
              name: 'includes',
              title: 'What\'s Included',
              type: 'array',
              of: [{ type: 'string' }],
            },
            { name: 'outcome', title: 'Outcome', type: 'string' },
            { name: 'highlightColor', title: 'Highlight Color', type: 'string', options: {
              list: [
                { title: 'Indigo', value: 'indigo' },
                { title: 'Violet', value: 'violet' },
                { title: 'Pink', value: 'pink' },
                { title: 'Emerald', value: 'emerald' },
              ],
            }},
          ],
          preview: {
            select: { title: 'name', subtitle: 'bestFor' },
          },
        },
      ],
      group: 'services',
    }),

    // ─────────────────────────────────────────────────────────────
    // AUDIENCE GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'audienceTitle',
      title: 'Audience Section Title',
      type: 'string',
      description: 'e.g., "Who This Is For"',
      group: 'audience',
    }),
    defineField({
      name: 'personas',
      title: 'Target Personas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Persona Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'icon', title: 'Emoji Icon', type: 'string' },
          ],
          preview: {
            select: { title: 'title', icon: 'icon' },
            prepare: ({ title, icon }) => ({ title: `${icon || ''} ${title}` }),
          },
        },
      ],
      group: 'audience',
    }),

    // ─────────────────────────────────────────────────────────────
    // SOCIAL PROOF GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'proofTitle',
      title: 'Social Proof Section Title',
      type: 'string',
      group: 'proof',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' },
          ],
          preview: {
            select: { value: 'value', label: 'label' },
            prepare: ({ value, label }) => ({ title: `${value} - ${label}` }),
          },
        },
      ],
      group: 'proof',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      group: 'proof',
    }),

    // ─────────────────────────────────────────────────────────────
    // FAQ GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string',
      group: 'faq',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text', rows: 4 },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
      group: 'faq',
    }),

    // ─────────────────────────────────────────────────────────────
    // CTA GROUP
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubheadline',
      title: 'CTA Subheadline',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA Button URL',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSecondaryText',
      title: 'Secondary Text',
      type: 'string',
      description: 'e.g., "Or email me at..."',
      group: 'cta',
    }),

    // ─────────────────────────────────────────────────────────────
    // DISPLAY OPTIONS
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description: 'Set to true to make page visible',
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
      title: 'title',
      slug: 'slug.current',
      published: 'published',
    },
    prepare({ title, slug, published }) {
      return {
        title,
        subtitle: `/${slug} ${published ? '✓' : '(draft)'}`,
      };
    },
  },
});
