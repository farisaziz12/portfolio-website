import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Services Overview', value: 'overview' },
          { title: 'Consulting', value: 'consulting' },
          { title: 'Mentorship', value: 'mentorship' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // Hero Section
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Small text above the title (e.g., "Work with me")',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'One sentence: what you help with',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'heroBullets',
      title: 'Hero Bullets',
      type: 'array',
      of: [{ type: 'string' }],
      description: '2-3 outcome bullets for the hero',
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
      initialValue: 'Book a call',
    }),
    defineField({
      name: 'primaryCtaUrl',
      title: 'Primary CTA URL',
      type: 'url',
      description: 'Fallback booking URL if offer has none',
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA Label',
      type: 'string',
      initialValue: 'See my work',
    }),
    defineField({
      name: 'secondaryCtaUrl',
      title: 'Secondary CTA URL',
      type: 'string',
      description: 'Internal path like /impact or /projects',
    }),
    // Lane Cards (for overview page)
    defineField({
      name: 'consultingCard',
      title: 'Consulting Card',
      type: 'object',
      hidden: ({ parent }) => parent?.pageType !== 'overview',
      fields: [
        { name: 'title', title: 'Title', type: 'string', initialValue: 'Consulting' },
        { name: 'description', title: 'Description', type: 'text', rows: 2 },
        { name: 'forWhom', title: 'For Whom', type: 'string' },
        { name: 'icon', title: 'Icon (emoji)', type: 'string', initialValue: '💼' },
      ],
    }),
    defineField({
      name: 'mentorshipCard',
      title: 'Mentorship Card',
      type: 'object',
      hidden: ({ parent }) => parent?.pageType !== 'overview',
      fields: [
        { name: 'title', title: 'Title', type: 'string', initialValue: 'Mentorship' },
        { name: 'description', title: 'Description', type: 'text', rows: 2 },
        { name: 'forWhom', title: 'For Whom', type: 'string' },
        { name: 'icon', title: 'Icon (emoji)', type: 'string', initialValue: '🎓' },
      ],
    }),
    // How it Works
    defineField({
      name: 'howItWorks',
      title: 'How It Works Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'step', title: 'Step Number', type: 'number' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
          preview: {
            select: { step: 'step', title: 'title' },
            prepare: ({ step, title }) => ({
              title: `Step ${step}: ${title}`,
            }),
          },
        },
      ],
    }),
    // FAQ
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text', rows: 3 },
          ],
          preview: {
            select: { question: 'question' },
            prepare: ({ question }) => ({ title: question }),
          },
        },
      ],
    }),
    // Featured offers (references)
    defineField({
      name: 'featuredOffers',
      title: 'Featured Offers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'serviceOffer' }] }],
      description: 'Manually select which offers to highlight on this page',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
      ],
    }),
  ],
  preview: {
    select: {
      pageType: 'pageType',
      title: 'heroTitle',
    },
    prepare: ({ pageType, title }) => {
      const labels: Record<string, string> = {
        overview: '📋 Services Overview',
        consulting: '💼 Consulting Page',
        mentorship: '🎓 Mentorship Page',
      };
      return {
        title: labels[pageType] || pageType,
        subtitle: title,
      };
    },
  },
});
